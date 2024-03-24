import { setupAuthHandlers } from '../handlers/authHandlers.js';
import { setupMessageHandlers } from '../handlers/messageHandlers.js';
import { setupVisionHandlers } from '../handlers/visionHandlers.js';
import initializeClient from './../clients/whatsappClient.js';

import dotenv from 'dotenv';
dotenv.config();

const client = initializeClient();

setupAuthHandlers(client);
setupMessageHandlers(client);
setupVisionHandlers(client);

client.initialize();
