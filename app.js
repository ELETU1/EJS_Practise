//import dependencies
const exp = require("express")
const bp = require("body-parser")
const mongoose = require('mongoose')
const _ = require('lodash')

const app = exp()
app.use(bp.urlencoded({extended: true}))
app.use(exp.static("public"))
app.set("view engine", "ejs")

mongoose.set('strictQuery', false)
mongoose.connect("mongodb+srv://admin-eletutech:AbuRoslaan1@cluster0.pq4ntla.mongodb.net/todoListDB")

//create schema
const itemsSchema = new mongoose.Schema({
  name:String
})
//model of the item schema
const Item = new mongoose.model("Item", itemsSchema)

//new Schema and model
const listSchema = {
  name: String,
  items: [itemsSchema]
}
const List = new mongoose.model("List", listSchema)

//create document
const item1 = new Item({
  name: "Welcome to your todoList!!"
})
const item2 = new Item({
  name: "Hit the + button to add item to todoList"
})
const item3 = new Item({
  name: "<-- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3]


app.get("/", function(req, res){

  Item.find({},function(err, result){
    if(result.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(!err){
          console.log("Document Inserted Successfully")
        }

      });
      res.redirect("/")
    }else{
      res.render("list", {listTitle : "Today", newItem: result})
    }

  })

});


app.post("/", function(req, res){
  const itemName = req.body.item;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/")
  }
  else{
    List.findOneAndUpdate({name: listName}, {$push: {items: {name: itemName}}}, function(err, result){
      if(!err){
        res.redirect("/"+listName)
        }
    })
  }

});


app.post("/delete", function(req, res){
  const checkbox = req.body.checkbox
  const listName = req.body.listName

  if(listName === "Today"){
    Item.findByIdAndRemove(checkbox, function(err){
      if(!err){
        console.log("Item Deleted Successfully")
        res.redirect("/")
      }

    });

  }else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkbox}}}, function(err, result){
       if(!err){
         res.redirect("/"+listName)
       }
    })
  }


})

app.get("/:name", function(req, res){
  const reqName = _.capitalize(req.params.name)

  List.findOne({name: reqName}, function(err, result){
    if(!err){
      if(!result){
        //create the new list
        const list = new List({
          name: reqName,
          items: defaultItems
        });

        list.save();
        res.redirect("/"+reqName)
      }else{
        res.render("list", {listTitle: result.name, newItem: result.items})
      }
    }
  })

})


app.get("/about", function(req, res){
  res.render("about")
});


app.listen(process.env.PORT||3000, function(){
  console.log("listening to Server 3000")
});
