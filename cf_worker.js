addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  
  function generateUUID() {
    let uuid = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return uuid;
  }
  
  const API_URL = "https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak";
  const DEFAULT_HEADERS = {
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
  };
  
  const speechApi = async (ssml) => {
    const data = JSON.stringify({
        ssml,
        ttsAudioFormat: "audio-24khz-160kbitrate-mono-mp3",
        offsetInPlainText: 0,
        properties: {
            SpeakTriggerSource: "AccTuningPagePlayButton",
        },
    });
  
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            responseType: "arraybuffer",
            headers: DEFAULT_HEADERS,
            body: data
        });
  
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
  
        return response.arrayBuffer();
    } catch (error) {
        console.error("Error during API request:", error);
        throw error;
    }
  };
  
  const handleRequest = async (request) => {
    // 解析请求 URL
    const url = new URL(request.url);
  
    const clientIP = request.headers.get("CF-Connecting-IP")
  
    if (url.pathname == "/") {
      const html = await fetch("https://raw.githubusercontent.com/x-dr/cf_pages/main/tts.html")
  
      const page =await html.text()    
        return new Response(page, {
            headers: {
                "content-type": "text/html;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "ip": `Access cloudflare's ip:${clientIP}`
            },
        })
    } else if (url.pathname == "/audio") {
        // 解析查询参数
        const params = new URLSearchParams(url.search);
        // 获取查询参数中的文本
        const text = params.get("text");
        // 获取查询参数中的语速
        const rate = params.get("rate");
        // 获取查询参数中的音高
        const pitch = params.get("pitch");
        // 获取查询参数中的音色
        const voice = params.get("voice");
        // 获取查询参数中的音色风格
        const voiceStyle = params.get("voiceStyle");
        const ssml = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
    <voice name="${voice}">
    <mstts:express-as style="${voiceStyle}">
        <prosody rate="${rate}%" pitch="${pitch}%">
        ${text}
       </prosody>
        </mstts:express-as>
    </voice>
    </speak>`;
  
        const audio = await speechApi(ssml);
        const nowtime = new Date().getTime();
        return new Response(audio, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Disposition": `attachment; filename=${nowtime}.mp3`,
            },
        });
    }else{
      return new Response("page", {
        headers: {
            "content-type": "text/html;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "ip": `Access cloudflare's ip:${clientIP}`
        },
    })
    }
  
  }