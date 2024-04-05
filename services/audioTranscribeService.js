import { createClient } from '@deepgram/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { convertOggToWav } from '../utils/audioUtils.js';
dotenv.config();

export async function getAudioTranscribeService(media, message) {
    console.log('Starting audio transcription process');
    const { data } = media;
    const tempdir = os.tmpdir();
    const filename = message.id.id;
    const oggPath = path.join(tempdir, `${filename}.ogg`);
    const wavPath = path.join(tempdir, `${filename}.wav`);

    fs.writeFileSync(oggPath, Buffer.from(data, 'base64'));
    await convertOggToWav(oggPath, wavPath);
    try {
        return await transcribeFile(wavPath);
    } catch (error) {
        console.error(error);
        throw new Error('Error transcribing audio');
    }
}

async function transcribeFile(wavPath) {
    console.log('Transcribing audio with Deepgram');
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
    try {
        const fileBuffer = await fs.promises.readFile(wavPath);
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(fileBuffer, {
            model: 'nova-2',
            language: 'id',
            smart_format: true,
        });

        if (error) {
            console.error('Error during transcription - 1:', error);
            throw new Error('Error transcribing audio - Error 001');
        }

        // Write a transcript to file and the path should in this project root
        // const __dirname = path.resolve();
        // const transcriptPath = path.join(__dirname, '..', 'transcript.txt');
        // await fs.promises.writeFile(transcriptPath, result);
        console.dir(result, { depth: null });
        return result.results.channels[0].alternatives[0].transcript;
    } catch (error) {
        console.error('Error processing transcription - 2:', error);
        throw new Error('Error transcribing audio - Error 002');
    } finally {
        try {
            await fs.promises.unlink(wavPath);
        } catch (error) {
            console.error('Error deleting WAV file:', error);
        }
    }
}
