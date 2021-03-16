const express = require('express');
const bodyParser = require('body-parser');

const mysql = require('mysql');
const app = express();
app.locals.pretty = true;
require('dotenv').config()

const conn = mysql.createConnection({
    host : process.env.DB_HOST,
    user :process.env.DB_USERNAME,
    password :process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
});

app.set('view engine', 'jade');
app.set('views', './views_mysql');
app.use('/user', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

conn.connect(); 

app.get(['/topic', '/topic/:id'], (req,res)=>{
    const sql = 'select id,title from topic';
    conn.query(sql, (err, topics, fields)=>{
        const id = req.params.id;
        if(id){
            const sql = 'select * from topic where id=?'
            conn.query(sql, [id], (err, rows,fields)=>{
                if(err){
                    res.status(500).send("Internal Server Error")
                }
                else{
                    res.render('view',{topics:topics, topic: rows[0]})
                }
            })
        }else{
            res.render('view',{topics:topics});
        }
        
    });
})

app.listen(3000,()=>{
    console.log(`app listening at http://localhost:3000`)
})
