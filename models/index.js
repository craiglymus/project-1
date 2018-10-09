const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/project-1", {useNewUrlParser: true});

module.exports.Insect = require('./insect');
