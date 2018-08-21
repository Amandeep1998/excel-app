const fs = require('fs-extra');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const express = require('express');
var csv = require('fast-csv');
var app = express();

//Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//fileUpload middleware
app.use(fileUpload());

app.get('/', (req, res) => {
  res.render('upload');
});

app.post('/', (req, res) => {
  var file = req.files.myFile;
  var path = __dirname + '/files/test.csv';
  file.mv(path, function(e) {
    if(e) {
      console.log(e);
    }
  })
  res.redirect('/uploaded');
});


app.get('/uploaded', (req, res) => {
  var arr = [];
  var path = __dirname + '/files/test.csv';
  fs.createReadStream(path)
    .pipe(csv())
    .on('data', function(data) {
      arr.push(data);
    })
    .on('end', function(data) {
      res.render('index', {
          arr: arr
      });
    });
});

app.post('/save', (req, res) => {
  var data = req.body.finalArr;
  var path = __dirname + '/files/test.csv';

  var fastCsv = csv.createWriteStream();
  var writeStream = fs.createWriteStream(path);
  fastCsv.pipe(writeStream);

  for(var i = 0; i < data.length; i++){
      fastCsv.write(data[i]);             //each element inside bracket
      }
  fastCsv.end();

  res.send();
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Starting Server at port ${port}`);
})
