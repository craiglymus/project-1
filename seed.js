const db = require('./models');
const mongoose = require('mongoose');

const seedInsects = [
  {
    description: 'This is an example.'
  }
];


db.Insect.deleteMany({}, (err, newInsect)=>{
  if (err) throw err;
  for(let i = 0; i< seedInsects.length; i++){
    db.Insect.create(seedInsects[i], (err, savedInsect)=>{
      if(err) throw err;
      console.log(`Saved ${savedInsect}`);
    });
  }
});
