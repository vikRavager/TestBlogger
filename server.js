const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const mySql = require('mysql');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const port = 8000;
const hostname = 'localhost';
//const dish = require('./routes/alterpost');


const app = express();

const con = mySql.createConnection({
    host:'localhost',
    user:'user1',
    password:'root',
    database:'testdb'
});

con.connect((err) =>{
    if(err){
        throw err;
    }
    console.log("Database connected to the server");
});

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
 
// app.get('/', function (req, res) {
//     res.render('home');
// });

app.get('/', function (req, res) {
    res.render('home',{title : 'Blogger | Posts'});
});

app.get('/create', function (req, res) {
    res.render('create',{title : 'Blogger | Create'});
});

app.get('/delete', function (req, res) {
    res.render('delete',{title : 'Blogger | Delete'});
});

app.get('/update',function(req,res){
    reres.redirect('/update');s.render('update',{title : 'Blogger | Update'})
});

//app.use('/createPost',dish);



app.post('/createPost',function(req,res){
    var name=req.body.name;
    var email = req.body.email;
    var title = req.body.title;
    var body = req.body.body;


    //security key 
    
    var securityKey= Math.floor(Math.random()*(999999-100000)+100000);
    
        

    

    


    var sql ="INSERT INTO blog set name='"+name+"',email='"+email+"',title='"+title+"',body='"+body+"',securityKey='"+securityKey+"';";
    con.query(sql,function(err,result){
        if(err) throw err;

        
        res.redirect('/');
    });
    var transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'phoenixpredator7',
            pass:'Thisispassword'
        }
    });
    
    var str='Your secure key is'+securityKey;
    const mailOption={
        from:'phoenixpredator7@gmail.com',
        to: email,
        subject:'Secure Key',
        text: str
    }
    
    transporter.sendMail(mailOption,
        function(error,info){
            if(error){
                console.log(error);
            } else {
                console.log('Email sent: ')
            }
        });
    


        res.redirect('/update');
});

app.post('/delete',function(req,res){
    var email = req.body.email;
    var securityKey = req.body.securityKey;
   

    var sql="SELECT email,securityKey FROM blog WHERE email='"+email+"'AND securityKey='"+securityKey+"'";
    con.query(sql,function (err,result) {
        if(err) console.log('Error');
        else{
            if (result[0]==null) {
                res.redirect('/delete');
            } else {
                var sql ="DELETE FROM blog WHERE securityKey = '"+securityKey+"'";
                con.query(sql,function(err,res){
                    if(err) console.log('Error');
                    else{
                        res.redirect('/');
                    }
                });
            }
        } 
    });    


});

app.post('/update',function(req,res){
    var email = req.body.email;
    var title = req.body.title;
    var body = req.body.body;
    var securityKey = req.body.securityKey;
   

    var sql="SELECT email,securityKey FROM blog WHERE email='"+email+"'AND securityKey='"+securityKey+"'";
    con.query(sql,function (err,result) {
        if(err) console.log('Error');
        else{
            console.log("first lineee");
            if (result[0]==null) {
                res.redirect('/update');
            } else {
                console.log("second linee");
                var sql ="UPDATE blog SET title='"+title+"',body='"+body+"' WHERE securityKey = '"+securityKey+"'";
                con.query(sql,function(err,result){
                    if(err) throw err;
                    res.redirect('/');
                });
            }
        } 
    });    


});

var doc = con.query('SELECT * FROM blog',function(req,res){
    if(err) {console.log('Error');}
    
    else{
            if (result[0]==null) {
                console.log('No Posts!');
            }
            else{
                res.send(result[0].body);
            }
    }
});

app.get('/',function(req,doc){
    if(!err){
        res.render('home',{
            blogPost : doc
        });
    }
    else{
        throw err;
    }
});

app.listen(port,() => {
    console.log("connected correctly to :"+hostname+':'+port);
});

