var mysql = require('./mysqlConn').pool;

module.exports.getNeuroSavedTests = function(neuroId, filters, callback){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"});
            return
        }
        var values = [neuroId]
        var query = "select typeName from ExerType;"
        conn.query(query, [], function(err, result){
            if(err){
                callback(err, {code:500, status:err})
                return
            }
            var exerTypes = result.map(type => type.typeName)

            query = "select * from Test left join Exercise on exer_testId = testId"
            for(type of exerTypes){
                query+=" left join "+type+" on exerId = "+type.toLowerCase()+"_exerId" 
            }
            query += " inner join SavedTest on savedTest_testId = testId inner join Neuropsi on neuroId = savedTest_neuroId left join ExerType_Attribution on attrib_exerId = exerId left join ExerType on attrib_typeId = exerTypeId where neuroId = ?"
            for(f in filters){
                query+=" and "+f+"=?"
                values.push(filters[f])
            }
            query += " order by exerId;"
            conn.query(query, values, function(err, result){
                if (err){
                    callback(err, {code:500, status: err});
                    return;
                }
                var tests = []
                var firstDiffIdIndex = 0
                for(i=0;i<result.length;i++){
                    if((result[i+1] && result[i].testId != result[i+1].testId) || !result[i+1]){
                        var slice = result.slice(firstDiffIdIndex,i+1)
                        firstDiffIdIndex = i+1
                        var test = sliceObject(slice[0], "testId", "exerId")
                        test.exer = []
                        var exer = sliceObject(slice[0], "exerId", "exer_testId")
                        exer.params = []
                        for(param of slice){
                            if(exer.exerId != param.exerId){
                                test.exer.push(exer)
                                exer = sliceObject(param, "exerId", "exer_testId")
                                exer.params = []
                            }
                            if(param.typeName){
                                exer.params.push(sliceObject(param, param.typeName.toLowerCase()+"Id", param.typeName.toLowerCase()+"_exerId"))
                            }
                        }
                        test.exer.push(exer)
                        tests.push(test)
                    }
                }
                callback(false, {code:200, status:"Ok", tests: tests});
            })
        })
    })  
}

function sliceObject(obj, key1, key2){
    return Object.keys(obj).slice(Object.keys(obj).indexOf(key1), Object.keys(obj).indexOf(key2)).reduce((a, c) => Object.assign(a, { [c]: obj[c] }), {})
}

function saveExistingTest(conn, neuroId, oldTestId, newTestId, callback){
    var query = "select savedTestId from SavedTest where savedTest_testId = ? and savedTest_neuroId = ?"
    conn.query(query, [oldTestId, neuroId], function(err, result){
        if(err){
            callback(err, {code:500, status:err})
            return
        }
        query = "update SavedTest set savedTest_testId = ? where savedTestId = ?;"
        conn.query(query, [newTestId, result.saveTestId], function(err, result){
            if(err){
                callback(err, {code:500, status:err})
                return
            }
        })
    })
}

module.exports.saveTest = function(neuroId, test, callback){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:err})
            return;
        }
        var query = "insert into Test (creationDate, testTime, testTitle) values (?,?,?)"
        conn.query(query, [new Date(), test.testTime, test.testTitle], function(err, result){
            if(err){
                callback(err, {code:500, status:err})
                return
            }
            var testId = result.insertId
            insertExercisesRows(conn, test, testId, callback)
            insertSavedTestRows(conn, testId, neuroId, callback)
            if(test.hasOwnProperty("testId")){
                saveExistingTest(conn, neuroId, test.testId, testId, callback)
            }
            //callback(false, {code:200, status:"Ok", testId: testId});
        })
    })
}

function insertExerTypeAttribRows(conn, type, exerId, callback){
    var query = "select exerTypeId from ExerType where typeName = ?;"
    conn.query(query, [type], function(err, result){
        if(err){
            callback(err,{code:500, status:err})
            return
        }
        var exerTypeId = result[0].exerTypeId
        query = "insert into ExerType_Attribution (attrib_typeId, attrib_exerId) values (?,?)"
        conn.query(query, [exerTypeId, exerId], function(err, result){
            if(err){
                callback(err,{code:500, status:err})
                return
            }
        })
    })
}

function insertSavedTestRows(conn, testId, neuroId, callback){
    console.log(neuroId)
    var query = "insert into SavedTest (savedTest_neuroId, savedTest_testId) values (?,?)"
    conn.query(query, [neuroId, testId], function(err, result){
        if(err){
            callback(err, {code:500, status:err})
            return
        }
        callback(false, {code:200, status:"Ok", testId: testId});
    })
}

function insertExercisesRows(conn, test, testId, callback){
    if(test.exer.length>0){
        var exer = test.exer[0]
        var query = "insert into Exercise (exerTime, exer_testId) values (?,?)"
        conn.query(query, [exer.exerTime, testId], function(err, result){
            if(err){
                callback(err, {code:500, status:err})
                return
            }
            var exerId = result.insertId
            insertExerTypeAttribRows(conn, exer.type, exerId, callback)
            insertParamsRows(conn, exer, exerId, callback)
            test.exer.shift()
            insertExercisesRows(conn, test, testId, callback)
        })
    }
}

function insertParamsRows(conn, exer, exerId, callback){
    for(params of exer.params){
        var query = "insert into "+exer.type+" ("
        var values = []
        var str = "("
        for(key in params){
            if(params[key]){
                console.log(key+": "+params[key])
                query+=key+","
                values.push(params[key])
                str+="?,"
            }
        }
        query+=exer.type.toLowerCase()+"_exerId) values "
        values.push(exerId)
        str+="?)"
        query+=str+";"
        conn.query(query, values, function(err, result){
            if(err){
                callback(err, {code:500, status:err})
                return
            }
        })
    }
}

module.exports.getNeuroPatients = function(neuroId, filters, callback){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"})
            return;
        }
        var query = "select userId, patientId, name, sex, email, birthdate, TIMESTAMPDIFF(YEAR, birthdate, CURRENT_DATE()) as age, attribId, locId from Location right join User on user_locId = locId inner join Patient on patient_userId = userId inner join File on file_patientId = patientId inner join Attribution on attrib_fileId = patientId where attrib_neuroId = ?"
        var values = [neuroId]
        for(f in filters){
            query+=" and "+f+"=?"
            values.push(filters[f])
        }
        conn.query(query, values, function(err, result){
            conn.release();
            if(err){
                callback(err, {code:500, status: "Error in a database query"})
                return;
            }
            callback(false, {code:200, status:"Ok", patients: result});
        })
    })
};

module.exports.getPatient = function(patientId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("select userId, patientId, name, sex, email, birthdate, TIMESTAMPDIFF(YEAR, birthdate, CURRENT_DATE()) as age, user_locId from Location inner join User on user_locId=locId inner join Patient on patient_userId=userId where patientId = ?;",
        [patientId], function(err, result){
            conn.release();
            if(err){
                callback(err, {code:500, status:"Error in a database query"})
                return;
            }
            callback(false, {code:200, status:"Ok", patient: result[0]})
        })
    })
}

module.exports.scheduleTest = function(testId, attribId, callback){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("insert into Evaluation (assignedDate, eval_attribId, eval_testId) values (?,?,?);", [new Date(), attribId, testId], function(err, result){
            conn.release();
            if(err){
                callback(err, {code:500, status: "Error in a database query"});
                return;
            }
            callback(false, {code:200, status:"Ok"});
        });
    })
}

module.exports.getReplay = function(testId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"})
            return;
        }
        conn.query("select rec from Result where result_testId = ?", [testId], function(err, result){
            conn.release();
            if(err){
                callback(err, {code:500, status:"Error in a databse query"});
                return;
            }
            
            var rec = result[0].rec;
            callback(false, {code:200, status:"Ok", rec: rec});
        })
    })
}

module.exports.getNeuroPatientTests = function(attribId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("select testId, testState, assignedDate, completedDate, comment from Result right outer join Test on testId = result_testId inner join Attribution on test_attribId = attribId where attribId = ?;",
        [attribId], function(err, result){
            conn.release();
            if(err){
                callback(err, {code:500, status:"Error in a database query"});
                return;
            }
            for(t of result){
                t.assignedDate = convertDate(t.assignedDate);
                t.completedDate = convertDate(t.completedDate);
                if(!t.comment){
                    t.comment = "-";
                }
            }
            callback(false, {code:200, status:"Ok", tests: result});
        })
    })
}

function convertDate(date){
    if(date){
        var formattedDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        return formattedDate;
    }else{
        return "-";
    } 
}

module.exports.getNeuroTestsRoutes = function(neuroId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"})
            return;
        }
        conn.query("select MAX(attrib_fileId) as patientId, MAX(name) as name, MAX(testId) as testId, count(routeId) as repetitions, coords, waypoints, time, distance from Location inner join Route on route_locId = locId inner join Test on test_routeId = routeId inner join Attribution on test_attribId = attribId inner join Patient on attrib_fileId = patientId inner join User on patient_userId = userId where attrib_neuroId = ? and (testState = ? or testState = ?) group by routeId order by patientId;", 
        [neuroId, "Completed", "Filed"], function(err, result){
            conn.release();
            if(err){
                callback(err, {code:500, status:"Error in a databse query"});
                return;
            }
            var testsRoutes = [];

            for(i=0; i<result.length; i++){
                if(!result[i+1] || result[i+1].patientId != result[i].patientId){
                  var splice = result.splice(0,i+1);
                  var patientRoutes = [];
                  var patientId = splice[0].patientId;
                  var name = splice[0].name;
                  for(r of splice){
                      patientRoutes.push({testId: r.testId, repetitions: r.repetitions, coords: r.coords, waypoints: r.waypoints, time: r.time, distance: r.distance})
                  }
                  testsRoutes.push({patientId: patientId, name: name, patientRoutes: patientRoutes});
                  i=-1;
                }
              }
            callback(false, {code:200, status:"Ok", testsRoutes: testsRoutes});
        })
    })
}

module.exports.fileTest = function(testId, comment, callback){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("update Test set testState = ? where testId = ?;", ["Filed", testId], function(err){
            if(err){
                callback(err, {code:500, status: "Error in a database query"});
                return;
            }
            conn.query("update Result set comment = ? where result_testId = ?;", [comment, testId], function(err){
                conn.release();
                if(err){
                    callback(err, {code:500, status: "Error in a database query"});
                    return;
                }
                callback(false, {code:200, status:"Ok"});
            });
        });
    })
}

module.exports.rescheduleTest = function(testId, attribId, comment, callback){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("update Test set testState = ? where testId = ?;", ["Reschedule", testId], function(err){
            if(err){
                callback(err, {code:500, status: "Error in a database query"});
                return;
            }
            conn.query("update Result set comment = ? where result_testId = ?;", [comment, testId], function(err){
                if(err){
                    callback(err, {code:500, status: "Error in a database query"});
                    return;
                }
                conn.query("insert into Test (assignedDate, test_attribId) values (?, ?);", [new Date(), attribId], function(err, result){
                    if(err){
                        callback(err, {code:500, status: "Error in a database query"});
                        return;
                    }
                    conn.query("insert into Reschedule (resched_testId, resched_newTestId) values (?,?)", [testId, result.insertId], function(err, result){
                        conn.release();
                        if(err){
                            callback(err, {code:500, status: "Error in a database query"});
                            return;
                        }
                        callback(false, {code:200, status:"Ok"});
                    })
                }); 
            });
        });
    })
}

module.exports.getNeuroPatientsTestsByState = function(neuroId, testState, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"})
            return;
        }
        conn.query("select testId, testState, assignedDate, completedDate, comment from Result right outer join Test on testId = result_testId inner join Attribution on test_attribId = attribId where attrib_neuroId = ? and testState = ?", 
        [neuroId, testState], function(err, result){
            conn.release();
            if(err){
                callback(err, {code:500, status:"Error in a databse query"});
                return;
            }
            callback(false, {code:200, status:"Ok", tests: result});
        })
    })
}

module.exports.saveRoutes = function(testId, waypoints, time, distance, callback){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("update Route set waypoints=?, time=?, distance=? where routeId in (select test_routeId from Test where testId = ?);", [waypoints, time, distance, testId], function(err, result){
            conn.release();
            if(err){
                callback(err, {code:500, status: "Error in a database query"});
                return;
            }
            callback(false, {code:200, status:"Ok"});
        });
    })
}


