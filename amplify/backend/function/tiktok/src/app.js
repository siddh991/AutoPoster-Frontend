/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const express = require('express')
const querystring = require("querystring")
const axios = require("axios");
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const session = require("express-session");
const cookieParser = require("cookie-parser");

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(awsServerlessExpressMiddleware.eventContext())
app.use(cookieParser());



app.get("/oauth", (req, res) => {
  let url = "https://www.google.com";
  // const csrfState = Math.random().toString(36).substring(2);
  // res.cookie("csrfState", csrfState, { maxAge: 60000 }); 
  // let url = "https://www.tiktok.com/v2/auth/authorize/";
  // // the following params need to be in `application/x-www-form-urlencoded` format.
  // url += "?client_key=<your client key>";
  // url += "&scope=user.info.basic,user.info.profile,user.info.stats,video.list";
  // url += "&response_type=code";
  // url +=
  // "&redirect_uri=<your redirect uri>";
  // url += "&state=" + csrfState;
  res.json({ url: url });
});
  
  
app.post("/tiktokaccesstoken", async (req, res) => {
  try {
    const { code } = req.body;
    const decode = decodeURI(code);
    const tokenEndpoint = "https://open.tiktokapis.com/v2/oauth/token/";
    const params = {
      client_key: "< Your client key>",
      client_secret: "<Your client secret>",
      code: decode,
      grant_type: "authorization_code",
      redirect_uri:"<your redirect uri>",
    };
    const response = await axios.post(
      tokenEndpoint,
      querystring.stringify(params),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
      }
    );
    console.log("response>>>>>>>", response.data);
    res.send(response.data);
  } catch (error) {
    console.error("Error during callback:", error.message);
    res.status(500).send("An error occurred during the login process.");
  }
});


// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app




// /**********************
//  * Example get method *
//  **********************/

// app.get('/item', function(req, res) {
//   // Add your code here
//   res.json({success: 'get call succeed!', url: req.url});
// });

// app.get('/item/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'get call succeed!', url: req.url});
// });

// /****************************
// * Example post method *
// ****************************/

// app.post('/item', function(req, res) {
//   // Add your code here
//   res.json({success: 'post call succeed!', url: req.url, body: req.body})
// });

// app.post('/item/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'post call succeed!', url: req.url, body: req.body})
// });

// /****************************
// * Example put method *
// ****************************/

// app.put('/item', function(req, res) {
//   // Add your code here
//   res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });

// app.put('/item/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });

// /****************************
// * Example delete method *
// ****************************/

// app.delete('/item', function(req, res) {
//   // Add your code here
//   res.json({success: 'delete call succeed!', url: req.url});
// });

// app.delete('/item/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'delete call succeed!', url: req.url});
// });

// app.listen(3000, function() {
//     console.log("App started")
// });

// // Export the app object. When executing the application local this does nothing. However,
// // to port it to AWS Lambda we will create a wrapper around that will load the app from
// // this file
// module.exports = app
