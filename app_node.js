const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", function(req, res){
  //some logic
  var today = new Date();
  var currentDay = today.getDay();
  var day = "";

  if (currentDay === 6 || currentDay ===0) {
    //Pure node.js
    //res.write("<h1>Yay, it's the weekend!</h1>");
    //res.write("<p>Sleep in and get some rest:)</p>")
    res.sendFile(__dirname+"/index.html");

    day = "Weekend";


  } else {
    //Pure node.js
    //res.write("<h1>Work day shmerk day blah</h1>");
    //res.write("<p>Time to get started.</p>")
    res.sendFile(__dirname+"/index.html");

    day = "Week day"

  }

  //res.send is final send
  //res.send();
});



app.listen(3000, function(){
  console.log("Server up on 3000");
})
