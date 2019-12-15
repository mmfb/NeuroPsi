var mysql = require('../public/javascripts/mysqlConn').pool;

var patients = [
    {
        id:"11323",
        name:"José Carlos",
        age:29
    },
    {
        id:"11368",
        name:"João Gato",
        age:41
    },
    {
        id:"11523",
        name:"Gabriel Gois",
        age:32
    },
    {
        id:"32212",
        name:"Carla Rodrigues",
        age:37
    },
    {
        id:"32142",
        name:"Manuel Simão",
        age:56
    },
    {
        id:"11323",
        name:"José Carlos",
        age:29
    },
    {
        id:"11368",
        name:"João Gato",
        age:41
    },
    {
        id:"11523",
        name:"Gabriel Gois",
        age:32
    },
    {
        id:"32212",
        name:"Carla Rodrigues",
        age:37
    },
    {
        id:"32142",
        name:"Manuel Simão",
        age:56
    }
];

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
            var patients;
            for(p of result){
                patients.push(result[0])
            }
            callback(false, {code:200, status:"Ok", patients: patients});
        })
    })
};