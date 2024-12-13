const express = require("express");
const {
  getShowtimes,
  postCreateShowtime,
  putUpdateShowtime,
  getShowtimesByFilmId,
} = require("../controllers/showtime.controller");
const RouterAPI = express.Router();

RouterAPI.get("/", getShowtimes);
RouterAPI.get("/:film_id/film", getShowtimesByFilmId);
RouterAPI.post("/", postCreateShowtime);
RouterAPI.put("/:id", putUpdateShowtime);

module.exports = RouterAPI;
