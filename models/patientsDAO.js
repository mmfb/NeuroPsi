const { param } = require('../routes/neurosRouts');

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

module.exports.saveReplay = function(testId, coords, rec, callback){
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

module.exports.cancelTest = function(testId, comment, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("update Test set testState = ? where testId = ?;", ["Canceled", testId], function(err){
            if(err){
                callback(err, {code:500, status: "Error in a database query"});
                return;
            }
            conn.query("insert into Result (completedDate, comment, result_testId) values (?,?,?);", [new Date(), comment, testId], function(err){
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

module.exports.getPatientTests = function(patientId, conditions, callback){
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

            query = "select * from Test inner join Exercise on exer_testId = testId"
            var values = [patientId]
            for(type of exerTypes){
                query+=" left join "+type+" on exerId = "+type.toLowerCase()+"_exerId" 
            }
            query += " inner join Evaluation on eval_testId = testId inner join Attribution on eval_attribId = attribId inner join File on attrib_fileId = fileId inner join ExerType_Attribution on attrib_exerId = exerId inner join ExerType on attrib_typeId = exerTypeId where fileId = ? " 
            for(c in conditions){
                query+="and "+c+" = ? "
                values.push(conditions[c])
            }
            query += "order by exerId"
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
                            var p = sliceObject(param, param.typeName.toLowerCase()+"Id", param.typeName.toLowerCase()+"_exerId")
                            p.type = param.typeName
                            exer.params.push(p)
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

function convertDate(date){
    if(date){
        var formattedDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        return formattedDate;
    }else{
        return "-";
    } 
}

function sliceObject(obj, key1, key2){
    return Object.keys(obj).slice(Object.keys(obj).indexOf(key1), Object.keys(obj).indexOf(key2)).reduce((a, c) => Object.assign(a, { [c]: obj[c] }), {})
}


module.exports.saveResults = function(patientId, test, callback){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"});
            return
        }
        for(exer of test.exer){
            for(param of exer.params){
                if(exer.type == "Draw"){
                    var score = 100 - getDiff(param.data)

                    conn.query('insert into DrawResult (rec, score) values (?,?)', [param.rec, score], function(err, result){
                        if(err){
                            callback(err, {code:500, status:err})
                            return
                        }
                    })
                }else{
                    var correctAnswer;
                    if(param.answer == param.correctAnswer){
                        correctAnswer = true;
                    }else{
                        correctAnswer = false
                    }
                    conn.query('insert into DigitsResult (answer, score) values (?,?)', [param.rec, score], function(err, result){
                        if(err){
                            callback(err, {code:500, status:err})
                            return
                        }
                    })
                }
            }
        }   
    }) 
}

const compare = require("resemblejs").compare;

function getDiff (data, callback){
    const options = {
        // stop comparing once determined to be > 5% non-matching; this will
        // also enable compare-only mode and no output image will be rendered;
        // the combination of these results in a significant speed-up in batch processing
        returnEarlyThreshold: 5
    };

    // The parameters can be Node Buffers
    // data is the same as usual with an additional getBuffer() function
    compare(data.img1, data.img2, options, function(err, data) {
        if (err) {
            console.log("An error!");
        } else {
            return data.misMatchPercentage
            /*
            {
            misMatchPercentage : 100, // %
            isSameDimensions: true, // or false
            dimensionDifference: { width: 0, height: -1 }, // defined if dimensions are not the same
            getImageDataUrl: function(){}
            }
            */
        }
    });
}