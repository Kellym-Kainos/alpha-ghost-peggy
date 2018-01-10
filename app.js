var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
const cognitiveServices = require('botbuilder-cognitiveservices');

require('dotenv').config();

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());


// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);


// Setup QnA Maker
const recognizer = new cognitiveServices.QnAMakerRecognizer({
    knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
    subscriptionKey: process.env.SUBSCRIPTION_KEY
});

const qnaMakerDialog = new cognitiveServices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: 'Sorry, no match found!',
    qnaThreshold: 0.3
});

bot.dialog('/', qnaMakerDialog);