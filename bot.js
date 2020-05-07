//  __   __  ___        ___
// |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

// This is the main file for the chatbot_sample bot.

// Import Botkit's core features
const { Botkit } = require('botkit');
const { BotkitCMSHelper } = require('botkit-plugin-cms');

// Import a platform-specific adapter for web.

const { WebAdapter } = require('botbuilder-adapter-web');
const { WatsonMiddleware } = require('botkit-middleware-watson');

const { MongoDbStorage } = require('botbuilder-storage-mongodb');

// Load process.env values from .env file
require('dotenv').config();

let storage = null;
if (process.env.MONGO_URI) {
    storage = mongoStorage = new MongoDbStorage({
        url : process.env.MONGO_URI,
    });
}


const adapter = new WebAdapter({});

const watsonMiddleware = new WatsonMiddleware({
    iam_apikey: 'dNKhxcXesXFQ8IQQxMo_cTJ_HMkneJxfqVrChxgwudS7',
    url: 'https://api.au-syd.assistant.watson.cloud.ibm.com/',
    workspace_id: 'ac1399d2-ed9f-4e7d-8b9a-b6bedde37325',
    version: '2020-03-25',
    minimum_confidence: 0.75, // (Optional) Default is 0.75,
  });

const controller = new Botkit({
    webhook_uri: '/api/messages',

    adapter: adapter,

    storage
});

if (process.env.CMS_URI) {
    controller.usePlugin(new BotkitCMSHelper({
        uri: process.env.CMS_URI,
        token: process.env.CMS_TOKEN,
    }));
}

controller.middleware.receive.use(
    watsonMiddleware.receive.bind(watsonMiddleware),
  );


// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {
    console.log("Controller ready")
 
    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + '/features');

    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {
        controller.on('message,direct_message', async (bot, message) => {
            let results = false;
            results = await controller.plugins.cms.testTrigger(bot, message);

            if (results !== false) {
                // do not continue middleware!
                return false;
            }
        });
    }
});






