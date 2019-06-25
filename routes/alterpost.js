const bodyParser = require('body-parser');
const express = require('express');
const nodemailer = require('nodemailer');


const router = express.Router();

router.post('/createPost',function(req,res){
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


module.exports = router;