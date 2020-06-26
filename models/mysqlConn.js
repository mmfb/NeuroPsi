var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 60,
    host: 'remotemysql.com',
    user: 'iWt6KIcwKt',
    password: 'plnWbvnRx7',
    database: 'iWt6KIcwKt'
});

exports.pool = pool;