const path=require('path')
const express=require('express');
const mongoose=require("mongoose");
const cookieParser=require('cookie-parser')
mongoose.set('strictQuery', true);
//create instance of app
const Blog=require('./models/blog')
const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentciation');
const app=express();

const PORT=8000;


mongoose.connect('mongodb://0.0.0.0/blogapp').then(e=>console.log('mongodb connected'));


//server side rendering with ejs 
app.set('view engine','ejs')

app.set("views",path.resolve("./views"));
//middleware for handling form data
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));
app.use(checkForAuthenticationCookie('token'));
app.get("/",async (req,res)=>{
    const allBlogs=await Blog.find({})
    res.render("home",{
        user:req.user,
        blogs:allBlogs,
    });

})

app.use("/user",userRoute);
app.use("/blog",blogRoute);

app.listen(PORT,()=>{console.log(`server started at Port :${PORT}`)})