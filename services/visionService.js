import { bing } from '../clients/bingClient.js';

export async function getVisionService(message, streamingReply) {
    let imageBase64 = null;
    const media = await message.downloadMedia();
    const mimeType = media.mimetype;
    const isImage = mimeType?.includes('image');
    if (isImage) imageBase64 = media.data;

    let streamingReplyBody = streamingReply.body;
    let tokenQueue = [];
    let isProcessingQueue = false;
    let isEditingReply = null;

    async function onTokenStream(token) {
        const isWebSearch = token.startsWith('Searching') && tokenQueue.length === 0;
        if (isWebSearch) token = ` ${token} ...\n\n`; // Formats the web search message nicely

        tokenQueue.push(token);

        if (!isProcessingQueue) {
            isProcessingQueue = true;
            await processTokenQueue();
        }
    }

    async function processTokenQueue() {
        if (tokenQueue.length !== 0) {
            const token = tokenQueue[0];
            const newReplyContent = streamingReplyBody + token;
            isEditingReply = streamingReply.edit(newReplyContent);
            streamingReplyBody = newReplyContent;

            tokenQueue.shift(); // Removes the processed token from the queue

            await processTokenQueue(); // Continues processing the queue
        } else {
            isProcessingQueue = false;
        }
    }

    let completion;

    completion = await bing.sendMessage(message.body, {
        jailbreakConversationId: true,
        systemMessage: process.env.VISION_SYSTEM_MESSAGE,
        toneStyle: 'creative',
        imageBase64,
        onProgress: onTokenStream,
    });

    return Promise.all([completion, isEditingReply]).then(([completion]) => completion);
}
