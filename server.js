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

//Read: Get all insects in database

app.get('/api/insects', (req, res) => {
  db.Insect.find({})
           .populate('family')
           .exec((err, insects) => {
             if (err) throw err;
             res.json(insects)
           });
});

// Read: Get all families in database

app.get('/api/families', (req, res) => {
  db.Family.find ({})
           .populate('insects')
           .exec((err, families) => {
             if (err) throw err;
             res.json(families);
           });
});


//Read: Gets individual insect entry by id

//Create: Creates new insect entry

app.post('/api/insects', (req, res) => {
  let insectData = req.body
  console.log (`posting ${insectData}`);
  db.Insect.create(insectData, (err, savedInsect) => {
    if (err) throw err;
    res.json(savedInsect)
  })
});

//Delete: Destroys existing insect entry

app.delete(`/api/insects/:id`, (req, res) => {
  let insectId = req.params.id;
  console.log(insectId)
  db.Insect.deleteOne({_id: insectId}, (err, deletedInsect) => {
    if (err) throw err;
    res.json(deletedInsect)
  })
});

//Update: Edits existing insect entry

app.listen(port, () => {
  console.log(`Bug app is listening on port:${port}`);
})
