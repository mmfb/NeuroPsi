var mysql = require('../public/javascripts/mysqlConn').pool;

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

module.exports.saveReplay = function(testId, rec, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("insert into Result (rec, completedDate, result_testId) values (?,?,?);", [JSON.stringify(rec), new Date(), testId], function(err, result){
            if(err){
                callback(err, {code:500, status: "Error in a database query"})
                return;
            }
            conn.query("update Test set testState = ? where testId = ?;", ["Completed", testId], function(err, result){
                if(err){
                    callback(err, {code:500, status: "Error in a database query"})
                    return;
                }
                callback(false, {code:200, status:"Ok"});
            });
        })
    })
}

module.exports.saveRoute = function(testId, waypoints, time, distance, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("insert into Route (waypoints, time, distance, route_testId) values (?,?,?,?)", [waypoints, time, distance, testId], function(err, result){
            if(err){
                callback(err, {code:500, status: "Error in a database query"})
                return;
            }
            callback(false, {code:200, status:"Ok"});
        });
    });
}

module.exports.getPatientTests = function(patientId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("select distinct testId, testState, assignedDate, completedDate, comment from Test left outer join Result on testId = result_testId, Patient where test_attribId in(select attribId from Attribution where attrib_fileId = 2);",
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