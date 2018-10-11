const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const InsectSchema = new Schema({
	commonName: String,
	scientificName: String,
	familyName: String,
	family: {
    type: Schema.Types.ObjectId,
    ref: 'Family'
  },
	image: String,
	summary: String,
	description: String,
	link: String
});

const Insect = mongoose.model('Insect', InsectSchema)
module.exports = Insect;
