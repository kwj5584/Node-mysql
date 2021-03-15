var mysql = require('mysql');
require('dotenv').config()

var conn = mysql.createConnection({
    host : process.env.DB_HOST,
    user :process.env.DB_USERNAME,
    password :process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

conn.connect();

// var sql = 'select * from topic';
// conn.query(sql, (err, rows, fields)=>{
//     if(err) {
//         console.log(err);
//     } else{
//         for(var i=0; i<rows.length;i++){
//             console.log(rows[i].title)
//         }
//     }
// })

var sql = 'insert into topic (title,description,author) values(?, ?, ?)';
var params = ['Supervisor', 'Watcher', 'graphittie']
conn.query(sql,params, (err,rows,fields)=>{
    if(err){
        console.log(err);
    } else{
        console.log(rows.insertId);
    }
})
conn.end();