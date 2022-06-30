const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const xss = require("xss-clean");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const sequelize = require("./database/database");
const User = require("./models/user");
const Movie = require("./models/movies");
const Episode = require("./models/episode");

const authRoute = require("./routes/authRoute");

const app = express();

const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(express.json());
app.use(helmet());
app.use(morgan("combined", { stream: logStream }));
app.use(cors());
app.use(xss());

app.use("/auth", authRoute);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const msg = error.message;
  const data = error.data;
  res.status(status).json({ status, data, msg });
});

Episode.belongsTo(Movie, { constraints: true, onDelete: "CASCADE"});
Movie.hasMany(Episode);

const start = async () => {
  //   sequelize
  //     .sync()
  //     .then((data) => {
  //       console.log(data);
  //       app.listen(process.env.PORT || 8080);
  //     })
  //     .catch((err) => console.error(err));

  try {
    await sequelize.sync();
    //await sequelize.sync({ force: true });
    app.listen(process.env.PORT || 8080);
  } catch (err) {
    console.log(err);
  }
};

start();
