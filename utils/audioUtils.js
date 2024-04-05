import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

// Convert OGG to WAV using fluent-ffmpeg
export function convertOggToWav(oggPath, wavPath) {
    console.log('Converting OGG to WAV');
    return new Promise((resolve, reject) => {
        ffmpeg(oggPath)
            .toFormat('wav')
            .audioFrequency(16000) // 16kHz
            .outputOptions('-acodec pcm_s16le') // signed 16-bit PCM
            .output(wavPath)
            .on('end', () => {
                try {
                    fs.unlinkSync(oggPath); // Delete the original OGG file
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', reject)
            .run();
    });
}
