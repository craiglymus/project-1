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
app.get('/', (req,res) =>{
  res.sendFile('/views/index.html', {root: __dirname});
});

//Read: Get all insects in database

//Read: Gets individual insect entry by id

//Create: Creates new insect entry

//Delete: Destroys existing insect entry

//Update: Edits existing insect entry

app.listen(port, () => {
  console.log(`Bug app is listening on port:${port}`);
})
