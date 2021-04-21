const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET orders",
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "POST orders",
  });
});

router.get("/:productId", (req, res, next) => {
  id = req.params.productId;
  res.status(200).json({
    message: "GET orders by ID: " + id,
  });
});

router.patch("/:productId", (req, res, next) => {
  id = req.params.productId;
  res.status(200).json({
    message: "UPDATE orders by ID " + id,
  });
});

router.delete("/:productId", (req, res, next) => {
  id = req.params.productId;
  res.status(200).json({
    message: "DELETE orders by ID " + id,
  });
});

module.exports = router;
