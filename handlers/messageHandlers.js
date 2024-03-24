import { getCompletionService } from '../services/completionService.js';

export function setupMessageHandlers(client) {
    /*
        This event is fired when a new message is created.
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
    });
}
