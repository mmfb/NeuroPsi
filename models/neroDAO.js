var mysql = require('../public/javascripts/mysqlConn').pool;

module.exports.getNeroPatients = function(neroId, callback, next){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"})
            return;
        }
        conn.query("select patientId, name, email, birthdate, user_locId from User, Patient, Attribution where userId = patient_userId and patient_userId = attrib_fileId and attrib_neroId = ?", 
        [neroId], function(err, result){
            conn.release();
            if(err){
                callback(err, {code:500, status: "Error in a database query"})
                return;
            }
            var patients= [];
            for(p of result){
                patients.push(p)
            }
            callback(false, {code:200, status:"Ok", patients: patients});
        })
    })
};

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