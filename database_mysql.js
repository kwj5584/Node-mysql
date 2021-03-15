var mysql = require('mysql');
var conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'rlagnlwls12',
    database : 'o2'
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