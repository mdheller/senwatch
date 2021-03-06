const fs = require ('fs'), os = require('os'), request = require('request'), chalk = require('chalk');

const dTweetsReq = (sen, iter) => {

  let callUrl = `https://projects.propublica.org/politwoops/user/${sen.twitter_account}.json`;

  let callback = (err, response, body) => {
    if (response.statusCode <= 200) {

      console.log(chalk.dim(`${sen.first_name} ${sen.last_name} d_tweets recieved @${Date(Date.now())}`));

      let result = JSON.parse(body);
      let d_tweets = result.tweets.map( (tw) => {
        return {
          created_at: tw.created_at,
          deleted_at: tw.updated_at,
          body: tw.content,
          profile_pic_url: tw.details.user.profile_image_url,
          tw_user_name: tw.user_name
        };
      });
      sen.d_tweets = d_tweets;

    } else {

      console.log(`${sen.first_name} ${sen.last_name} deleted tweets NOT FOUND @${Date(Date.now())}`);

      sen.d_tweets = `no_deleted_tweets_found @${Date(Date.now())}`;

      const logError = require('../helpers/error_logger.js');
      logError.logError('dTweetsCall', sen, response);

    }

    let status = typeof sen.d_tweets == 'string' ? 'no' : 'yes';
    let name = `${sen.first_name} ${sen.last_name}`;
    iter.push({name,status,time:Date.now()});
    console.log(chalk.blue(`dTweets progress: ${iter.length}/100${iter.length==100?'!':'...'}`));
  };

  if (sen.twitter_account.length) {
    request(callUrl, callback);
  } else {
    sen.d_tweets = 'no_twitter_account_on_file';
    iter.push({name,status:'no',time:Date.now()});
  }
};

exports.dTweetsReq = dTweetsReq;
