const express = require("express");
const { Customer } = require("../connection");
const LoginRoute = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

require("dotenv").config();

LoginRoute.get("/", (req, res) => {
  res.render("Login");
});

LoginRoute.post("/", async (req, res) => {
  let body = req.body;

  // Using await to handle the asynchronous findOne call
  let customer = await Customer.findOne({ email: body.email });
  let customerPassword = customer.password;
  bcrypt.compare(body.password, customerPassword, async function (err, result) {
    if (err) {
      console.error(err); // Log the error for debugging purposes
      return res.status(500).send("Internal Server Error");
    }
    if (result) {
      var token = jwt.sign({ email: req.body.email }, process.env.SCRET_KEY);
      res.cookie("token", token);

      let profilepicurl = await Customer.findOne({ email: body.email });
      res.redirect(
        `/home?name=${encodeURIComponent(
          req.body.name
        )}&profile=${encodeURIComponent(profilepicurl.profile)}`
      );
    } else {
      res.status(401).send("Unauthorized");
    }
  });
});

module.exports = LoginRoute;
