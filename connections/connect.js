//Including the mysql2 package in my project
const sql = require ('mysql2')
//Standard connection to database
const connection = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Doggo123',
    database: 'store_db',
  });
//Exporting connection to be used elsewhere 
module.exports = connection