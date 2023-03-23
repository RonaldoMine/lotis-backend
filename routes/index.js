const express = require("express")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const route = express.Router();

route.get('/', function (req, res) {
    console.log(crypto.randomBytes(64).toString('hex'));
    res.send("Welcome to Lotis API")
})

module.exports = route;
