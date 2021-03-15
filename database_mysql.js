var mysql = require('mysql');
require('dotenv').config()

var conn = mysql.createConnection({
    host : process.env.DB_HOST,
    user :process.env.DB_USERNAME,
    password :process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

conn.connect();

var sql = 'select * from topic';
conn.query(sql, (err, rows, fields)=>{
    if(err) {
        console.log(err);
    } else{
        console.log('rows :', rows);
        // console.log('fields :',fields)
    }
})

conn.end();