import { getCompletionService } from '../services/completionService.js';

export function setupMessageHandlers(client) {
    /*
     * This event is fired when a new message is created.
     */
    client.on('message_create', async (message) => {
        /**
         * !ask <question> - Ask a question to the bot.
         */
        if (message.body.startsWith('!ask') && !message.id.fromMe) {
            let response = '';
            const streamingReply = await message.reply('...');
            console.log('Processing question:', message.body);
            try {
                const completion = await getCompletionService(message, streamingReply);
                response = completion.response;
                await streamingReply.edit(response);
                await message.react('✅');
            } catch (error) {
                console.error('Error processing question:', error);
                client.sendMessage(
                    message.from,
                    "I'm sorry, I couldn't process your question at the moment. Please try again later."
                );
            }
        }

        /**
         * !help - Show help message.
         */
        if (message.body === '!help' && !message.id.fromMe) {
            const helpMessage =
                `Here are the commands you can use:\n` +
                `- *!ask <question>*: Ask any question and get an answer.\n` +
                `- *!image*: Recognize objects in an image. Reply to an image with this command.\n` +
                `- *!audio*: Transcribe an audio message. Reply to an audio message with this command.\n` +
                `- *!sticker*: Create a sticker from an image. Reply to an image with this command or send an image with the command.\n` +
                `- *!tiktok <type> <video link>*: Download a TikTok video. Types: \`nowatermark\` (without watermark), \`watermark\` (with watermark).\n\n` +
                `For more details, visit the project's GitHub page: https://github.com/agungjsp/wa-bot-gege`;
            client.sendMessage(message.from, helpMessage);
        }
    });
}
