const bodyparser = require("body-parser");
const express =require("express");



const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

var items=[];
let lists=[];

app.get("/",function(req,res){
    var today=new Date();
    var options = { 
       weekday: 'long',
       year: 'numeric',
       month: 'long',
       day: 'numeric' 
    };
    var day=today.toLocaleDateString("en-US", options);
    res.render("list",{
        listTitle:day, 
        dd:items
    });
});

app.post("/",function(req,res){
   var item=req.body.newitem;
   let isryt=req.body.named;
   if(isryt=== "work"){
    lists.push(item);
    res.redirect("/work");
   }else{
    items.push(item);
    res.redirect("/");
   }
});

app.get("/work",function(req,res){
   res.render("list",{
       listTitle: "work",
       dd:lists
   });
});

app.get("/about",function(req,res){
res.render("about");
});

app.listen(3000,function(req,res){
    console.log("its working");
});
