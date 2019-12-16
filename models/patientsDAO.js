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
                attribId.push(i)
            }
            if(attribId.length > 0){
                var query="select testState from Test where ";
                for(i of attribId)
                conn.query("insert into Test (assignedDate, test_attribId) values (?, ?);", [new Date(), attribId], function(err, result){
                    conn.release();
                    if(err){
                        callback(err, {code:500, status: "Error in a database query"});
                        return;
                    }
                    callback(false, {code:200, status:"Ok"});
                });
            }   
        })
    })
}