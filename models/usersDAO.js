
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

module.exports.getUser = function(userId, callback){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"});
            return
        }
        conn.query("select userId, patientId, neuroId, name, sex, email, birthdate, TIMESTAMPDIFF(YEAR, birthdate, CURRENT_DATE()) as age, coords from Location inner join User on user_locId = locId left join Patient on userId = patient_userId left join Neuropsi on userId = neuro_userId where userId = ?", [userId], function(err, user){
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

module.exports.getUserTests = function(userId, testState, callback){
    mysql.getConnection(function(err, conn){
        if(err){
            callback(err, {code:500, status: "Error in the connection to the database"});
            return
        }
        var query = "select testId, testState, assignedDate, completedDate, comment from User left join Patient on patient_userId = userId left join Neuropsi on neuro_userId = userId inner join Attribution on attrib_fileId = patientId or attrib_neuroId = neuroId inner join Test on test_attribId = attribId left join Result on result_testId = testId where userId = ?";
        var values = [userId];
        if(testState !== 'undefined'){
            testState = JSON.parse(testState)
            query += " and testState in (?";
            if(Array.isArray(testState)){
                values.push(testState[0])
                for(i=1; i<testState.length; i++){
                    query += ",?"
                    values.push(testState[i])
                }
            }else{
                values.push(testState)
            }
            query += ");"
        }
        conn.query(query, values, function(err, result){
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
            }
            callback(false, {code: 200, status:"Ok", tests: result});
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
