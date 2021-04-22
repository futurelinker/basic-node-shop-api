const express = require("express");
const mongoose = require("mongoose");

const app = express();

const morgan = require("morgan");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

mongoose
  .connect(
    "mongodb+srv://futurelink:admin123@node-rest-shop.yy7re.mongodb.net/node-rest-shop?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((result) => {
    console.log("Database connected -> " + result.connections[0].name);
  })
  .catch((err) => {
    console.log(err);
  });

// remove deprecation message
mongoose.Promise = global.Promise;

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS
app.use((req, res, next) => {
  // Append headers
  // ('*') Stands for any origin
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

// routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// errors
app.use((req, res, next) => {
  const error = new Error("Page Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
