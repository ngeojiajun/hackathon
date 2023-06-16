// Route definition
const express = require('express');

const app = express.Router();
// Submission endpoint
app.use("/submission", require('./submission'));

module.exports = app;