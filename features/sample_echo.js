/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

module.exports = function(controller) {

    controller.on("welcome", async (bot, message) => {
        message.watsonData.output = message.welcome_message ? message.watsonData.output : '';
        //console.log(message.watsonData.output);
        console.log("I am in controller on");
        if (message.watsonData) {
            await bot.reply(message, message.watsonData.output);
        }
    });    

    controller.hears(['.*'],'message', async(bot, message) => {
        if (message.watsonError) {
            console.log(watson_msg);
            await bot.reply(
                message,
                "I'm sorry, but for technical reasons I can't respond to your message"
            );
        } else {
            var watson_msg = message.watsonData.output;
            console.log(watson_msg.generic[0].response_type);
            if (watson_msg.generic[0].response_type == 'text') {
                await bot.reply(message, watson_msg.text[0]);
            }
            else {
                await bot.reply(message, 'Received reply is not a text');
            }
            
        }
    },
    );

    /*controller.on('message,direct_message', async(bot, message) => {
        await bot.reply(message, `Echo: ${ message.text }`);
    });*/

    

}
