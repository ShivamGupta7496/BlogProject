
const express=require("express");
const  mongoose= require("mongoose");
const userRoutes=require("./routes/user-route");
const blogRoutes=require("./routes/blog-route");
mongoose.connect("mongodb+srv://admin:Shivam11Gupta@cluster0.dy7vhxt.mongodb.net/Blog?retryWrites=true&w=majority",function()
{
const  app=express();
app.use(express.json());
app.use("/api",userRoutes);
app.use("/api",blogRoutes);
app.listen(5000,()=>{
    console.log("server started at 5000");
    });
}).catch((err)=>{console.log(err)});