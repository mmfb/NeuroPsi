var mysql = require('../public/javascripts/mysqlConn').pool;

module.exports.getNeroPatients = function(neroId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"})
            return;
        }
        conn.query("select patientId, name, email, TIMESTAMPDIFF(YEAR, birthdate, CURRENT_DATE()) as age, user_locId from User, Patient, Attribution where userId = patient_userId and patient_userId = attrib_fileId and attrib_neroId = ?", 
        [neroId], function(err, result){
            conn.release();
            if(err){
                callback(err, {code:500, status: "Error in a database query"})
                return;
            }
            callback(false, {code:200, status:"Ok", patients: result});
        })
    })
};

module.exports.getPatientInfo = function(patientId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("select patientId, name, sex, TIMESTAMPDIFF(YEAR, birthdate, CURRENT_DATE()) as age from User, Patient where patientId = ? and patient_userId = userId;",
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

module.exports.postTest = function(patientId, neroId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("select attribId from Attribution where attrib_fileId = ? and attrib_neroId = ?;", [patientId, neroId], function(err, result){
            if(err){
                callback(err, {code:500, status: "Error in a database query"})
                return;
            }
            var attribId = result[0].attribId;

            conn.query("insert into Test (assignedDate, test_attribId) values (?, ?);", [new Date(), attribId], function(err, result){
                conn.release();
                if(err){
                    callback(err, {code:500, status: "Error in a database query"});
                    return;
                }
                callback(false, {code:200, status:"Ok"});
            });
        })
    })
}

module.exports.getReplay = function(patientId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"})
            return;
        }
        conn.query("select rec from Replay, Test, Attribution where replay_testId = testId and test_attribId = attribId and attrib_fileId = ?", [patientId], function(err, result){
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

module.exports.getPatientTests = function(patientId, neroId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status:"Error in the connection to the database"})
            return;
        }
        conn.query("select distinct testId, testState, assignedDate, completedDate, comment from Test left outer join Result on testId = result_testId, File, Neropsi where test_attribId in(select attribId from Attribution where attrib_fileId = ? and attrib_neroId = ?);",
        [patientId, neroId], function(err, result){
            conn.release();
            if(err){
                callback(err, {code:500, status:"Error in a database query"});
                return;
            }
            for(t of result){
                var formattedDate = t.assignedDate.getDate() + "-" + (t.assignedDate.getMonth() + 1) + "-" + t.assignedDate.getFullYear();
                t.assignedDate = formattedDate;
                formattedDate = t.completedDate.getDate() + "-" + (t.completedDate.getMonth() + 1) + "-" + t.completedDate.getFullYear();
                t.completedDate = formattedDate;
            }
            callback(false, {code:200, status:"Ok", tests: result});
        })
    })
}

module.exports.getPatientRoutes = function(neroId, patientId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"})
            return;
        }
        conn.query("select waypoints, time, distance from Route where route_testId in (select testId from Test where test_attribId in (Select attribId from Attribution where attrib_fileId = ? and attrib_neroId = ?));", [patientId, neroId], function(err, result){
            conn.release();
            if(err){
                callback(err, {code:500, status:"Error in a databse query"});
                return;
            }
            var routes = result;
            callback(false, {code:200, status:"Ok", routes: routes});
        })
    })
}