const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const InsectSchema = new Schema({
	description: String
});

const Insect = mongoose.model('Insect', InsectSchema)

const mongoose = require('mongoose'),

module.exports = Insect;
