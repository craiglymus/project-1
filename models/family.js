const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const FamilySchema = new Schema({
	name: String,
  summary: String,
  image: String,
  insects: [{
    type: Schema.Types.ObjectId,
    ref: 'Insect'
  }],
  link: String
});

const Family = mongoose.model('Family', FamilySchema)
module.exports = Family;
