import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

const wwebVersion = '2.2407.3';

const initializeClient = () => {
    const client = new Client({
        authStrategy: new LocalAuth(),
        webVersionCache: {
            type: 'remote',
            remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
        },
    });

    return client;
};

export default initializeClient;
