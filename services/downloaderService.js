import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import os from 'os';
import path from 'path';
import randomUseragent from 'random-useragent';
import { pipeline } from 'stream/promises';

import dotenv from 'dotenv';
dotenv.config();

const headers = new Headers();
headers.set('User-Agent', randomUseragent.getRandom());

async function getRedirectUrl(url) {
    if (url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com')) {
        try {
            url = await fetch(url, { redirect: 'follow', follow: 10 });
            url = url.url;
            console.log('🚀 ~ getRedirectUrl ~ url:', url);
        } catch (error) {
            console.log('Error getting redirect URL:', error);
            throw new Error('Failed to get redirect URL.');
        }
    }
    return url;
}

async function getIdVideo(url) {
    console.log('Getting video ID:', url);
    if (url.includes('/t/'))
        url = await new Promise((resolve) => {
            require('follow-redirects').https.get(url, (res) => {
                return resolve(res.responseUrl);
            });
        });

    const matching = url.match(/\/video\/(\d+)/); // https://www.tiktok.com/@therock/video/6803110862406741253
    const matchingPhoto = url.match(/\/photo\/(\d+)/); // https://www.tiktok.com/@therock/photo/6803110862406741253

    let idVideo = url.substring(url.indexOf('/video/') + 7, url.indexOf('/video/') + 26);
    if (matchingPhoto) idVideo = url.substring(url.indexOf('/photo/') + 7, url.indexOf('/photo/') + 26);
    else if (!matching) {
        return false; // URL not found
    }

    console.log('Found video ID:', idVideo);
    return idVideo.length > 19 ? idVideo.substring(0, idVideo.indexOf('?')) : idVideo;
}

export async function getVideoTikTok(url, watermark) {
    const newUrl = await getRedirectUrl(url);
    const idVideo = await getIdVideo(newUrl);
    if (!idVideo) throw new Error('Failed to get video ID.');

    const API_URL = process.env.TIKTOK_API_URL.replace('{idVideo}', idVideo);
    const request = await fetch(API_URL, {
        method: 'GET',
        headers: headers,
    });
    const body = await request.text();
    try {
        const res = JSON.parse(body);

        if (res.aweme_list[0].aweme_id !== idVideo) return false;

        let urlMedia = '';
        let image_urls = '';

        if (!!res.aweme_list[0].image_post_info) {
            console.log('Video is slideshow');

            res.aweme_list[0].image_post_info.images.forEach((image) => {
                image_urls.push(image.display_image.url_list[1]);
            });
        } else {
            urlMedia = watermark
                ? res.aweme_list[0].video.download_addr.url_list[0]
                : res.aweme_list[0].video.play_addr.url_list[0];
        }
        const data = {
            detail: {
                creator: res.aweme_list[0].author.nickname,
                createdAt: new Date(res.aweme_list[0].create_time * 1000).toDateString(),
                download: convertNumber(res.aweme_list[0].statistics.download_count),
                like: convertNumber(res.aweme_list[0].statistics.digg_count),
                share: convertNumber(res.aweme_list[0].statistics.share_count),
                comment: convertNumber(res.aweme_list[0].statistics.comment_count),
                play: convertNumber(res.aweme_list[0].statistics.play_count),
                desc: res.aweme_list[0].desc,
            },
            url: urlMedia,
            images: image_urls,
            id: idVideo,
        };

        console.log("Found video's details:", data);

        const tempdir = os.tmpdir();
        const filename = data.id;
        const inputPath = path.join(tempdir, `${filename}-original.mp4`);
        const outputPath = path.join(tempdir, `${filename}-converted.mp4`);

        const response = await fetch(data.url);
        if (!response.ok) {
            throw new Error('Failed to download TikTok video.');
        }

        await pipeline(response.body, fs.createWriteStream(inputPath));

        console.log('FFMPEG codec whatsapp compatible, starting conversion...');
        await convertVideoToCompatible(inputPath, outputPath);

        console.log('Conversion completed successfully!');
        data.inputPath = inputPath;
        data.outputPath = outputPath;
        return data;
    } catch (err) {
        console.error('Error parsing TikTok response:', err);
        throw new Error('Failed to parse TikTok response.');
    }
}

function convertNumber(number) {
    if (number < 1000) return number;
    if (number < 1000000) return (number / 1000).toFixed(1) + 'k'; // 1.1k
    return (number / 1000000).toFixed(1) + 'm'; // 1.1m
}

function convertVideoToCompatible(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .outputOptions([
                '-c:v libx264', // H.264 video codec
                '-c:a aac', // AAC audio codec
                '-vf scale=1280:720', // HD resolution
                '-crf 20', // Lower CRF for better quality
                '-preset medium', // Medium preset for better quality
            ])
            .on('end', () => resolve())
            .on('error', (err) => reject(err))
            .save(outputPath);
    });
}
