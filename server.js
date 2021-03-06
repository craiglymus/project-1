/** Configuration **/
const express = require('express');
const app = express();
const db = require('./models');
const port = process.env.PORT || 3000;

//Parses json to url
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static('public'));

/* API route data */

const routes = [
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

/* Routes */

//Root Route
app.get('/', (req, res) => {
  res.sendFile('/views/index.html', {
    root: __dirname
  });
});

//Add Bug Route
app.get('/addbug', (req, res) => {
  res.sendFile('/views/addbug.html', {
    root: __dirname
  });
});

//Search Route
app.get('/search', (req, res) => {
  res.sendFile('/views/search.html', {
    root: __dirname
  });
})

//API Documentation Route
app.get('/documentation', (req, res) => {
  res.sendFile('/views/documentation.html', {
    root: __dirname
  });
});

//Read: Get all API Endpoints
app.get('/api', (req, res) => {
  console.log('Requesting routes');
  res.json(routes);
});


//Read: Get all insects in database
app.get('/api/insects', (req, res) => {
  db.Insect.find({})
    .populate('family')
    .exec((err, insects) => {
      if (err) throw err;
      res.json(insects)
    });
});

//Read: Gets an individual insect by ID
app.get('/api/insects/:id', (req, res) => {
  db.Insect.findOne({
    _id: req.params.id
  }, (err, foundInsect) => {
    if (err) throw err;
    res.json(foundInsect);
  })
})

// Read: Get all families in database
app.get('/api/families', (req, res) => {
  db.Family.find({})
    .populate('insects')
    .exec((err, families) => {
      if (err) throw err;
      res.json(families);
    });
});


//Read: Returns all insect queries that share the user's query in their common name
app.get('/api/insects/species/:name', (req, res) => {
  console.log(`looking for ${req.params.name}`)
  let searchName = req.params.name;
  db.Insect.find({
    commonName: new RegExp(searchName, "i")
  }, (err, foundInsect) => {
    if (err) throw err;
    res.json(foundInsect);
  });
});

//Create: Creates new insect entry
app.post('/api/insects', (req, res) => {
  let insectData = req.body;
  console.log(`posting ${insectData}`);
  db.Insect.create(insectData, (err, savedInsect) => {
    if (err) throw err;
    db.Family.findOne({
      name: insectData.familyName
    }, (err, savedFamily) => {
      if (err) throw err;
      savedFamily.insects.push(savedInsect);
      savedFamily.save((err, savedFamily) => {
        if (err) throw err;
        console.log(`Saved ${savedFamily}`)
      });
      savedInsect.family = savedFamily;
      savedInsect.save((err, savedInsect) => {
        if (err) throw err;
        console.log(`Saved ${savedInsect}`)
      });

      res.json(savedFamily)
    });
  })
});

//Create: Creates a new family
app.post('/api/families', (res, req) => {
  let familyName = req.body.name;
  db.Family.create({
    name: familyName
  }, (err, savedFamily) => {
    if (err) throw err;
    console.log(`Saved ${savedFamily}`);
    res.json(savedFamily);
  })
})

//Delete: Destroys existing insect entry

app.delete('/api/insects/:id', (req, res) => {
  let insectId = req.params.id;
  console.log(insectId)
  db.Insect.deleteOne({
    _id: insectId
  }, (err, deletedInsect) => {
    if (err) throw err;
    res.json(deletedInsect)
  })
});

//Update: Edits existing insect entry
app.put(`/api/insects/:id`, (req, res) => {
  let insectId = req.params.id;
  console.log(`Editing: ${req.body}`)

  db.Insect.findOneAndUpdate({
    _id: insectId
  }, req.body, (err, updatedInsect) => {
    if (err) throw err;
    console.log("success!")
    res.json(updatedInsect);
  });
});

// Server should listen on some port
app.listen(port, () => {
  console.log(`Bug app is listening on port:${port}`);
})
