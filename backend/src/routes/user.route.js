const express = require("express");
const { getUsers, updateUser } = require("../controllers/user.controller");
const RouterAPI = express.Router();

RouterAPI.get("/", getUsers);
RouterAPI.put("/:user_id", updateUser);

module.exports = RouterAPI;
