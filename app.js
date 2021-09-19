const express=require("express");
const _=require("lodash");
const ejs = require("ejs");
const mongoose=require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app=express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser:true});

const articleSchema={
    title:String,
    context:String
}


const Article=mongoose.model("Article",articleSchema);

const article1=new Article
(
  {
    title:"DAY1",
    context:contactContent
  }
)

const article2=new Article
(
  {
    title:"DAY2",
    context:contactContent
  }
)


const defaultItems=[article1,article2]



app.get("/",function(req,res)
{
  Article.find({},function(err,posts)
  {
    if(posts.length===0)
    {
      Article.insertMany(defaultItems,function(err)
      {
        if(err)
        {
          console.log(err);
        }
        else
        {
         console.log("Items Added Successfully");
        }
      });
      res.redirect("/")

    }
    else
    {
     res.render("home",{start:homeStartingContent,content:posts});   
    } 
  }); 
});


app.get("/compose",function(req,res)
{
  res.render("compose")
});

app.post("/compose",function(req,res)
{

  const post1=new Article
  (
    {
      title:req.body.topic,
      context:req.body.article
    }
  ); 
  post1.save();
  res.redirect("/")     
});

app.get("/about",function(req,res)
{
  res.render("about",{start:aboutContent})
});

app.get("/contact",function(req,res)
{
  res.render("contact",{start:contactContent})
});



app.get("/:user",function(req,res)
{
  const anotherPosts=req.params.user;
  
  Article.findOne({_id:anotherPosts},function(err,results)
  {
    if(err)
    {
     console.log(err); 
    }
    else
    {
     res.render("post",{head:results.title,text:results.context});
    }
  
  });
  
});


app.listen(3000,function(req,res)
{
  console.log("Hello I am running")
});
