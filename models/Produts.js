const mongoose = require("mongoose");

const Productsschema = new mongoose.Schema({
  Productsname: {
    type: String,
  },
  desc: {
    type: String,
  },
  img: {
    type: String,
    require: true,
  },
  price: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

module.exports = Productsschema;
