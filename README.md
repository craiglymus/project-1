# Bug Bounty
General Assembly Web Development Immersive Project 1

By Craig Lymus, Natasha Quijano, & Tay Solis

Bug Bounty is a searchable resource for bug lovers and curious minds to easily browse a database of bug species. Users can search for species and contribute to the database by adding and editing entries.

Species in the database are organized by Family.

## Technologies
- MongoDB with mongoose
- express
- request (node.js library for http requests)
- Heroku
- HTML5
- CSS
- Javascript with jQuery
- MediaWiki API

## Features

**An Easy to Use API**
Users will be able to get entries from the entire database or by family. Users will also be able to retrieve individual insect information by common/scientific name of insect.

**Intuitive Website**
Users will be able to interface with our database through our easy to use search engine. Users can also contribute to the database by adding, editing, and deleting entries.

**Wikipedia Integration**
Entries in the database are supplemented with information pulled from MediaWiki's API. This means that species information as well as professional quality photos are pre-populated.

## Our Design
Natasha handled our branding using her UI/UX experience.

## Documentation
**Endpoint URL**

### Endpoints
```javascript
[
  {
    method: 'GET',
    path: '/api',
    description: 'Describes all available endpoints'
  },
  {
    method: 'GET',
    path: '/api/insects',
    description: 'Returns all insects in the database'
  },
  {
    method: 'GET',
    path: '/api/families',
    description: 'Returns all insects by family'
  },
  {
    method: 'GET',
    path: '/api/insects/:id',
    description: 'Returns an individual by id.'
  },
  {
    method: 'GET',
    path: '/api/insects/species/:name',
    description: 'Returns an individual insect by common name.'
  },
  {
    method: 'PUT',
    path: '/api/insects/:id',
    description: 'Edits an existing entry in the database'
  },
  {
    method: 'POST',
    path: '/api/insects',
    description: 'Adds an insect entry to the database'
  },
  {
    method: 'POST',
    path: '/api/families',
    description: 'Adds a family entry to the database'
  },
  {
    method: 'DELETE',
    path: '/api/insects/:id',
    description: 'Destroys an existing entry'
  }
]
```

## Victories
- Our branding took a lot of effort. We have a crisp, clean UI with a thoughtfully designed logo. We believe that our design is professional level.

- The add and edit features were implemented in what feels like a very efficient manner.
```javascript
let editBugCommonName = $('#editBugCommonName').val();
let editBugScientificName = $('#editBugScientificName').val();
let editBugFamilyName = $('#editBugFamilyName').val();
let editBugDescription = $('#editBugDescription').val();
let editBugSummary = $('#editBugSummary').val();

let editFormData = {
  commonName: editBugCommonName,
  scientificName: editBugScientificName,
  familyName: editBugFamilyName,
  description: editBugDescription,
  summary: editBugSummary
}

```

- Our search feature was implemented with RegEx, which means that our search will include any entry that includes the search term. The search feature in of itself was a tricky question, mostly because we(Tay) overcomplicated it at first.

```javascript
app.get('/api/insects/species/:name', (req, res)=>{
  console.log(`looking for ${req.params.name}`)
  let searchName = req.params.name;
  db.Insect.find({ commonName: new RegExp(searchName,"i")}, (err, foundInsect) =>{
    if (err) throw err;
    res.json(foundInsect);
  });
});
```

- Dynamically adding Wikipedia information to our database entries in both the front end and the server side. For this, we had to pull in an external library, request, that allows node to make HTTP requests.

```javascript
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
      });
    }
  })
```

## Challenges
- We had a lot of problems handling our workflow. We started out with an inefficient workflow that ended up deleting out work over and over, and only caught it 4:30pm on Friday before the deadline. However, we asked for help from a professional developer, who walked us through a workflow that was much more efficient.

- We had frustrating styling issues between the normal design and the responsive, especially when it came to our dynamically created content and our navbar.

- Some of the API code had unexpected behavior, causing our code to not be very DRY.

## For the future
We had a lot of ideas for stretch goals that were unrealistic to implement in the project time. These included:
- Form Validation
- Database Validation
- Asking the user if they're sure when they're completing actions
- Having the user check which Wikipedia article they're pulling to make sure it's the correct one
- Searching by either common name, scientific name, or keywords
- Having a sidebar for viewing categories on the search page ala Craigslist
