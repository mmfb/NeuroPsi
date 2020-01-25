var mysql = require('./mysqlConn').pool;

module.exports.register = function(patients, callback, next){
    mysql.getConnection(function(err, conn){
        if (err) {conn.release(); next(err);}
        else{
            conn.query("insert into User (id, name) values (?,?)", [patients.id, patients.name], function(err, rows){
                conn.release();
                callback(rows);
            })
        }
    })
}

module.exports.searchPendingTests = function(patientId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("select attribId from Attribution where attrib_fileId = ?;", [patientId], function(err, result){
            if(err){
                callback(err, {code:500, status: "Error in a database query"})
                return;
            }
            var attribId = [];
            for(i of result){
                attribId.push(i.attribId);
            }
            if(attribId.length > 0){
                var values = ["Pending", attribId[0]]
                var query="select * from Test where testState = ? and (test_attribId = ?";;
                for(var i=1; i<attribId.length; i++){
                    query += " or test_attribId = ?"
                    values.push(attribId[i]);
                }
                query += ");";
                conn.query(query, values, function(err, result){
                    conn.release();
                    if(err){
                        callback(err, {code:500, status: "Error in a database query"});
                        return;
                    }
                    callback(false, {code:200, status:"Ok", tests: result});
                });
            }   
        })
    })
}

module.exports.saveReplay = function(testId, coords, rec, callback, next){
    var routeId;
    var result;
    var locId;
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("select locId, routeId, ST_Distance_Sphere(coords, point(?,?)) as distance from Location inner join Route on route_locId = locId inner join Test on test_routeId = routeId where distance < 500 and test_attribId in (select attribId from Attribution, Test where test_attribId = attribId and testId = ?) order by distance limit 0,1;",
        [coords.lng, coords.lat, testId], function(err, result){
            if(err){
                callback(err, {code:500, status: "Error in a database query"})
                return;
            }
            result = result[0];
        });
        if(result){
            routeId = result[0].routeId;
        }else{
            conn.query("insert into Location (coords) values (point(?,?));", [coords.lng, coords.lat], function(err, result){
                if(err){
                    callback(err, {code:500, status:"Error in a database query"})
                    return;
                }
                locId = result.insertId;
                
                conn.query("insert into Route (route_locId) values (?);", [locId], function(err, result){
                    if(err){
                        callback(err, {code:500, status: "Error in a database query"})
                        return;
                    }
                    routeId = result.insertId;

                    console.log(routeId)
                    conn.query("insert into Result (rec, completedDate, result_testId) values (?,?,?);", [rec, new Date(), testId], function(err, result){
                        if(err){
                            callback(err, {code:500, status: "Error in a database query"})
                            return;
                        }
                        conn.query("update Test set testState = ?, test_routeId = ? where testId = ?;", ["Completed", routeId, testId], function(err, result){
                            conn.release();
                            if(err){
                                callback(err, {code:500, status: "Error in a database query"})
                                return;
                            }
                            callback(false, {code:200, status:"Ok"});
                        });
                    })
                });
            })
        }
    })
}

/*function getRouteId(testId, coords, callback){
    var routeId;
    var locId;
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        console.log(coords.lng +"/"+ coords.lat)
        conn.query("select locId, routeId, ST_Distance_Sphere(coords, point(?,?)) as distance from Location inner join Route on route_locId = locId inner join test on test_routeId = routeId where test_attribId in (select attribId from Attribution, Test where test_attribId = attribId and testId = ?) order by distance limit 0,1;",
        [coords.lng, coords.lat, testId], function(err, result){
            if(err){
                callback(err, {code:500, status: "EEEError in a database query"})
                return;
            }
            locId = result[0];
            console.log("Result: "+result);
        });
        if(result[0] && result[0].distance < 1000){
            routeId = result[0].routeId;
        }else{
            var locId = saveLocation(coords, callback);

            conn.query("insert into Route (route_locId) values (?); select LAST_INSERT_ID();", [locId], function(err, result){
                conn.release();
                if(err){
                    callback(err, {code:500, status: "Error in a database query"})
                    return;
                }
                routeId = result[0];
            });
        }
    });
    return routeId;
}*/

module.exports.getPatientTests = function(patientId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("select testId, testState, assignedDate, completedDate, comment from Attribution inner join Test on test_attribId = attribId left outer join Result on testId = result_testId where attrib_fileId = ? order by assignedDate desc;",
        [patientId], function(err, result){
            conn.release();
            if(err){
                callback(err, {code:500, status:"Error in a database query"});
                return;
            }
            for(t of result){
                var formattedDate = t.assignedDate.getDate() + "-" + (t.assignedDate.getMonth() + 1) + "-" + t.assignedDate.getFullYear();
                t.assignedDate = formattedDate;
                if(t.completedDate){
                    formattedDate = t.completedDate.getDate() + "-" + (t.completedDate.getMonth() + 1) + "-" + t.completedDate.getFullYear();
                    t.completedDate = formattedDate;
                }else{
                    t.completedDate = "-";
                }
                if(!t.comment){
                    t.comment = "-";
                }
            }
            callback(false, {code:200, status:"Ok", tests: result});
        })
    })
}

/*function saveLocation(coords, callback){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("insert into Location (coords) values (point(?,?));", [coords.lng, coords.lat], function(err, result){
            if(err){
                callback(err, {code:500, status:"Error in a database query"})
                return;
            }
            console.log("1 "+result.insertId)
            var locId = result.insertId;
            console.log("2 "+locId);
            return locId
        })
    })
}*/