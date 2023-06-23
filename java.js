const bodyparser = require("body-parser");
const express =require("express");
const { default: mongoose, Schema, mongo } = require("mongoose");
const _=require("lodash");

const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todoListDB");

const itemsSchema=new mongoose.Schema({
   name: String
});

const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
    name:"Welcome!"
});

const item2=new Item({
    name:"HI Do your homework!"
});

const item3=new Item({
    name:"Sleep!"
});

const itemsarray=[item1,item2,item3];

const listSchema=new Schema({
  name:String,
  vector: [itemsSchema] 
});

const List=mongoose.model("List",listSchema);


/*
// // Item.insertMany(itemsarray)
// // .then((x)=>{
// //     console.log(x);
// // })
// // .catch((err)=>{
// //     console.log(err)
// // });

*/
//var items=[];
//let lists=[];

let today=new Date();
let options = { 
   weekday: 'long',
   year: 'numeric',
   month: 'long',
   day: 'numeric' 
};
const day=today.toLocaleDateString("en-US", options);

app.get("/",function(req,res){
   

    Item.find()
    .then((x)=>{
        if(x.length===0){
        Item.insertMany(itemsarray)
        .then(()=>{
            console.log("installed");
        })
        .catch((err)=>{
            console.log(err)
        });
        res.redirect("/");
        }else{
        res.render("list",{
            listTitle:day, 
            dd:x
          });
       }
    })
    .catch((err)=>{
       console.log(err)
    });

    
});


app.post("/",function(req,res){
   var item=req.body.newitem;
   let upnamed=req.body.named;
   let named=_.lowerCase(req.body.named);
   const itemadd=new Item({
    name:item
    }); 
   if(upnamed===day){
    itemadd.save();
    res.redirect("/");
   }else{
    List.findOne({name:upnamed})
    .then((found)=>{
        found.vector.push(itemadd);
        found.save();
        res.redirect("/"+named);
    })
    .catch((err)=>{
       console.log(err);
    });
   }
});

app.post("/delete",function(req,res){
    const id=req.body.checkBox;
    const title=req.body.titleval;
    const urltitle=_.lowerCase(title);
    if(title===day){
    Item.findByIdAndRemove(id)
    .then(()=>{
        console.log("Removed");
    })
    .catch((err)=>{
        console.log(err)
    });
    res.redirect("/");
   }else{
    List.findOneAndUpdate({name:title}, {$pull: {vector: {_id :id}}})
    .then(()=>{
        console.log("Removed");
    })
    .catch((err)=>{
       console.log(err);
    });
    res.redirect("/"+urltitle);
   }
});

app.get("/:name",function(req,res){
    const p=req.params.name;
    const Name=_.capitalize(p);
    List.findOne({name:Name})
    .then((x) => {
        if(!x){
            const newname=new List({
               name: Name,
               vector: itemsarray
            });
            newname.save();
            res.redirect("/"+p);
        }else{
           res.render("list",{
             listTitle: x.name,
             dd:x.vector
           });
        };
    })
    .catch((err)=>{
        console.log(err);
    });
});



app.listen(3000,function(req,res){
    console.log("its working");
});
