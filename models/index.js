const mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/PROJECT-1", {useMongoClient: true});

// module.exports.Campsite = require("./campsite.js.example");

module.exports.Movie = require('./Insect.js');
