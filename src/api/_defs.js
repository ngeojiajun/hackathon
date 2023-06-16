// Route definition
const express = require('express');

const app = express.Router();
// Submission endpoint
app.use("/submission", require('./submission'));
app.use("/dashboard", require('./dashboard'));

module.exports = app;