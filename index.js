const express = require("express");
const app = express();
var jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const Adminlogin = require("./routes/Adminlogin");
const path = require("path");
const Productsroute = require("./routes/Productsroute");
const multer = require("multer");
const { Admin, Customer, Products } = require("./connection");
const Customerpage = require("./routes/Customerpage");
const LoginRoute = require("./routes/LoginRoute");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/imges");
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, buffer) {
      if (err) {
        return cb(err);
      }
      // Generate a random filename using the buffer and file extension
      const fn = buffer.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});

const upload = multer({ storage: storage });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/admin", Adminlogin);
app.use("/products", upload.single("img"), Productsroute);
//Customer route
app.use("/customer", upload.single("profile"), Customerpage);
//signup
app.use("/login", LoginRoute);

app.get("/", async (req, res) => {
  let realadmin = await Admin.findById("66a5fe9abbe5c6a600b72213");

  let x = await realadmin.populate("items");

  let ITEMS = x.items;

  let name = "",
    profile = "";
  res.render("Home", { ITEMS, name, profile });
});

//home route
app.get("/home", async (req, res) => {
  let realadmin = await Admin.findById("66a5fe9abbe5c6a600b72213");

  let x = await realadmin.populate("items");

  let ITEMS = x.items;

  let token = req.cookies.token;

  if (token) {
    var decoded = jwt.verify(token, process.env.SCRET_KEY);
    let emailjwt = decoded.email;

    let customerrr = await Customer.findOne({ email: emailjwt });
    let name = customerrr.name;

    const { profile } = req.query;

    res.render("Home", { ITEMS, name, profile });
  } else {
    let name = "",
      profile = "";
    res.render("Home", { ITEMS, name, profile });
  }
});

app.get("/logout", async (req, res) => {
  let realadmin = await Admin.findById("66a5fe9abbe5c6a600b72213");

  let x = await realadmin.populate("items");

  let ITEMS = x.items;

  let token = req.cookies.token;

  res.cookie("token", "");
  let name = "",
    profile = "";
  res.render("Home", { ITEMS, name, profile });
});

app.get("/singlepage", (req, res) => {
  res.render("Signleproduct");
});

app.get("/cutomerdata", async (req, res) => {
  let id = req.query.productid;
  let token = req.cookies.token;
  if (token) {
    try {
      var decoded = jwt.verify(token, process.env.SCRET_KEY);
      let customerrrr = await Customer.findOne({ email: decoded.email });
      let data = await Products.findById(id);

      if (!customerrrr.cart.includes(data._id)) {
        customerrrr.cart.push(data._id);
        await customerrrr.save();
        res.status(200).send("Product added to cart");
      } else {
        res.status(400).send("Product already in cart");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.send("please login");
  }
});

app.get("/cart", async (req, res) => {
  let token = req.cookies.token;
  var decoded = jwt.verify(token, process.env.SCRET_KEY);
  let customerrrr = await Customer.findOne({ email: decoded.email });
  let carts = await customerrrr.populate("cart");
  console.log(carts.cart);
  res.render("Carts", { cartItems: carts.cart });
});

app.get("/remove", async (req, res) => {
  const id = req.query.id;
  let token = req.cookies.token;
  var decoded = jwt.verify(token, process.env.SCRET_KEY);
  let customerrrr = await Customer.findOne({ email: decoded.email });

  let exist = customerrrr.cart.includes(id);

  if (exist) {
    const index = customerrrr.cart.indexOf(id);
    customerrrr.cart.splice(index, 1);
    await customerrrr.save();
    res.redirect("/cart");
  }
});

app.get("*", (req, res) => {
  res.send("<h1>404</h1>");
});
app.listen(5010, () => {
  console.log(`Server running /`);
});
