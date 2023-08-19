// const express = require("express");
import Express from "express";
const app = Express();

import speechApi from "./api/tts.js" // 导入 speechApi 函数
import path from 'path';
const __dirname = path.resolve();

app.set('x-powered-by', false)
app.use(Express.json())
app.use(Express.urlencoded({ extended: false }))
app.use(Express.static(__dirname+'/public'));

app.get("/audio", async (req, res) => {
    try {

        const { voice, rate, pitch, text,voiceStyle } = req.query;
        const ssml = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
        <voice name="${voice}">
        <mstts:express-as style="${voiceStyle}">
            <prosody rate="${rate}%" pitch="${pitch}%">
            ${text}
           </prosody>
            </mstts:express-as>
        </voice>
        </speak>`;

        // 调用 speechApi 函数，获取音频数据
        const audioData = await speechApi(ssml);
        const nowtime = new Date().getTime();
        // 设置响应头为 audio/mp3
        res.set("Content-Type", "audio/mpeg");
        res.set("Content-Disposition", `attachment; filename=${nowtime}.mp3`);

        // 将音频数据发送给客户端
        res.send(audioData);
    } catch (error) {
        console.error("Failed to generate audio:",error.message);
        const errorJson = {
            error: error.message,
        };
        res.status(500).json(errorJson);
    }
});



// 启动服务器，监听在指定端口上
const port = process.env.PORT || 3035;
app.listen(port, () => {
    console.log('Start service success! listening port: http://127.0.0.1:' + port);
});
