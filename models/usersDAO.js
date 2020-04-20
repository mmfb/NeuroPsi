
var mysql = require('./mysqlConn').pool;

module.exports.getUserIds = function(name, callback){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"});
            return
        }
        conn.query("select userId, patientId, neuroId from User left join Patient on userId = patient_userId left join Neuropsi on userId = neuro_userId where name = ?", [name], function(err, user){
            conn.release();
            if (err){
                callback(err, {code:500, status: "Error in a database query"});
                return;
            }
            var user = user[0];
            callback(false, {code: 200, status:"Ok", user: user});
        })
    })  
}

module.exports.getUser = function(params, callback){
    var queryParams = []
    var index = 0
    var query = "select userId, patientId, neuroId, name, sex, email, birthdate, TIMESTAMPDIFF(YEAR, birthdate, CURRENT_DATE()) as age, coords from Location inner join User on user_locId = locId left join Patient on userId = patient_userId left join Neuropsi on userId = neuro_userId where";
    for(p in params){
        query += " "+p+"=?"
        queryParams.push(params[p])
        if(index>0){
            query += " and"
        }
        index++
    }
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"});
            return
        }
        conn.query(query, queryParams, function(err, result){
            conn.release();
            if (err){
                callback(err, {code:500, status: "Error in a database query"});
                return;
            }
            var user = result[0];
            callback(false, {code: 200, status:"Ok", user: user});
        })
    })  
}

module.exports.getUserTests = function(userId, params, callback){
    var queryParams = [userId]
    var query = "select evalId, assignedDate, evalState, testId, creationDate, testTime, test_routeId, testType"+
                " from User left join Patient on patient_userId = userId left join Neuropsi on neuro_userId = userId"+
                " inner join Attribution on attrib_fileId = patientId or attrib_neuroId = neuroId"+
                " inner join Evaluation on eval_attribId = attribId inner join Test on eval_testId = testId"+
                " inner join (select attrib_testId, GROUP_CONCAT(typeName SEPARATOR ',') as testType"+
                " from Test inner join TestType_Attribution on attrib_testId = testId inner join TestType on attrib_typeId = testTypeId"+
                " group by testId) as type on testId = attrib_testId where userId = ?"
    for(p in params){
        query += " and "+p+"=?"
        queryParams.push(params[p])
    }
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"});
            return
        }
        conn.query(query, queryParams, function(err, result){
            conn.release();
            if (err){
                callback(err, {code:500, status: "Error in a database query"});
                return;
            }
            for(t of result){
                t.assignedDate = convertDate(t.assignedDate);
                t.completedDate = convertDate(t.completedDate);
                if(!t.comment){
                    t.comment = "-";
                }
                t.testType = t.testType.split(',')
            }
            var tests = result
            getTestsParams(conn, tests, callback)
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

function getTestsParams(conn, tests, callback){
    for(test of tests){
        var types = test.testType
        for(t of types){
            var testId = test.testId
            var query = "select * from "+t+" where "+t+"_testId = ?"
            conn.query(query, [testId], function(err, result){
                if(err){
                    callback(err, {code:500, status:"Error in a database query"})
                    return
                }
                test.test = []
                for(r of result){
                    test.test.push({type:t, params:[r]})
                    var id = r[t.toLowerCase()+"Id"]
                    var query = "select * from "+t+" where "+t+"_"+t+"Id = ?"
                    conn.query(query, [id], function(err, result){
                        if(err){
                            callback(err, {code:500, status:"Error in a database query"})
                            return
                        }
                        if(result.length > 0){
                            test.test[test.test.length-1].params.push(result[0])
                            id = result[0][t.toLowerCase()+"Id"]
                            getSameTestParams(conn, id, t, test, tests, callback)
                        }else{
                            if(tests.indexOf(test) == tests.length-1){
                                callback(false, {code:200, status:"Ok", tests:tests})
                            }
                        }
                    })   
                }
            })
        }
    }
}

function getSameTestParams(conn, id, type, test, tests, callback){
    var query = "select * from "+type+" where "+type+"_"+type+"Id = ?"
    conn.query(query, [id], function(err, result){
        if(err){
            callback(err, {code:500, status:"Error in a database query"})
            return
        }
        if(result.length > 0){
            test.test[test.test.length-1].params.push(result[0])
            id = result[0][t.toLowerCase()+"Id"]
            getSameTestParams(conn, id, t, test, tests, callback)
        }else{
            if(tests.indexOf(test) == tests.length-1){
                callback(false, {code:200, status:"Ok", tests:tests})
            }
        }
    })   
}



