
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


module.exports.getUserEvals = function(user, id, filters, callback){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"});
            return
        }
        var query = "select typeName from ExerType;"
        conn.query(query, [], function(err, result){
            if(err){
                callback(err, {code:500, status:err})
                return
            }
            var exerTypes = result.map(type => type.typeName)

            query = "select * from Test left join Exercise on exer_testId = testId"
            var values = [id]
            for(type of exerTypes){
                query+=" left join "+type+" on exerId = "+type.toLowerCase()+"_exerId left join "+type+"Result on "+type.toLowerCase()+"Result_"+type.toLowerCase()+"Id = "+type.toLowerCase()+"Id" 
            }
            query += " inner join Evaluation on eval_testId = testId"+ 
                     " inner join Attribution on eval_attribId = attribId"+
                     " inner join File on attrib_fileId = fileId"+
                     " inner join Patient on file_patientId = patientId"+
                     " inner join Neuropsi on neuroId = attrib_neuroId"+
                     " inner join User on userId = "
                     if(user == "neuro"){
                         query += "patient_userId"
                     }else{
                         query += "neuro_userId"
                     }
            query += " left join ExerType_Attribution on attrib_exerId = exerId"+
                     " left join ExerType on attrib_typeId = exerTypeId"+
                     " where "+user+"Id = ? "  
            for(f in filters){
                query+="and "+f+" = ? "
                values.push(filters[f])
            }
            query += "order by exerId;"
            conn.query(query, values, function(err, result){
                if (err){
                    callback(err, {code:500, status: err});
                    return;
                }
                var evals = []
                var firstDiffIdIndex = 0
                for(i=0;i<result.length;i++){
                    if((result[i+1] && result[i].testId != result[i+1].testId) || !result[i+1]){
                        var slice = result.slice(firstDiffIdIndex,i+1)
                        firstDiffIdIndex = i+1
                        var test = sliceObject(slice[0], "testId", "exerId")
                        var eval = sliceObject(slice[0], "evalId", "eval_attribId")
                        test = {...eval, ...test}
                        test.creationDate = convertDate(test.creationDate)
                        test.assignedDate = convertDate(test.assignedDate)
                        test.completedDate = convertDate(test.completedDate)
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
                                var p = sliceObject(param, param.typeName.toLowerCase()+"Id", param.typeName.toLowerCase()+"_exerId")
                                var result = sliceObject(param, param.typeName.toLowerCase()+"ResultId", param.typeName.toLowerCase()+"Result_"+param.typeName.toLowerCase()+"Id")
                                p.result = result
                                p.type = param.typeName
                            }
                            exer.params.push(p)
                        }
                        test.exer.push(exer)
                        if(user == "neuro"){
                            var patient = sliceObject(slice[0], "name", "user_locId")
                            patient.patientId = slice[0].patientId
                            test.patient = patient
                        }else{
                            var neuro = sliceObject(slice[0], "name", "user_locId")
                            neuro.neuroId = slice[0].neuroId
                            test.neuro = neuro
                        }
                        evals.push(test)
                    }
                }
                callback(false, {code:200, status:"Ok", evals: evals});
            })
        })
    })  
}

function sliceObject(obj, key1, key2){
    return Object.keys(obj).slice(Object.keys(obj).indexOf(key1), Object.keys(obj).indexOf(key2)).reduce((a, c) => Object.assign(a, { [c]: obj[c] }), {})
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



