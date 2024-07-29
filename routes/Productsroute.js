const express = require("express");
const { Admin, Products } = require("../connection");
const Productsroute = express.Router();
let ITMES;

Productsroute.post("/", async (req, res) => {
  let body = req.body;
  let fileall = req.file;

  let product = await Products.create({
    Productsname: body.Productsname,
    desc: body.desc,
    img: fileall.filename,
    price: body.price,
    user: "66a5fe9abbe5c6a600b72213",
  });

  let realadmin = await Admin.findById("66a5fe9abbe5c6a600b72213");
  realadmin.items.push(product._id);

  let x = await realadmin.populate("items");

  ITMES = x.items;

  console.log(ITMES); //itemss

  await realadmin.save();

  res.render("ProductAdd", { products: ITMES });
});

module.exports = Productsroute;
