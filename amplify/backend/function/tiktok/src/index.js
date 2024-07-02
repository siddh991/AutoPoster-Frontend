const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  // Log the incoming event for debugging
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Modify the event to match what express expects
  const modifiedEvent = {
    ...event,
    httpMethod: event.requestContext.http.method,
    path: event.rawPath,
  };

  return awsServerlessExpress.proxy(server, modifiedEvent, context, 'PROMISE').promise;
};