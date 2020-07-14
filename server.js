"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const { stock, customers } = require("./data/promo");
const q1 = (req, res) => {
  const {
    order,
    size,
    givenName,
    surname,
    email,
    address,
    city,
    province,
    postCode,
    country,
  } = req.body;
  let values = Object.values(req.body);
  values.forEach((value) => {
    if (order === "shirt") {
      if (size === "undefined") {
        res.json({ status: "error", error: "missing-data" });
        return;
      }
    } else if (value === "undefined" || value === "") {
      res.json({ status: "error", error: "missing-data" });
      return;
    }
  });
  if (order === "bottles") {
    if (stock.bottles < 1) {
      res.json({ status: "error", error: "unavailable" });
    }
  } else if (order === "shirt") {
    if (stock.shirt[size] < 1) {
      res.json({ status: "error", error: "unavailable" });
    }
  } else if (order === "socks") {
    if (stock.socks < 1) {
      res.json({ status: "error", error: "unavailable" });
    }
  } else if (customers.find((customer) => customer.email === email)) {
    res.json({ status: "error", error: "repeat-customer" });
  } else if (country !== "canada") {
    res.json({ status: "error", error: "undeliverable" });
  } else {
    return res.json({ status: "success" });
  }
};

const q2 = (req, res) => {
  res.json({ status: "ok" });
};

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .post("/order", q1)
  .get("/order-confirmed", q2)
  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(8000, () => console.log(`Listening on port 8000`));
