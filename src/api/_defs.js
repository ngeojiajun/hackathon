// Route definition
const express = require('express');

const app = express.Router();
// Submission endpoint
app.use("/submission", require('./submission'));
app.use("/dashboard", require('./dashboard'));
app.use("/manager", require('./manager'));

module.exports = app;