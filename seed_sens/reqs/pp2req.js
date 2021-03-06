const fs = require('fs'),
  os = require('os'),
  request = require('request'),
  chalk = require('chalk');

const sec = require('./secrets'),
  ppHeadersObj = sec.secrets.ppHeader || 'nunya';

const pp2req = (sen, iter) => {
  let callUrl = {
    url: `https://api.propublica.org/congress/v1/members/${sen.pp_id}.json`,
    headers: ppHeadersObj
  };
  let callback = (err, response, body) => {
    if (response.statusCode <= 200) {
      console.log(
        chalk.dim(
          `${sen.first_name} ${sen.last_name} pp2 recieved @${Date(Date.now())}`
        )
      );

      let data = JSON.parse(body);
      let result = data.results[0];
      sen.dob = result.date_of_birth;
      sen.gender = result.gender;
      sen.committees = result.roles[0].committees;
    } else {
      console.log(
        `@${Date(
          Date.now()
        )}: ${sen.first_name} ${sen.last_name} committees FAILED!`
      );

      const logError = require('../helpers/error_logger.js');
      logError.logError('pp2Call', sen, response);
    }

    let status = sen.dob ? 'yes' : 'no';
    let name = `${sen.first_name} ${sen.last_name}`;
    iter.push({ name, status, time: Date.now() });
    console.log(
      chalk.blue(
        `pp2 progress: ${iter.length}/100${iter.length == 100 ? '!' : '...'}`
      )
    );
  };

  request(callUrl, callback);
};

exports.pp2req = pp2req;
