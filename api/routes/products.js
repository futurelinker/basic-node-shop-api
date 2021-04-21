const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET products",
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "POST product",
  });
});

router.get("/:productId", (req, res, next) => {
  id = req.params.productId;
  res.status(200).json({
    message: "GET product by ID: " + id,
  });
});

router.patch("/:productId", (req, res, next) => {
  id = req.params.productId;
  res.status(200).json({
    message: "UPDATE product by ID " + id,
  });
});

router.delete("/:productId", (req, res, next) => {
  id = req.params.productId;
  res.status(200).json({
    message: "DELETE product by ID " + id,
  });
});

module.exports = router;
