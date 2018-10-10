const db = require('./models');
const mongoose = require('mongoose');



const familyNames = [
  //Ants
  'Formicidae',

  //Bees
  'Apidae',

  //Sawflies
  'Agridae',
  'Tenthredinidae',

  //Wasps
  'Braconidae',
  'Halictidae',
  'Ichneumonidae',
  'Megachilidae',
  'Mutillidae'
]

const seedFamilies = [
  {
    name: 'Apidae',
    summary: 'Apidae is the largest family within the superfamily Apoidea, containing at least 5700 species of bees. The family includes some of the most commonly seen bees, including bumblebees and honey bees, but also includes stingless bees (also used for honey production), carpenter bees, orchid bees, cuckoo bees, and a number of other less widely known groups. Many are valuable pollinators in natural habitats and for agricultural crops.',
    image: 'https://en.wikipedia.org/wiki/Apidae#/media/File:Xylocopa_micans.JPG',
    link: 'https://en.wikipedia.org/wiki/Apidae'
  }
];


const seedInsects = [
  {
    commonName: 'western honey bee',
    scientificName: 'apis mellifera',
    familyName: 'Apidae',
    image: 'https://en.wikipedia.org/wiki/Western_honey_bee#/media/File:Apis_mellifera_Western_honey_bee.jpg',
    summary: `The western honey bee or European honey bee (Apis mellifera) is the most common of the 7–12 species of honey bee worldwide. The genus name Apis is Latin for "bee", and mellifera is the Latin for "honey-bearing", referring to the species' production of honey for the winter.`
    description: `These are probably the bees you're thinking of when you think of 'honey bees'.`,
    link: 'https://en.wikipedia.org/wiki/Western_honey_bee'
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
