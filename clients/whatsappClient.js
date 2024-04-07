import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

const wwebVersion = '2.2407.3';

const initializeClient = () => {
    const client = new Client({
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process', // <- this one doesn't works in Windows
                '--disable-gpu',
            ],
        },
        authStrategy: new LocalAuth(),
        webVersionCache: {
            type: 'remote',
            remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
        },
    });

    return client;
};

export default initializeClient;
