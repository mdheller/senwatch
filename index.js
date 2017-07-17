const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const sec = require('./secrets');
const app = express();
const port = process.env.PORT || 3000;

const MongoClient = require('mongodb').MongoClient;
const mongodb = sec.secrets.mongodb;

app.listen(port, () => console.log('Ayo big the server running on port ', port));


app.get('/sens', (req, res) => {
  MongoClient.connect(mongodb, (err, db) => {
    if (err) {
      return console.log('Unable to connect to mongodb server');
    }
    db.collection('Sens').find().toArray().then( (data) => {
      res.json(data);
    });
  });
});

const dTweetsUpdate = require('./update_sens/dTweetsUpdate');
app.get('/dtweets/:twitter_account', (req, res) => {
  let twAccount = req.params.twitter_account;
  dTweetsUpdate.dTweetsUpdate(res, twAccount);
});

const pp3update = require('./update_sens/pp3update');
app.get('/sens/:pp_id/votes', (req, res) => {
  let ppId = req.params.pp_id;
  pp3update.pp3update(res, ppId);
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(__dirname + '/public/images/favicon.ico'));


//next patch stuff
const voteCall = require('./vote_info');
app.get('/vote/:session/:roll_call', (req, res) => {
  let roll_call = req.params.roll_call;
  let session = req.params.session;
  voteCall.voteCall(res, {roll_call, session});
});

const depthVote = require('./vote_info/depthvote');
app.get('/bkw', (req, res) => {
  depthVote.depthVote(res);
});
