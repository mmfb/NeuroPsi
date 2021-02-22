var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 60,
    host: 'remotemysql.com',
    user: 'M9oxyXkESZ',
    password: 'HWBnniWuKf',
    database: 'M9oxyXkESZ'
});

exports.pool = pool;
