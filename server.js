'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns');
var cors = require('cors');
var fs = require('fs');
const bodyParser = require('body-parser');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser());

// your first API endpoint... 
app.post("/api/shorturl/new", function (req, res) {
  console.log(req.body);
  var rawdata = fs.readFileSync('url.json');  
  var urlFile = [];
  var urlFileParsed = JSON.parse(rawdata);  
  var shortUrl = Object.keys(urlFileParsed).length+1;
  var url = req.params.url;
  dns.lookup(url,function(err, address){
   if (err) res.json({"error":"invalid URL"});
  });
  var responseJson = {"original_url":req.body.url,"short_url":shortUrl};
Object.keys(urlFileParsed).forEach(function(key){
    urlFile.push({"original_url":urlFileParsed[key].original_url,"short_url":urlFileParsed[key].short_url});
  });
  urlFile.push(responseJson);
  fs.writeFileSync('url.json', JSON.stringify(urlFile), (err) => {  
    if (err) throw err;
    console.log('Data written to file');
});
  res.json(responseJson);
});

app.get('/api/shorturl/:index', function(req, res){
  var index = req.params.index;
  var rawdata = fs.readFileSync('url.json');  
  var urlFileParsed = JSON.parse(rawdata);  
    res.redirect(urlFileParsed[index-1].original_url);
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});