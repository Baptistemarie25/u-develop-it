const mysql = require('mysql2');


//connect to database

const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user:'root',
        // Your MySQL password
        password:'freedoM$$',
        database:'election'
    },
    console.log('connected to the election database')
);

module.exports = db;