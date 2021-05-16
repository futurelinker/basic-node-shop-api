const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Models
const Order = require("../models/orders");
const Product = require("../models/products");

// Methods
router.get("/", (req, res, next) => {
  Order.find()
    .select("product qty _id") // select the key's you want to return
    .populate("product") // autopopulate data for related document
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            qty: doc.qty,
            request: {
              type: "GET",
              url: "http://localhost:3000" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId) // if product exist
    .then((product) => {
      // use Order schema for create order
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(), // create an id
        qty: req.body.qty,
        product: req.body.productId,
      });
      return order.save(); // then try to save it
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Order created",
        createdOrder: {
          _id: result.productId,
          product: result.product,
          qty: result.qty,
        },
        type: "GET",
        url: "http://localhost:3000" + result._id,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product") // autopopulate data for related document
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:orderId", (req, res, next) => {
  Order.remove({
    _id: req.params.orderId,
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          body: { productId: "ID", qty: "Number" },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
