const express=require("express");
const User =require( "../models/User");
const bcrypt=require("bcryptjs");
const userRouter=express.Router();
//----------Get User details ------

userRouter.get("/user",async (req,res)=>{
let user;
    try{
         user=await User.find();
        
    }
    catch(err){
        res.status(404).json({err});
    }
    if(!user){
        return res.status(404).json({message:"No users Found"});
    }
    return res.send(user);
});
//----------signup form insertion------

userRouter.post("/signup",async (req,res)=>{
   
    let existinguser;
    
    try{
        existinguser=await User.findOne({username:req.body.username});
 
    }
    catch(err){
        res.status(404).json({err});
    }
    if(existinguser){
        return res.status(400).json({message:"user already exist"});
    }
    const hashedpassword=bcrypt.hashSync(req.body.userpass)
    const user=new User({
        uname: req.body.uname,
        address: req.body.address,
        mobile: req.body.mobile,
        email: req.body.email,
        username: req.body.username,
        userpass: hashedpassword,
        blogs: []

    });
    try{
        await user.save();
    }
  catch(err)
  {
    console.log(err);
  }
  return res.status(201).json({user});
});

//----------Check Login Details------

userRouter.post("/login",async (req,res)=>{
   
    let existingusers;
    
    try{
        existingusers=await User.findOne({username:req.body.username});
 
    }
    catch(err){
       console.log(err);
    }
    if(!existingusers){
        return res.status(404).json({message:"user Cannot Match"});
    }
    const isPasswordCorrect=bcrypt.compareSync(req.body.userpass,existingusers.userpass);
    if(!isPasswordCorrect)
    {
        return res.status(404).json({message:"incorrect Password"});

    }
    return res.status(200).json({message:"login Successfull"});
 
});

module.exports=userRouter;