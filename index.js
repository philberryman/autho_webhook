var express = require('express');
var app = express();
var requestClient = require('request');

app.route('/').get((request, response) => {


  var token = request.get('Authorization');

  if (!token) {
    response.json({'x-hasura-role': 'anonymous'});
    return;
  } else {
    // Fetch information about this user from
    // auth0 to validate this token
    // NOTE: Replace the URL with your own auth0 app url
    var options = {
      url: `berryman.eu.auth0.com`,
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      }
    };

    requestClient(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        var userInfo = JSON.parse(body);
        console.log(userInfo); //debug
        var hasuraVariables = {
          'X-Hasura-User-Id': userInfo.sub,
          'X-Hasura-Role': 'user'
        };
        console.log(hasuraVariables); // For debug
        response.json(hasuraVariables);
      } else {
        // Error response from auth0
        console.log(err, res, body);
        response.json({'x-hasura-role': 'anonymous'});
        return;
      }
    });
  }
});

app.listen(3000,()=>{console.log('running')});
