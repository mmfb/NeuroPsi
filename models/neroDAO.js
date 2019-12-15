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