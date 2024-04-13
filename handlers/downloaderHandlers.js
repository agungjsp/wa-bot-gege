import fs from 'fs';
import pkg from 'whatsapp-web.js';
import { getVideoTikTok } from '../services/downloaderService.js';

const { MessageMedia } = pkg;

export function setupDownloaderHandlers(client) {
    /*
     * This event is fired when a new message is created.
     */
    client.on('message_create', async (message) => {
        /**
         * !tiktok - Download a TikTok video.
         */
        if (message.body.startsWith('!tiktok')) {
            const type = message.body.split(' ')[1];
            const tiktokUrl = message.body.split(' ')[2];

            if (!isValidType(type)) {
                await message.reply(
                    'Invalid TikTok download type. Use `!tiktok watermark <url>` or `!tiktok nowatermark <url>`.'
                );
                return;
            }

            const streamingReply = await message.reply('Processing TikTok download...');
            console.log('Processing TikTok download:', message.body);
            
            let response;

            try {
                response = await getVideoTikTok(tiktokUrl, type === 'watermark');
                await sendTikTokVideo(message, response);
                await streamingReply.edit('Video downloaded successfully!');
                await message.react('✅');
                console.log('Video sent successfully!');
            } catch (error) {
                console.error('Error processing TikTok download:', error);
                await message.reply('Failed to download TikTok video.');
                await message.react('❌');
            } finally {
                console.log('Cleaning up temporary files...');
                await cleanupFiles(response.inputPath, response.outputPath);
            }
        }
    });
}

function isValidType(type) {
    return type === 'nowatermark' || type === 'watermark';
}

async function sendTikTokVideo(message, response) {
    const media = MessageMedia.fromFilePath(response.outputPath);
    const caption = formatCaption(response.detail);
    await message.client.sendMessage(message.from, media, { caption });
}

function formatCaption(detail) {
    return [
        '*Tiktok Details:*',
        `Author: ${detail.creator}`,
        `Created At: ${detail.createdAt}`,
        '---',
        `Download: ${detail.download}`,
        `Likes: ${detail.like}`,
        `Shares: ${detail.share}`,
        `Comments: ${detail.comment}`,
        `Plays: ${detail.play}`,
        '---',
        '*Tiktok Caption:*',
        `${detail.desc}`,
    ].join('\n');
}

async function cleanupFiles(inputPath, outputPath) {
    try {
        await fs.promises.unlink(inputPath);
        await fs.promises.unlink(outputPath);
        console.log('Temporary files deleted successfully!');
    } catch (error) {
        console.error('Error deleting temporary files:', error);
    }
}
