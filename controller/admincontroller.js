const express = require('express');

const admin = require('../model/admindata')
const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')

module.exports.dashbord = (req,res) => {
    return res.render('dashbord')
}

module.exports.addadmin = (req,res) =>{
    return res.render('addadmin');
    
}

module.exports.home = (req,res) =>{
    return res.render('dashbord')
}

module.exports.register = async (req,res) =>{
   
    return res.render('register');
}

module.exports.signupp = async(req,res)=>{
    console.log(req.body)
    // (req.body.city = 'null'),
    // (req.body.avatar = 'null'),
    // (req.body.description = 'null'),
    // (req.body.phone = 'null')

    // let register = await admin.create(req.body);
    //    return res.redirect('back')

    let regi = await admin.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        city : 'null',
        phone : 'null',
        description : 'null',
        avatar : 'null',
        active : true,
        role : 'admin'
    }); 
    return res.redirect('/admin/login');
}

module.exports.resetpass = async(req,res)=>{
    let reset = await admin.findOne(req.body)
    // console.log(reset)
    if(reset){
        let otp = Math.ceil(Math.random()*1000)
        res.cookie('otp',otp)
        res.cookie('email',req.body.email)
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "80dca84f13f9f5",
              pass: "2b2d3016c04067"
            }
          });

          let info = await transport.sendMail({
            from: 'harshilbavishi96@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `OTP${otp}`, // html body
          });


        return res.render('otp')
    }
    return res.redirect('back')
}

module.exports.otp = async (req,res) =>{
    let otpmatch = req.cookies.otp
    // console.log(otpmatch);
    if(req.body.otp == otpmatch){
        return res.render('forgot');
    }
    return res.redirect('back')
}

module.exports.forgot = (req,res) =>{
    return res.render('reset')
}

module.exports.forgotpass = async (req,res)=>{
 
   let cpass = await req.body.cpass;
   let npass = await req.body.npass;
   if(cpass == npass){
        let cookieEmail = await req.cookies.email;
        let email = await admin.findOne({email : cookieEmail});
        if(email){
            let data = await admin.findByIdAndUpdate(email.id,{password:npass})
            return res.redirect('/login');
        }
        console.log('can not find data')
   }
   console.log('password not match  ')

    // console.log(email)
}
module.exports.profile = async (req,res) =>{
    let Admindata = await admin.find({});
    // console.log(Admindata)

    return res.render('profile',{
        name : Admindata,
        
    })
}

module.exports.logout= (req,res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err)
        }
        else{
            return res.redirect('/admin/login');
        }
    })
}

module.exports.login = (req,res)=>{
    if(req.isAuthenticated()){
    
        return res.redirect('/');
    }
    return res.render('login');
}


module.exports.getlogin =  (req,res)=>{
    // console.log(req.body);
    req.flash('success','login success'); 
    return res.redirect('/admin')
    
}

module.exports.viewadmin = async(req,res) =>{
    let Admindata = await admin.find({});
    // console.log(Admindata)

    return res.render('viewadmin',{
        name : Admindata,
        
    })
}

module.exports.insertAdminData = async (req,res)=>{
    if(req.file)
    {
        req.body.avatar = admin.imgpath +'/'+req.file.filename;
    }
    req.body.active = true;
    req.body.name = 'null'
    req.body.role = 'admin'
    let admindata = admin.create(req.body)

    req.flash('success','Add success'); 
    return res.redirect('back');

}

module.exports.Admindeletedata =async(req,res)=>{
    let deldata = await admin.findByIdAndDelete(req.params.id);
    if(deldata.avatar){
        fs.unlinkSync(path.join(__dirname, '../assets',deldata.avatar))
    }
    
    return res.redirect('back')
}

module.exports.Adminupdatedata = async(req,res)=>{
    let updata = await admin.findById(req.params.id);
    if(updata){
        return res.render('Adminupdatedata',{
            updata : updata
        })
    }

}
module.exports.deActive = async (req, res) => {
    let data = await admindb.findByIdAndUpdate(req.params.id, { active: false });
  
    return res.redirect("back");
  };
  
  module.exports.active = async (req, res) => {
    let data = await admindb.findByIdAndUpdate(req.params.id, { active: true });
  
    return res.redirect("back");
  };

module.exports.insertupdatedata = async(req,res)=>{
    let editdata = await admin.findByIdAndUpdate(req.body.id,req.body)
    if(editdata){
        return res.redirect('/admin/viewAdmin');
    }
    console.log("somthing went wrong");

}