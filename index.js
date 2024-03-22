// Import the http module
import qrcode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';

// Create a new WhatsApp client instance
const whatsappClient = new Client();

whatsappClient.on('qr', (qr) => {
    // Generate and display the QR code in the terminal
    qrcode.generate(qr, { small: true });
});

whatsappClient.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

// Initialize the WhatsApp client
whatsappClient.initialize();
