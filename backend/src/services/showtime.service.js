const Showtime = require("../models/showtime.model");

const createShowtimeService = async (showtime) => {
  try {
    return await Showtime.create(showtime);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateShowtimeService = async (id, showtime) => {
  try {
    return await Showtime.findByIdAndUpdate(id, showtime, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getShowtimesService = async () => {
  try {
    return await Showtime.find()
      .populate("film_id")
      .populate("branch_id")
      .then((showtimes) => {
        showtimes.forEach((showtime) => {
          if (
            showtime.branch_id &&
            Array.isArray(showtime.branch_id.list_screen) &&
            showtime.screen_id
          ) {
            const screen = showtime.branch_id.list_screen.find(
              (s) => s._id.toString() === showtime.screen_id.toString()
            );

            if (screen) {
              showtime.set("screen", screen, { strict: false });
            } else {
              showtime.set("screen", null, { strict: false });
            }
          } else {
            showtime.set("screen", null, { strict: false });
          }

          showtime.screen_id = undefined;
        });

        return showtimes;
      });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getShowTimeByFilmIdService = async (film_id) => {
  try {
    return await Showtime.find({ film_id })
      .populate("film_id")
      .populate("branch_id")
      .then((showtimes) => {
        // populate screen
        showtimes.forEach((showtime) => {
          showtime.set(
            "screen",
            showtime.branch_id.list_screen.id(showtime.screen_id),
            { strict: false }
          );
          // remove list_screen
          // showtime.branch_id.list_screen = undefined;
          showtime.screen_id = undefined;
        });

        return showtimes;
      });
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkShowtimeExist = async (showtime_id) => {
  try {
    await Showtime.findById(showtime_id);
  } catch (error) {
    throw new Error("Showtime not found");
  }
};

module.exports = {
  createShowtimeService,
  updateShowtimeService,
  getShowtimesService,
  getShowTimeByFilmIdService,
  checkShowtimeExist,
};
