/** Con figuration **/
const express = require('express');
const app = express();
const db = require('./models');

const port = process.env.PORT || 3000;


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

/* Routes */

//Root Route
app.get('/', (req, res) => {
  res.sendFile('/views/index.html', {
    root: __dirname
  });
});

//Add Bug Route

app.get('/addbug', (req, res) => {
  res.sendFile('/views/addbug.html', {root: __dirname});
});

//Search Routes

app.get('/search', (req, res) =>{
  res.sendFile('/views/search.html', {root: __dirname});
})



//Read: Get all insects in database

app.get('/api/insects', (req, res) => {
  db.Insect.find({})
           .populate('family')
           .exec((err, insects) => {
             if (err) throw err;
             res.json(insects)
           });
});

app.get('/api/insects/:id', (req, res)=>{
  db.Insect.findOne({_id : req.params.id}, (err, foundInsect) =>{
    if (err) throw err;
    res.json(foundInsect);
  })
})

// Read: Get all families in database

app.get('/api/families', (req, res) => {
  db.Family.find ({})
           .populate('insects')
           .exec((err, families) => {
             if (err) throw err;
             res.json(families);
           });
});


//Read: Returns all insect queries that share the user's query in their common name
app.get('/api/insects/species/:name', (req, res)=>{
  console.log(`looking for ${req.params.name}`)
  let searchName = req.params.name;
  db.Insect.find({ commonName: new RegExp(searchName,"i")}, (err, foundInsect) =>{
    if (err) throw err;
    res.json(foundInsect);
  })
})

//Create: Creates new insect entry
app.post('/api/insects', (req, res) => {
  let insectData = req.body;
  console.log (`posting ${insectData}`);
  db.Insect.create(insectData, (err, savedInsect) => {
    if (err) throw err;
    db.Family.findOne({name: insectData.familyName}, (err, savedFamily) => {
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

      res.json(savedFamily)
    });
  })
});

//Delete: Destroys existing insect entry

app.delete('/api/insects/:id', (req, res) => {
  let insectId = req.params.id;
  console.log(insectId)
  db.Insect.deleteOne({_id: insectId}, (err, deletedInsect) => {
    if (err) throw err;
    res.json(deletedInsect)
  })
});

//Update: Edits existing insect entry
app.put(`/api/insects/:id`, (req, res) => {
  let insectId = req.params.id;
  console.log(`Editing: ${req.body}`)

  db.Insect.findOneAndUpdate({ _id: insectId }, req.body, (err, updatedInsect) => {
    console.log("success!")
    res.json(updatedInsect);
  });
});

// Server should listen on some port
app.listen(port, () => {
  console.log(`Bug app is listening on port:${port}`);
})
