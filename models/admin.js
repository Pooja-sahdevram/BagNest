const mongoose = require("mongoose");

const Adminschema = new mongoose.Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
  ],
});

module.exports = Adminschema;
