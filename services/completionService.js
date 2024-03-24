import { bing } from '../clients/bingClient.js';

export async function getCompletionService(message, streamingReply) {
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
    let question = message.body.slice(5).trim();
    let isSource = question.toLowerCase().includes('source');

    if (!question)
        question =
            'Hi, describe your self in a short sentence with your abilities. I want to ask you some questions.';

    completion = await bing.sendMessage(question, {
        jailbreakConversationId: true,
        systemMessage: process.env.BING_SYSTEM_MESSAGE,
        toneStyle: 'creative',
        onProgress: onTokenStream,
    });

    if (isSource)
        completion.response = removeFootnotes(completion.response) + '\n\n' + getSources(completion);
    else completion.response = removeFootnotes(completion.response);

    // This is needed to make sure that the last edit to the reply is actually
    // the formatted completion.response, and not some random edit by the queue processing
    return Promise.all([completion, isEditingReply]).then(([completion]) => completion);
}

function removeFootnotes(text) {
    // Use a regular expression to match and remove the "[^x^]" pattern, where x is a number.
    const cleanedText = text.replace(/\[\^\d+\^\]/g, '');
    return cleanedText;
}

function getSources(completion) {
    const sources = completion.details.sourceAttributions;

    // All the sources enumerated, eg: "Sources\n\n1. Source 1\n2. Source 2"
    const sourcesList = sources.map((source, i) => `${i + 1}. ${source.seeMoreUrl}`);

    return (sourcesList.length && '*Sources:*\n' + sourcesList.join('\n')) || '';
}
