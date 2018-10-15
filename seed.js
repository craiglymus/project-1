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
];

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

/* Iterates through the families in the familyNames array.
   For each name in the array, it creates a mongoose model that is populated with MediaWiki API information.*/
const addWikiToFamilies = (families) => {

  for (let i = 0; i < families.length; i++) {
    //Initalizes a wikiItem object that will hold all of the data and will be used to create the model.
    let wikiItem = {
      name: families[i]
    };

    let title = wikiItem.name;
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

          //Creates a family document.
          db.Family.create(wikiItem, (err, savedFamily) => {});
        }
      });
      .on('end', () => {})
  }
}

addWikiToFamilies(familyNames);

//Delete families
db.Family.deleteMany({}, (err, removedFamilies) => {
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
      //Populates insects with Wikipedia data
      request(getRequest, (err, res, body) => {
        let json = JSON.parse(body);
        if (json.content_urls) wikiItem.link = json.content_urls.desktop.page
        if (json.extract) wikiItem.summary = json.extract;
        if (json.originalimage) wikiItem.image = json.originalimage.source;

        db.Insect.create(wikiItem, (err, savedInsect) => {
          if (err) throw err;
          db.Family.findOne({
            name: wikiItem.familyName
          }, (err, savedFamily) => {
            if (err) throw err;
            savedFamily.insects.push(savedInsect);
            savedFamily.save((err, savedFamily) => {
              if (err) throw err;
            });
            savedInsect.family = savedFamily;
            savedInsect.save((err, savedInsect) => {
              if (err) throw err;
            });
          });
        });
      });
    }
  });
});
