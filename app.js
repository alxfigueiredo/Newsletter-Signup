const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;

      var data = {
        members: [{
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }]
      };

      const jsonData = JSON.stringify(data);

      const url = "https://us20.api.mailchimp.com/3.0/lists/ce459d2a6e";
      const options = {
        method: "POST",
        auth: "alex:870fa444cf5033ae2561dc6f4efd8242-us20"
      }
      const request = https.request(url, options, function(response) {
        if(response.statusCode === 200)
        {
          res.sendFile(__dirname + "/success.html");
        }
        else
        {
          res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
          console.log(JSON.parse(data));
        });
        });
        request.write(jsonData);
        request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

      app.listen(process.env.PORT || port, function() {
        console.log("Server is running on port " + port + "...");
      });

      // API Key 870fa444cf5033ae2561dc6f4efd8242-us20
      // List ID ce459d2a6e
