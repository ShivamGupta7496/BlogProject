const express=require("express");
const mongoose = require("mongoose");
const Blog =require( "../models/Blog");
const User = require("../models/User");
const blogRouter=express.Router();
//----------Get Blog details ------
blogRouter.get("/blog",async (req,res,next)=>{
    let blogs;
        try{
             blogs=await Blog.find();
            
        }
        catch(err){
           console.log(err);
        }
        if(!blogs){
            return res.status(404).json({message:"No Blogs Found"});
        }
        return res.status(200).json({blogs});
    });
//----------Insert Blog details ------

    blogRouter.post("/blog/add",async(req,res,next)=>{
        const {title,description,image,user}=req.body;
        let existingusers;
        try{
            existingusers=await User.findById(user);
        }
        catch(err)
        {
            console.log(err);
        }
        if(!existingusers){

            return res.status(500).json({message:"unable to find the user by thi id"})
        }

        const blog=new Blog({
            title,
            description,
            image,
            user
        });
        try{
           const session = await mongoose.startSession();
           session.startTransaction();
           await blog.save({session:session});
           existingusers.blogs.push(blog);
           await existingusers.save({session:session})
           await session.commitTransaction();
        }
        catch(err)
        {
             console.log(err);
             return res.status(500).json({message:err});
        }
        return res.status(200).json({blog});
    });
//----------update Blog details ------

    blogRouter.put("/blog/update/:id",async(req,res)=>{
        const blogId=req.params.id;
        const {title,description}=req.body;
        let blog;
        
        try{
            blog= await Blog.findByIdAndUpdate(blogId,{
                title,
                description
            });
        }
        catch(err)
        {
            return console.log(err);
        }
        if(!blog){
            return res.status(500).json({message:"unable to update the blog"});
        }
        return res.status(200).json({blog});
    });

//----------get Blog by id ------

    blogRouter.get("/blog/:id",async(req,res)=>{
        const Id=req.params.id;
        let blogs;
        
        try{
            blogs= await Blog.findById(Id);
        }
        catch(err)
        {
            return res.status(404).json({message:err});
        }
        if(!blogs){
            return res.status(404).json({message:"no blog found"});
        }
        return res.status(200).json({blogs});
    });

    //----------Delete Blog by id ------

    blogRouter.delete("/blog/:id",async(req,res)=>{
        const delId=req.params.id;
        let blog;
        
        try{
            blog= await Blog.findByIdAndRemove(delId).populate("user");
            await blog.user.blogs.pull(blog);
            // await blog.user.save();
        }
        catch(err)
        {
            return console.log(err);
        }
        if(!blog){
            return res.status(500).json({message:"unable to delete"});
        }
        return res.status(200).json({message:"successfully deleted"});
    });
    //----------Get Blog by User id ------

    blogRouter.get("/user/:id",async(req,res)=>{
        const userId=req.params.id;
        let userblog;
        
        try{
            userblog= await User.findById(userId).populate("blogs");
      
        }
        catch(err)
        {
            return console.log(err);
        }
        if(!userblog){
            return res.status(500).json({message:"unable to get blog "});
        }
        return res.status(200).json({blogs:userblog});
    });




    module.exports=blogRouter;