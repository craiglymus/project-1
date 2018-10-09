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

app.get('/', (req,res) =>{
  res.sendFile('/views/index.html', {root: __dirname});
});

app.listen(port, () => {
  console.log(`Bug app is listening on port:${port}`);
})
