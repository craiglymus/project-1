const db = require('./models');
const mongoose = require('mongoose');
const request = require('request');

/* Populates seed data with Wikipedia summary and image, using MediaWiki's API */
const wikiBaseUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

/* Prepopulated list of Hymenoptera families */
const familyNames = [
  //Ants
  'Formicidae',

  //Bees
  'Apidae',

  //Sawflies
  'Tenthredinidae',

  //Wasps
  'Braconidae',
  'Halictidae',
  'Ichneumonidae',
  'Megachilidae',
  'Mutillidae'
]

const exampleFamily = {
  name: 'Apidae',
  link: 'https://en.wikipedia.org/wiki/Apidae',
  summary: 'Apidae is the largest family within the superfamily Apoidea, containing at least 5700 species of bees. The family includes some of the most commonly seen bees, including bumblebees and honey bees, but also includes stingless bees, carpenter bees, orchid bees, cuckoo bees, and a number of other less widely known groups. Many are valuable pollinators in natural habitats and for agricultural crops.',
  image: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Xylocopa_micans.JPG'
}

/* Prepopulated Insects */
const seedInsects = [{
  commonName: 'western honey bee',
  scientificName: 'apis mellifera',
  familyName: 'Apidae',
  description: `These are probably the bees you're thinking of when you think of honey bees.`,
},
{
  commonName: 'common red ant',
  scientificName: 'myrmica rubra',
  familyName: 'Formicidae',
  description: 'Small red ants found in backyards everywhere.'
}
];



/*
- Create a function to iterate over seedFamilies
  - Create the family records
  - Create insect records
  - Iterate through insects and associate family to insects and vice versa.

*/

//An Array that holds all of the family objects (may delete later)
let seedFamilies = [];

/* Iterates through the families in the familyNames array.
   For each name in the array, it creates a mongoose model that is populated with MediaWiki API information.*/
const addWikiToFamilies = (families) => {

  for (let i = 0; i < families.length; i++) {
    //Initalizes a wikiItem object that will hold all of the data and will be used to create the model.
    let wikiItem = {
      name: families[i]
    };

    let title = wikiItem.name;
    console.log(title);
    let getRequest = {
      method: 'GET',
      url: `${wikiBaseUrl}${title}`,
      headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'my-reddit-client'
      }
    }
    //Pulls from the node.js request module to make an AJAX/HTTP Request through node.
    request(getRequest, (err, res, body) => {
        if (err) throw err;
        let json = JSON.parse(body);
        if (json.type !== 'disambiguation') {

          //If the data exists, it populates with that data.
          if (json.content_urls) wikiItem.link = json.content_urls.desktop.page
          if (json.extract) wikiItem.summary = json.extract;
          if (json.originalimage) wikiItem.image = json.originalimage.source; //eventually, default image

          //Adds the data to the collection seeded families.
          seedFamilies.push(wikiItem);

          //Creates a family document.
          db.Family.create(wikiItem, (err, savedFamily) => {
            console.log(`saved family ${savedFamily}`);
          });
        }
      })
      .on('end', () => {
        console.log(`families: ${seedFamilies}`);
      })
  }
}

addWikiToFamilies(familyNames);

//Delete families
db.Family.deleteMany({}, (err, removedFamilies)=>{
  if (err) throw err;
//Delete Insects
  db.Insect.deleteMany({}, (err, newInsect) => {
    if (err) throw err;
    //for loop for insects
    for (let i = 0; i < seedInsects.length; i++) {
      let wikiItem = seedInsects[i];
      let title = wikiItem.scientificName;

      let getRequest = {
        method: 'GET',
        url: `${wikiBaseUrl}${title}`,
        headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8',
          'User-Agent': 'my-reddit-client'
        }
      }
      request(getRequest, (err, res, body) => {
        let json = JSON.parse(body);
        if (json.content_urls) wikiItem.link = json.content_urls.desktop.page
        if (json.extract) wikiItem.summary = json.extract;
        if (json.originalimage) wikiItem.image = json.originalimage.source;

        db.Insect.create(wikiItem, (err, savedInsect) => {
          if (err) throw err;
          db.Family.findOne({name: wikiItem.familyName}, (err, savedFamily) => {
            if (err) throw err;
            savedFamily.insects.push(savedInsect);
            savedFamily.save((err, savedFamily)=>{
              if (err) throw err;
              console.log(`Saved ${savedFamily}`)
            });
            savedInsect.family = savedFamily;
            savedInsect.save((err, savedInsect)=>{
              if(err) throw err;
              console.log(`Saved ${savedInsect}`)
            });
          });
        });
      });

    }
  });
})


/* Seeds the insect data and populates it with wikipedia data*/
