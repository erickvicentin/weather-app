// @node_modules
const express = require("express");
const hbs = require("hbs");
const path = require("path");

// @own_modules
const geoCode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const geocode = require("./utils/geocode");
const { send } = require("process");
const { request } = require("express");

// @app_constants
const app = express();
const port = process.env.PORT || 3000;

// @Define paths for Express config
const partialsPath = path.join(__dirname, "../templates/partials");
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");

// @Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// @Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: " Weather - App ",
    name: "Erick Vicentin",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Erick Vicentin",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Erick Vicentin",
    helpText: "This is some helpful text.",
  });
});

app.get("/weather", (req, res) => {
  const address = req.query.address;

  if (!address || address === "") {
    return res.send({
      error: "Input an valid location",
    });
  } else {
    geocode(address, (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      } else {
        forecast(latitude, longitude, (error, forecastData) => {
          if (error) {
            return res.send({ error });
          }
          res.send({
            forecast: forecastData,
            location,
            address,
          });
        });
      }
    });
  }
});

app.get("*", (req, res) => {
  res.render("missing", {
    title: "404 Not Found!",
    name: "Erick Vicentin",
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
