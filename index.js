require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const apiRouter = require("./routers");
const cookieParser = require("cookie-parser");

const app = express();

// middlewares
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", //רק מהאתר הזה מותר לשלוח בקשות עם cookies
    credentials: true, //מאפשר שליחה וקבלה של cookies עם HttpOnly
  })
);
app.use(cookieParser());

// routers
app.use("/api", apiRouter);

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("connected to mongoDB");
    const port = process.env.PORT;
    app.listen(port, () => console.log(`server listen on port ${port}`));
  })
  .catch((err) => console.log(err));
