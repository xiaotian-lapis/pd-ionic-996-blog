/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// database
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand
} = require('@aws-sdk/lib-dynamodb');

const tableName = 'demo-blog-table';

const client = new DynamoDBClient();

const dynamo = DynamoDBDocumentClient.from(client);

/**********************
 * Example get method *
 **********************/

app.get('/blogs', async function(req, res) {
  const response = await dynamo.send(
    new ScanCommand({
      TableName: tableName
    })
  );
  res.json({ success: 'get call succeed!', url: req.url, data: response.Items });
});

app.get('/blogs/:id', async function(req, res) {
  const response = await dynamo.send(
    new GetCommand({
      TableName: tableName,
      Key: {
        id: req.params.id
      }
    })
  );

  res.json({ success: 'get call succeed!', url: req.url, data: response.Item });
});


/****************************
 * Example post method *
 ****************************/

app.post('/blogs', async function(req, res) {
  // Add your code here
  const requestJson = JSON.parse(req.body);
  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        id: requestJson.id,
        title: requestJson.title,
        content: requestJson.content,
        description: requestJson.description,
        author: requestJson.author,
        createdTime: requestJson.createdTime,
        updatedTime: requestJson.updatedTime,
        location: {
          lat: requestJson.location.lat,
          lng: requestJson.location.lng,
          addr: requestJson.location.addr
        }
      }
    })
  );

  res.json({ success: 'post call succeed!', url: req.url, data: requestJson });
});

/****************************
 * Example put method *
 ****************************/
app.put('/blogs/*', async function(req, res) {
  // Add your code here
  const requestJson = JSON.parse(req.body);
  const response = await dynamo.send(
    new UpdateCommand(
      {
        TableName: tableName,
        Key: {
          id: requestJson.id
        },
        UpdateExpression: 'set title = :t, content = :c, description = :d, author = :a, createdTime = :ct, updatedTime = :ut, location = :l',
        ExpressionAttributeValues: {
          ':t': requestJson.title,
          ':c': requestJson.content,
          ':d': requestJson.description,
          ':a': requestJson.author,
          ':ct': requestJson.createdTime,
          ':ut': requestJson.updatedTime,
          ':l': {
            lat: requestJson.location.lat,
            lng: requestJson.location.lng,
            addr: requestJson.location.addr
          }
        },
        ReturnValues: 'UPDATED_NEW'
      }
    )
  );

  res.json({ success: 'put call succeed!', url: req.url, data: requestJson, response: response });
});

/****************************
 * Example delete method *
 ****************************/
app.delete('/blogs/*', async function(req, res) {
  await dynamo.send(
    new DeleteCommand({
      TableName: tableName,
      Key: {
        id: req.params.id
      }
    })
  );
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.listen(3000, function() {
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
