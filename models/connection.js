var mysql = require('mysql');

var connection = mysql.createConnection({
    host:    'localhost',
    user:    'root',
    password: 'root',
    database: 'photos',
    port: 8889
});

module.exports = connection;
