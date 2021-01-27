const https = require('https')
const fs = require('fs');
const util = require('util');

const apiKey = process.env.GCP_KEY

function ttsToMp3(text, outputFile, apiKey) {
    const request = {
        input: { text: text },
        voice: { languageCode: 'de-DE', "name": "de-DE-Wavenet-F" },
        audioConfig: { audioEncoding: 'MP3', "pitch": 0, "speakingRate": 1.150 },
    };
    synthesizeSpeechToMp3(request, apiKey, outputFile)
}

function synthesizeSpeechToMp3(request, apiKey, outputFile) {
    const data = JSON.stringify(request)
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const url = 'https://texttospeech.googleapis.com/v1/text:synthesize?key=' + apiKey

    const req = https.request(url, options, res => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
        let error;
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const response = JSON.parse(rawData);

                // write data to MP3 file
                fs.writeFile(outputFile, response.audioContent, 'base64', (err) => {
                    if (err) throw err;
                    console.log(`Audio content written to file: ${outputFile}`);
                });
            } catch (e) {
                console.error(e.message);
            }
        });
    });

    req.on('error', error => {
        console.error(error)
    })

    req.write(data)
    req.end()
}

// ttsToMp3('Easy listening', 'output.mp3', apiKey)
// ttsToMp3('Guten Morgen Levi, es ist Zeit zum Aufstehen.', 'output-levi.mp3', apiKey)
const txt = '02: Einschlaflieder - Anne Geddes präsentiert Lieblingsmusik für Ihr Baby. Absolut relax (Easy Listening). Bar Lounge. Bella Ciao - HUGEL Remix. ENERGY Digital. French Indie Pop. Lieblingssongs. MDR KULTUR 95.4 (Klassik). Tumult. Weihnachten In Familie. WhoMadeWho Radio.'
ttsToMp3(txt, 'output.mp3', apiKey)
