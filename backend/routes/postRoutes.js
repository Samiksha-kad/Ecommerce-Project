import  express from 'express';
import registerModel from '../db/RegisterSchema.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import multer from 'multer'
import bcrypt from 'bcrypt'  
const saltRounds = 10 
const jwtSecret = "samiksha" 
const router = express.Router();  
let transporter = nodemailer.createTransport({
    service:'gmail', 
    auth:{
        user:'your email',
        pass:'your password'
    }
})

const DIR = '../frontend/public/images/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null,"user" + '-' + fileName) 
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
router.post("/addpost", (req, res) => { 
    // password bcrypt 
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    registerModel.findOne({email:req.body.email}, (err,data)=>{
        if(err){
            res.json({"err":1, "msg":"Something went wrong in checking data"}) 
        }
        else if(data== null){
            // insert data in db
            let ins = new registerModel({ firstname: req.body.fname, lastname: req.body.lname, email: req.body.email, mobile: req.body.mobile,  password: req.body.password,gender:req.body.gender})
            ins.save((e) => {
                if (e) {
                    res.json({"err":1, "msg":"Something went wrong in adding data"})
                }
                else {
                    res.json({"err":0, "msg":"New User added"})
                }
            })
        }
       else{   
        res.json({"err":0,"msg":"User already exist"})
       }
    })
}) 
router.post("/forgetservice", (req, res) => { 
    // check if email exsist in db 
    registerModel.findOne({email:req.body.email}, (err, data)=>{
        if(err){
            res.json({"err":1, "msg":"Something went wrong in checking data"})
        }
        else if(data== null){
            res.json({"err":1, "msg":"User not found"})
        }
        else{
            // if email exsist create otp and send mail 
            let otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
            let mailOptions= {
                from:"kadsamiksha347@gmail.com",
                to:req.body.email,
                subject:" Password reset",
                html:  `<!DOCTYPE html>
                <html>
                <head>
                <style>
                .ot{
                    color:red;
                    font-weight: bold;
                }
                .n{
                    font-weight: bold;
                    font-size: 20px;
                }
                .ot1{
                    font-weight: bold;
                    color:red;
                    font-size: 25px;
                }
                </style>
                </head>
                <body>
                <h1>Neo<span class="ot1">STORE</span></h1>
                <hr/>
                Hello <span class="n"> ${data.firstname+' '+ data.lastname} </span>,
                <div>A password reset for your account was requested.</div>
               <div> Your OTP for Neo<span class="ot">STORE</span> password reset is <span class="ot1">${otp}</span> </div>
               <div>Note that this OTP is valid for 24 hours. After the time limit has expired, you will have to resubmit the request for a password reset.</div> <br/>
               <div>If you did not make this request, please Contact Us. </div>
                </body>
    </html>`
            }
            transporter.sendMail(mailOptions, function(error,info){
                if(error) {
                    console.log(error)
                }
                else{ 
                    console.log('Email sent: '+info.response); 
                }
            })
            res.json({"err":0, "otp":otp})
        }
         
          
        })
   
})
router.post("/emailSubscribeService", (req, res) => { 
    // sending email
  
            let mailOptions = {
                from:'kadsamiksha347@gmail.com',
                to:req.body.email,
                subject:"Subscription",
                text:"Thankyou for Subscribing!!!!!"
            }
            transporter.sendMail(mailOptions, function(error,info){
                if(error) {
                    console.log(error)
                }
                else{
                    console.log('Email sent: '+info.response); 
                }
            })
            res.json({"err":0, "msg":"Email Send successfully"})
       
   
})
router.post("/resetService", (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds); 
    registerModel.updateOne({email:req.body.email}, {$set:{password:req.body.password}},(err, data)=>{
        if(err){
            res.json({"err":1, "msg":"Something went wrong in checking data"})
        }
        else{
            res.json({"err":0, "msg":"Password updated successfully!!"})
        }
         
          
        })
   
})
router.post("/changePaswordService", (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds); 
    registerModel.findOneAndUpdate({email:req.body.email}, {$set:{password:req.body.password}},{new:true},(err, data)=>{
        if(err){
            res.json({"err":1, "msg":"Something went wrong in checking data"})
        }
        else{
            const token = encryptData(data);
            res.json({"err":0,"msg":"Password updated successfully!!","token":token})
        }
        
    })
   
})
router.post("/validate", (req, res) => { 
    let hashbcrypt = false
    registerModel.find({}, (err, data)=>{
        if(err){
            console.log(err)
        }
        else{
            // checks if email exsist in db checks bcrypted password and pass token in localstorage
            data.map(ele=>{
                if(ele.email === req.body.email){
                   hashbcrypt = bcrypt.compareSync(req.body.password, ele.password) 
                    if(hashbcrypt){
                        const token = encryptData(ele);
                        res.json({"err":0,"msg":"Login Success","token":token})
                    }
                } 
            })
            // if(pass does not match )
            if(!hashbcrypt){
                res.json({"err":1, "msg":"Email or Password does not Match"})
            }
        } 
    })
})
router.post("/profileeditService",(req,res) =>{
    registerModel.findOneAndUpdate({email: req.body.originalEmail}, 
    {$set: {
        firstname:req.body.firstname,
        lastname:req.body.lastname, 
        gender:req.body.gender, 
        mobile:req.body.mobile, 
        email: req.body.email}},{new:true},(err,data)=>{
            
            if(err) throw err;
            else{
                const token = encryptData(data);
                res.json({"err":0,"msg":"Address added","token":token,"values":data})
            }
        }) 
})

router.post("/addAddressService",(req,res)=>{
    // let useremail = req.params.email
   registerModel.findOneAndUpdate({email:req.body.email}, {$set:{addresses:req.body.data}},{new:true}, (err,data)=>{

        if(err){
            console.log(err)
        }
        else{
            const token = encryptData(data);
            res.json({"err":0,"msg":"Address added","token":token})
        }
    })
})
router.post("/profilePicService", upload.single('profileImg'), (req,res) =>{
    registerModel.findOneAndUpdate({email: req.body.email}, 
    {$set: {
        profilepic: req.file.filename}},{new:true},(err,data)=>{
            if(err) throw err;
            else{
                const token = encryptData(data);
                res.json({"err":0,"msg":"Profile Pic Updated","token":token, "values":data})
            }
        })  
})
router.post("/cartSaveService",(req,res)=>{
    console.log(req.body, "line 218")
    registerModel.findOneAndUpdate({email:req.body.email}, {$set:{cart:req.body.data}},{new:true}, (err,data)=>{

        if(err){
            console.log(err)
        }
        else{
            console.log(data)
            const token = encryptData(data);
            res.json({"err":0,"msg":"cart added","token":token})
        }

    })
      
       
})
    
const encryptData = (data) => {
    
    let pay={
        ...data._doc
    }
    const token= jwt.sign(pay, jwtSecret,{expiresIn:360000})
    return token;
}
   

export default router