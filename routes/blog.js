const { Router } = require('express')
const multer=require('multer')
const path=require('path')


const Blog=require('../models/blog')
const Comment=require('../models/comment')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName=`${Date.now()}-${file.originalname}`
        cb(null,fileName)
    }
  })
  
  const upload = multer({ storage: storage })


const router=Router();

router.get('/add-new', (req,res)=>{
    return res.render('addBlog',{
        user:req.user,
    })
})

router.get('/:id',async (req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("createdBy")
    const comments= await Comment.find({blogId:req.params.id}).populate('createdBy')
    return res.render('blog',{
        user:req.user,
        blog, 
        comments
    })
})

router.post('/',upload.single("coverimage"),async (req,res)=>{
    console.log(req.body);
    const {title,body}=req.body;
   const blog=await Blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverImageUrl:`/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`);
})

router.post('/comment/:blogId',async (req,res)=>{
    const comment =await Comment.create({
        comment:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id,

    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;