export function setupStickerHandlers(client) {
    /*
     * This event is fired when a new message is created.
     */
    client.on('message_create', async (message) => {
        /**
         * !sticker - Create a sticker from a given image
         */

        if (
            message.type === 'image' &&
            message._data.caption &&
            message._data.caption.startsWith('!sticker')
        ) {
            console.log('Processing sticker command via caption...');
            try {
                const media = await message.downloadMedia();
                await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
                await message.react('✅');
            } catch (error) {
                console.error('Error processing sticker command via caption:', error);
                await message.reply('Failed to create sticker.');
            }
        } else if (message.body === '!sticker') {
            const quotedMessage = await message.getQuotedMessage();
            if (message.hasQuotedMsg && quotedMessage.hasMedia) {
                console.log('Processing sticker command via quoted message...');
                try {
                    const media = await quotedMessage.downloadMedia();
                    await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
                    await message.react('✅');
                } catch (error) {
                    console.error('Error processing sticker command via quoted message:', error);
                    await message.reply('Failed to create sticker.');
                }
            }
        }
    });
}
