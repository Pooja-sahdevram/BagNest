const mongoose = require("mongoose");
const Adminschema = require("./models/admin");
const Productsschema = require("./models/Produts");
const CustomerSchema = require("./models/Customer");
mongoose.connect("mongodb://localhost:27017/STARTTTT").then(() => {
  console.log("Data base connectede");
});

const Admin = mongoose.model("Admin", Adminschema);
const Products = mongoose.model("Products", Productsschema);
const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = { Admin, Products, Customer };
