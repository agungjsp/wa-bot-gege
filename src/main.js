import { setupAuthHandlers } from '../handlers/authHandlers.js';
import initializeClient from './../clients/whatsappClient.js';

import dotenv from 'dotenv';
dotenv.config();

const client = initializeClient();

setupAuthHandlers(client);

client.initialize();
