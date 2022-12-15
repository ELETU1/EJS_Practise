const exp = require("express")
const bp = require("body-parser")
const date = require(__dirname + "/date.js")

const app = exp()
app.use(bp.urlencoded({extended: true}))
app.use(exp.static("public"))
app.set("view engine", "ejs")


const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function(req, res){
  const day = date.getDay()
  res.render("list", {listTitle : day, newItem: items})
});


app.post("/", function(req, res){
  let item = req.body.item;
  if(req.body.list === "Work"){
    workItems.push(item)
    res.redirect("/work")
  }else{
    items.push(item)
    res.redirect("/")
  }

});


app.get("/work", function(req, res){
  res.render("list", {listTitle: "Work List", newItem: workItems})
});

app.post("/work", function(req, res){
  let item = req.body.newItem;
  workItems.push(item)

  res.redirect("/")
});

app.get("/about", function(req, res){
  res.render("about")
});

app.listen(process.env.PORT||3000, function(){
  console.log("listening to Server 3000")
});
