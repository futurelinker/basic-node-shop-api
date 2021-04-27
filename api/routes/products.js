const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Product = require("../models/products");

// Create – POST
// Read – GET
// Update – PUT/PATCH // PUT Requires entire entity for update resource in origin / PATCH updates partial
// Delete – DELETE

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length > 0) {
        const response = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              id: doc._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/products/" + doc._id,
              },
            };
          }),
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No products found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Product created",
        createdProduct: {
          name: result.name,
          price: result.price,
          id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => console.log(err));
});

router.get("/:productId", (req, res, next) => {
  id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + doc._id,
          },
        });
      } else {
        res.status(404).json({
          message: "No product found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  id = req.params.productId;
  // req.body = [{ propName: "name", value: "New Value" }];
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  console.log(req.body);
  // { name: "New Value"; }
  console.log(updateOps);
  Product.update(
    { _id: id },
    // $set provided by mongoose
    { $set: updateOps }
  )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product deleted",
        response: {
          type: "POST",
          url: "http://localhost:3000/",
          body: {
            name: "String",
            price: "Number",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
