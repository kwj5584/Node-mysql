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

app.get('/topic/add', (req,res)=>{
    const sql = 'select id,title from topic';
    conn.query(sql, (err,topics,fields)=>{
        if(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        res.render('add', {topics:topics})
    })
});

app.post('/topic/add',(req,res)=>{
    const title = req.body.title;
    const description = req.body.description;
    const author = req.body.author;

    const sql = 'insert into topic (title,description,author) values(?,?,?)';
    conn.query(sql,[title, description, author],(err,result,fields)=>{
        if(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }else{
            res.redirect('/topic/'+result.insertId);
        }
    })
})

app.get('/topic/:id/edit',(req,res)=>{
    const sql = 'select id,title from topic';
    conn.query(sql, (err, topics, fields)=>{
        const id = req.params.id;
        if(id){
            const sql = 'select * from topic where id=?'
            conn.query(sql,[id], (err,topic,fields)=>{
                if(err){
                res.status(500).send('Internal Server Error');
            }else{
                res.render('edit',{topics:topics,topic:topic[0]})
            }
            });
        }else{
            res.status(500).send('Internal Server Error');
        }
    })
})

app.post('/topic/:id/edit',(req,res)=>{
    const title = req.body.title;
    const description = req.body.description;
    const author = req.body.author;
    const id = req.params.id
    const sql = "update topic set title=?, description=?, author=? where id=?";

    conn.query(sql,[title,description,author,id],(err,rows,fields)=>{
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }else{
            res.redirect('/topic/'+id);
        }
    })
});

app.get('/topic/:id/delete',(req,res)=>{
    const sql = 'select id,title from topic';
    const id = req.params.id
    conn.query(sql, (err, topics, fields)=>{
        const sql = 'select * from topic where id=?';
        conn.query(sql, [id], (err, topic, fields)=>{
            if(err){
                res.status(500).send("Internal Server Error")
            } else{
                if(topic.length === 0){
                    console.log('There is no record.')
                    res.status(500).send("Internal Server Error")
                } else{
                    res.render('delete', {topics:topics, topic:topic[0]});
                }
            }
        })
    })
})

app.post('/topic/:id/delete', (req,res)=>{
    const id = req.params.id;
    const sql = 'delete from topic where id=?';
    conn.query(sql,[id], (err,rows,fields)=>{
        if(err){
            res.status(500).send("Internal Server Error");
        }else{
            if(rows.affectedRows){
                console.log('삭제완료');
                res.redirect('/topic/');
            }
        }
    })
})

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
});


app.listen(3000,()=>{
    console.log(`app listening at http://localhost:3000`)
})
