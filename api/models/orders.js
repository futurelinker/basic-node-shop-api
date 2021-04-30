const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  // create relation to Product - ref holds the string of the name of the model to connect
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  qty: { type: Number, default: 1 },
});

// Exports the model and schema
module.exports = mongoose.model("Order", orderSchema);
