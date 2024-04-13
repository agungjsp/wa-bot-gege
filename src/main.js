import { setupAudioHandlers } from '../handlers/audioHandlers.js';
import { setupAuthHandlers } from '../handlers/authHandlers.js';
import { setupMessageHandlers } from '../handlers/messageHandlers.js';
import { setupStickerHandlers } from '../handlers/stickerHandlers.js';
import { setupDownloaderHandlers } from '../handlers/downloaderHandlers.js';
import { setupVisionHandlers } from '../handlers/visionHandlers.js';
import initializeClient from './../clients/whatsappClient.js';

import dotenv from 'dotenv';
dotenv.config();

const client = initializeClient();

setupAuthHandlers(client);
setupMessageHandlers(client);
setupVisionHandlers(client);
setupAudioHandlers(client);
setupStickerHandlers(client);
setupDownloaderHandlers(client);

client.initialize();
