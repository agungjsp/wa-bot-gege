import { BingAIClient } from '@waylaidwanderer/chatgpt-api';

export const bing = new BingAIClient({
    cookies: process.env.BING_COOKIES,
});
