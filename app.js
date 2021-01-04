const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js"); //My custom date module

const app = express();

//Random info
//Var cannot have block scoope, ie a var defined in an if or for {} is global..
//use let, which does have block scope. Will be destructed once {} close

//It is possible to push items into a const js array....
const items = ["Buy food", "Cook food","Eat food"];
const workItems = [];

//Use EJS as app view engine
//assumes folder called views exists
app.set('view engine', 'ejs');

// Use body-parser, parses info from html (or .ejs) page to access form results
app.use(bodyParser.urlencoded({extended: true}));

//Site is not static, Express only serves up main access point (app.js) and views -->
app.use(express.static("public"));




//============== Home page =============//
app.get("/", function(req, res){
  let today = date.getDate();

  //EJS step, passing key to .ejs
  res.render("list", {listTitle: today, newItems: items});

});

app.post("/", function(req, res) {
  let item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    //Redirects to home route to update newListItem
    res.redirect("/");
  }
});



//============== Work page =============//
app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newItems: workItems});
})



//============== About page =============//
app.get("/about", function(req,res){
  res.render("about");
})




app.listen(3000, function(){
  console.log("Server up on 3000");
});
