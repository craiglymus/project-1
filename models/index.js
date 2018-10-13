const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/project-1", {useNewUrlParser: true});

module.exports.Insect = require('./insect');
module.exports.Family = require('./family');
