import axios from "axios";

function generateUUID() {
    let uuid = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function(c) {
      let r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return uuid;
  }

const speechApi = (ssml) => {
    var data = JSON.stringify({
        ssml,
        ttsAudioFormat: "audio-24khz-160kbitrate-mono-mp3",
        offsetInPlainText: 0,
        properties: {
            SpeakTriggerSource: "AccTuningPagePlayButton",
        },
    });

    var config = {
        method: "post",
        url: "https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak",
        responseType: "arraybuffer",
        headers: {
            authority: "southeastasia.api.speech.microsoft.com",
            accept: "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            customvoiceconnectionid: generateUUID(),
            origin: "https://speech.microsoft.com",
            "sec-ch-ua":
                '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
            "content-type": "application/json",
        },

        data: data,
    };
    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    });
};



export default speechApi;

