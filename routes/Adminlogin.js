const express = require("express");
const { Admin, Products } = require("../connection");
const Adminlogin = express.Router();

Adminlogin.get("/", (req, res) => {
  res.render("Admin");
});

Adminlogin.post("/", async (req, res) => {
  let realadmin = await Admin.findOne({ name: req.body.name });
  if (realadmin.name == "pooja") {
    let realadmin = await Admin.findById("66a5fe9abbe5c6a600b72213");

    let x = await realadmin.populate("items");

    ITMES = x.items;

    console.log(ITMES); //itemss

    await realadmin.save();

    res.render("ProductAdd", { products: ITMES });
  }
});

module.exports = Adminlogin;
