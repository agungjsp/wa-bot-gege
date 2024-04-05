import { getAudioTranscribeService } from '../services/audioTranscribeService.js';

export async function setupAudioHandlers(client) {
    /*
     * This event is fired when a new message is created.
     */
    client.on('message_create', async (message) => {
        const newMessage = message._data || message;
        if (newMessage.quotedMsg && newMessage.body === '!transcribe') {
            const quotedMessage = await message.getQuotedMessage();
            const media = await quotedMessage.downloadMedia();

            const streamingReply = await message.reply('...');
            const transcriptedText = await getAudioTranscribeService(media, message);

            // Chunk the transcripted text into 1024 characters per message
            if (transcriptedText.length <= 1024) {
                await streamingReply.edit(transcriptedText);
                await message.react('✅');
                return;
            }
            const chunkedText = transcriptedText.match(/.{1,1024}/g);
            for (const chunk of chunkedText) {
                await message.reply(chunk);
            }
            await message.react('✅');
        }
    });
}
