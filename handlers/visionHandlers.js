import { getVisionService } from '../services/visionService.js';

export function setupVisionHandlers(client) {
    let usersAwaitingResponseImage = new Set();
    /*
     * Listen for messages that start with '!scanimage' and then wait for the user to send an image.
     * Once the image is received, process the image and send the response back to the user.
     * The response is the result of the image recognition.
     */
    client.on('message_create', async (message) => {
        /*
         * !scanimage - Ask the bot to recognize the content of an image.
         */
        const senderId = message.from;
        if (message.body === '!scanimage' && !message.id.fromMe) {
            usersAwaitingResponseImage.add(senderId);
            client.sendMessage(senderId, 'Send me an image and I will try to recognize what is in it!');
        } else if (usersAwaitingResponseImage.has(senderId) && message.hasMedia) {
            usersAwaitingResponseImage.delete(senderId);

            let response = '';
            const streamingReply = await message.reply('...');
            console.log('Processing vision:', message.body);

            try {
                const completion = await getVisionService(message, streamingReply);
                response = completion.response;
                await streamingReply.edit(response);
                await message.react('✅');
            } catch (error) {
                console.error('Error processing vision:', error);
                client.sendMessage(
                    senderId,
                    "I'm sorry, I couldn't process your vision at the moment. Please try again later."
                );
            }
        }
    });
}
