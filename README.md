# WhatsApp Bot Gege

## Introduction
WhatsApp Bot Gege is an innovative chatbot designed to enhance your WhatsApp messaging experience. Leveraging the power of Large Language Models (LLMs), this bot brings conversational capabilities right into your WhatsApp chats, making it easier than ever to get answers to your questions, recognize images and much more—all through the convenience of your favorite messaging app.

## Features
- **Conversational Intelligence**: Ask any question and get accurate, context-aware responses.
- **Image Recognition**: Send an image to the bot, and it will tell you what it sees.
- **Audio Recognition**: Send an audio message to the bot, and it will transcribe it for you.
- **Sticker Creation**: Create custom stickers from images.
- **Open Source**: WhatsApp Bot Gege is open source, so you can contribute to its development and help make it even better.

## Commands
WhatsApp Bot Gege supports the following commands:
| Command | Description |
| --- | --- |
| `!ask <question>` | Ask a question and get an answer. |
| `!image` | Recognize objects in an image. |
| `!audio` | Transcribe an audio message. |
| `!sticker` | Create a sticker from an image. |

> [!NOTE]
> To use the `!audio` command, you must first reply to an audio message with the command.
> To use the `!sticker` command, either reply to an image with the command or send an image with the command.

## Installation
To get started with WhatsApp Bot Gege, follow these steps:

1. Clone this project:
```bash
git clone https://github.com/agungjsp/wa-bot-gege.git
```
2. Install the necessary dependencies:
```bash
npm install
```
3. Copy the `.env.example` file to `.env` and fill in your details.
4. Start the bot:
```bash
npm run start
````

## Usage
After running `npm start`, the bot will generate a QR code. Scan this QR code with your device in the WhatsApp app to link the bot to your account. Once linked, you can start chatting with the bot using the supported commands.

## Contributing
We welcome contributions to WhatsApp Bot Gege! Whether it's adding new features, fixing bugs, or improving documentation, your help is appreciated. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Commit your changes.
4. Push to your branch.
5. Submit a pull request.

Please ensure your code adheres to the project's coding standards and include any relevant tests.

## License
WhatsApp Bot Gege is licensed under the Apache-2.0 License. See the LICENSE file for more details.

## Acknowledgments
A big thank you to everyone who has contributed to the development and improvement of WhatsApp Bot Gege!

---

> [!NOTE]
> WhatsApp Bot Gege is not affiliated with WhatsApp Inc. or any of its subsidiaries. This project is a community-driven effort and is intended for educational and entertainment purposes only.