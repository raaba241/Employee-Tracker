const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'host',
    password: 'Doggo123',
    database: 'your_database'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

// Perform database operations here

connection.end();

module.exports = connection;