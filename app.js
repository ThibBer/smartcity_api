const Router = require('./route');
const express = require('express');
const cors = require("cors");

const app = express();
const port = process.env.PORT ?? 2001;

app.use(cors());
app.use(express.json());
app.use(Router);
app.use("/reportTypes", express.static("./images/reportTypes"));

app.listen(port, () => {
    console.log("Authors : BERNARD Nicolas & BERG Thibaut");
    console.log(`SmartCity API listening at http://localhost:${port}`);
});