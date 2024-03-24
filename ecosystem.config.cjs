module.exports = {
    apps: [
        {
            name: 'wa-bot-gege',
            script: './src/main.js',
            instances: 1,
            watch: './src',
            env: {
                NODE_ENV: 'development',
            },
        },
        {
            name: 'wa-bot-gege',
            script: './src/main.js',
            instances: 1,
            watch: false,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
    // Template for deploying the app
    deploy: {
        production: {
            user: 'SSH_USERNAME',
            host: 'SSH_HOSTMACHINE',
            ref: 'origin/master',
            repo: 'GIT_REPOSITORY',
            path: 'DESTINATION_PATH',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': '',
        },
    },
};
