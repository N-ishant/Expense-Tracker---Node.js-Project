const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./utils/database");

const userRoutes = require("./routes/users");

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use("/user", userRoutes);

sequelize
  .sync()
  .then((result) => {
    app.listen(8000, () => {
      console.log("Serer started at port 8000");
    });
  })
  .catch((err) => {
    console.log(err);
  });