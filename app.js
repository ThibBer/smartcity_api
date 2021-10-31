const Router = require('./route');
const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());
app.use(Router);

app.listen(port, () => {
    console.log("Authors : BERNARD Nicolas & BERG Thibaut");
    console.log(`SmartCity API listening at http://localhost:${port}`);
});