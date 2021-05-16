const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const router = express.Router();

// Models
const User = require("../models/users");

router.post("/signup", (req, res, next) => {
  // console.log(req.body);
  // SaltRounds = 10; add random strings into plain password before it hased
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        // Status 409 = conflict
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save() // Store in database
              .then((result) => {
                console.log(result);
                res.status(200).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        // Status 401 = Unauthorized
        return res.status(401).json({
          message: "Auth Failed",
        });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth Failed",
          });
        }
        if (result) {
          return res.status(200).json({
            message: "Auth successful",
          });
        }
        res.status(401).json({
          message: "Auth Failed",
        });
      });
    })
    .catch(err => {
       console.log(err);
       res.status(500).json({
         error: err,
       });
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({
    _id: req.params.userId,
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
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
