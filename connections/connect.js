
const sql = require ('mysql2')

const connection = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Doggo123',
    database: 'store_db',
  });

  module.exports = connection