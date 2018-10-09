# <BRAND NAME>
General Assembly Web Development Immersive Project 1
By Craig Lymus, Natasha Quijano, & Tay Solis

<BRAND NAME> is a searchable resource for bug lovers and curious minds to easily browse a database of bug species. Users can search for species by name (eventually by region and description) and contribute to the database by adding and editing entries.

Species in the database are organized by Family.

## Technologies
- MongoDB with mongoose
- express
- Heroku
- HTML5
- CSS
- Javascript with jQuery
- MediaWiki API

## Features

**An Easy to Use API**
Users will be able to get entries from the entire database or by family. Users will also be able to retrieve individual insect information by common/scientific name of insect.

**Intuitive Website**
Users will be able to interface with our database through <URL>, providing an easy way to search and contribute to the database.

**Wikipedia Integration**
Entries in the database are supplemented with information pulled from MediaWiki's API. This means that species information as well as professional quality photos are pre-populated.

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
    path: '/api/insects/:id',
    description: 'Returns an individual by id.'
  },
  {
    method: 'GET',
    path: '/api/insects/:name',
    description: 'Returns an individual insect by name. Accepts common and scientific names.'
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
    method: 'DELETE',
    path: '/api/insects/:id',
    description: 'Destroys an existing entry'
  }
]
```
