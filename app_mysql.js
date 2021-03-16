var express = require('express');
var bodyParser = require('body-parser');
// var multer = require("multer");
// var _storage = multer.diskStorage({
//     destination: function( req, file, cb ){
//         cb(null, 'uploads/')
//     },
//     filename : function(req,file,cb){
//         cb(null, file.originalname)
//     }
// })
// var upload = multer({storage:_storage})
// var fs = require('fs')
var mysql = require('mysql');
var app = express();
app.locals.pretty = true;
require('dotenv').config()

var conn = mysql.createConnection({
    host : process.env.DB_HOST,
    user :process.env.DB_USERNAME,
    password :process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    // port : process.env.DB_PORT
});
app.set('view engine', 'jade');
app.set('views', './views_mysql');
app.use('/user', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

conn.connect(); 

app.get(['/topic', '/topic/:id'], (req,res)=>{
    var sql = 'select id,title from topic';
    conn.query(sql, (err, topics, fields)=>{
        if(err){
            res.status(500).json(err);
            console.log(err)
        }else{
        res.render('view',{topics:topics});
        
    }
    });
})


app.listen(3000,()=>{
    console.log(`app listening at http://localhost:3000`)
})
