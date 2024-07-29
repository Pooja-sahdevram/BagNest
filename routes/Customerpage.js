const express = require("express");
const { Customer } = require("../connection");
const Customerpage = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");

require("dotenv").config();

Customerpage.get("/", (req, res) => {
  res.render("Signup");
});

Customerpage.post("/", async (req, res) => {
  bcrypt.genSalt(saltRounds, async function (err, salt) {
    bcrypt.hash(req.body.password, salt, async function (err, hash) {
      let createduser = await Customer.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        profile: req.file.filename,
      });

      if (createduser) {
        var token = jwt.sign(
          { email: req.body.email, name: req.body.name },
          process.env.SCRET_KEY
        );
        res.cookie("token", token);

        res.redirect(
          `/home?name=${encodeURIComponent(
            req.body.name
          )}&profile=${encodeURIComponent(req.file.filename)}`
        );
      }
    });
  });
});

module.exports = Customerpage;
