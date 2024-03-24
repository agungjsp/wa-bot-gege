import qrcode from 'qrcode-terminal';

export function setupAuthHandlers(client) {
    // Fired when the loading screen is displayed.
    // The handler logs the loading screen's progress and message to the console.
    client.on('loading_screen', (percent, message) => {
        console.log('LOADING SCREEN', percent, message);
    });

    // Fired when a QR code is received for authentication.
    // The handler generates and displays the QR code in the terminal.
    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
    });

    // Fired when the client is authenticated.
    // The handler logs the session information to the console.
    client.on('authenticated', () => {
        console.log('You are authenticated!');
    });

    // Fired if the session restore was unsuccessful.
    // The handler logs an error message to the console.
    client.on('auth_failure', () => {
        console.error('Failed to authenticate!');
    });

    // Fired when the client is ready.
    // The handler logs a readiness message to the console.
    client.on('ready', () => {
        console.log('Client is ready!');
    });

    // Ping the client to check if it is still connected.
    // The handler logs a ping message to the console.
    client.on('message_create', (message) => {
        if (message.body === '!ping') {
            console.log(`Ping received from ${message.from}!`);
            client.sendMessage(message.from, 'Pong!');
        }
    });
}
