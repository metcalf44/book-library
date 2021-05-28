
const express = require('express');
const app = express();

const readerRouter = require('./routes/reader');

app.use(express.json());
app.use(readerRouter);


module.exports = app;