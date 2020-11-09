const NodeGeoCoder = require("node-geocoder");
const dotenv = require("dotenv");

dotenv.config({
  path: "../config/config.env",
});
const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "I6AGJEycl1YAzALxVp7vwXKIRM6GREXh",
  formatter: null,
};

const geocoder = NodeGeoCoder(options);

module.exports = geocoder;
