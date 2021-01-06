const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js"); //My custom date module
const _ = require("lodash");

const app = express();
let today = date.getDay();

//Use EJS as app view engine, assumes folder called views exists
app.set('view engine', 'ejs');

// Use body-parser, parses info from html (or .ejs) page to access form results
app.use(bodyParser.urlencoded({
  extended: true
}));

//Site is not static, Express only serves up main access point (app.js) and views -->
app.use(express.static("public"));



//============ Setup Mongo database using mongoose ==============//
mongoose.connect("mongodb://localhost:27017/todoListDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


//Define Items Database
const itemsSchema = new mongoose.Schema({
  name: String
});

//Mongoose models are capitalised, singular
const Item = mongoose.model("Item", itemsSchema);

const tea = new Item({
  name: "Make tea"
});

const eat = new Item({
  name: "Eat breakfast"
});

const shower = new Item({
  name: "Take a shower"
});

const defaultItems = [tea, eat, shower];



//Define Lists database
const listSchema = {
  listName: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);




//============== Home page =============//
app.get("/", function(req, res) {

  //Find items in mongoDB
  Item.find({}, function(err, foundItems) {
    //If collection is empty
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfuly added default items to DB");
        }
      });
      res.redirect("/");
    } else {
      //EJS step, passing key to .ejs
      res.render("list", {
        listTitle: today,
        listItems: foundItems
      });
    }
  });
});


//Site posts new item to server
app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === today){
    console.log("Save to main list");
    item.save(); //mongo saves to db
    //Redirects to home route to update newListItem
    res.redirect("/");
  } else {
    console.log("Need to use extra list");
    console.log(listName);

    List.findOne({listName: listName}, function(err, foundList){
      if (err) {
        console.log(err);
      } else {
        console.log("Found list: " + foundList + ", now pushing: " + item);
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      }
    });
  };


});

//Site requests to delete item from server
app.post("/delete", function(req, res) {

  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === today) {
    Item.deleteOne({_id: checkedItemID}, function(err){
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted checked item");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({listName}, {$pull: {items: {_id: checkedItemID}}}, function(err, foundList){
      if (err) {
        console.log(err);
      } else {
        res.redirect("/" + listName);
      }
    })
  }


});




//============== About page =============//
app.get("/:customPage", function(req, res) {
  //Modify with lodash
  const customListName = _.capitalize(req.params.customPage);
  console.log("custom name: " + customListName);

  List.findOne({listName: customListName}, function(err, foundList){
    if (err) {
      console.log(err);
    } else {
      if (foundList){
        //Show existing list
        console.log("Found list: " + customListName);
        res.render("list", {
          listTitle: customListName,
          listItems: foundList.items
        });
      } else {
        //Create new list
        console.log("Creating new list call: " + customListName);
        const list = new List({
          listName: customListName,
          items: defaultItems
        });
        list.save(function(err, doc){
          res.redirect("/" + customListName);
        });
      }
    }
  })




})




app.listen(3000, function() {
  console.log("Server up on 3000");
});
