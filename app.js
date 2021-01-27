const { Sonos } = require('sonos')
const path = require('path')
const tts = require('./tts')
const WebSocket = require('ws')

const verbose = process.env.VERBOSE || false

const deHost = process.env.DECONZ_WS_HOST || '192.168.1.50'
const dePort = process.env.DECONZ_WS_PORT || 443
const switch_id = process.env.DECONZ_SWITCH_ID || 6 // SYMFONISK

const zpHost = process.env.ZP_HOST || '192.168.1.3'
const zpVolFactor = process.env.ZP_VOLFACTOR || 150 // factor used to convert from millis => volume adjustment delta

const ttsHost = process.env.TTS_HOST || '192.168.1.50'
const ttsPort = process.env.TTS_PORT || 8080
const apiKey = process.env.GCP_KEY
const ttsDataDir = process.env.TTS_DATA_DIR || '/tmp/tts/'

const ttsClient = new tts.TTS(apiKey, ttsDataDir, ttsPort, ttsHost)

var tsClockwiseStart = 0
var tsCounterClockwiseStart = 0

// init sonos player
const player = new Sonos(zpHost);

const dialogStateFavorites = 10
const dialogStateNone = 0
var dialogState = dialogStateNone

var favorites;
var current_favorite;

player.getFavorites().then(response => {
    console.log('Got current favorites %j', response)
    favorites = response.items
    // asynchronously generate tts mp3's
    response.items.forEach(i => {
        const text = i.title
        const filename = i['id'].replace(path.sep, '_') + '.mp3'
        ttsClient.ttsToMp3(text, path.join(ttsDataDir, filename), apiKey)
    });
}).then(() => {
    // starting webserver for TTS audio files
    ttsClient.startTTSServer()
    console.log('Http server for voice samples started...')

    // init listening to deconz
    const ws = new WebSocket('ws://' + deHost + ':' + dePort)
    ws.onmessage = handleButtonEvt
    console.log('Started listening for Zigbee events...')
}).catch(err => { console.log('Error occurred %j', err) })

// IKEA-SYMFONISK-REMOTE https://dresden-elektronik.github.io/deconz-rest-doc/endpoints/sensors/button_events/#ikea-symfonisk-remote
function handleButtonEvt(msg) {
    try {
        var evt = JSON.parse(msg.data)
    }
    catch (e) {
        console.error("Cannot parse because data is not is proper json format.")
        return
    }

    if (evt && evt.e == 'changed') {
        if (verbose == 'true') {
            console.log(evt)
        }
        else
            if (evt.id == switch_id && 'state' in evt && 'buttonevent' in evt.state) {
                try {
                    switch (evt.state.buttonevent) {
                        case 1002:
                            switch (dialogState) {
                                case dialogStateFavorites:
                                    console.log("Dialog 'Sonos favorites' ended")
                                    dialogState = dialogStateNone
                                    break
                                default:
                                    console.log("Toggle playback")
                                    player.togglePlayback()
                            }
                            break
                        case 1004:
                            console.log("Next title in queue")
                            player.next()
                            break
                        case 1005:
                            console.log("Dialog 'Sonos favorites' started")
                            dialogState = dialogStateFavorites
                            current_favorite = 0 // always start with favorite at idx 0
                            player.stop()
                            break
                        case 2001:
                            tsClockwiseStart = Date.now()
                            break
                        case 2003:
                            switch (dialogState) {
                                case dialogStateFavorites:
                                    console.log('nextFav');
                                    current_favorite = (current_favorite + 1) % favorites.length;
                                    // player.setAVTransportURI(`http://${ttsHost}:${ttsPort}/` + '2_29.mp3')
                                    const filename = favorites[current_favorite]['id'].replace(path.sep, '_') + '.mp3'
                                    console.log(filename)
                                    player.setAVTransportURI(`http://192.168.1.50:${ttsPort}/` + filename)
                                    break
                                default:
                                    duration = Date.now() - tsClockwiseStart
                                    console.log("volume ∂: %d", duration / zpVolFactor)
                                    player.adjustVolume(duration / zpVolFactor)
                                    player.getVolume().then((vol) => console.log("Volume: %d", vol))
                            }
                            break
                        case 3001:
                            tsCounterClockwiseStart = Date.now()
                            break
                        case 3003:
                            switch (dialogState) {
                                case dialogStateFavorites:
                                    console.log('prevFav')
                                    if (current_favorite == 0) current_favorite = favorites.length;
                                    current_favorite--;
                                    const filename = favorites[current_favorite]['id'].replace(path.sep, '_') + '.mp3'
                                    console.log(filename)
                                    player.setAVTransportURI(`http://192.168.1.50:${ttsPort}/` + filename)
                                    break
                                default:
                                    duration = Date.now() - tsCounterClockwiseStart
                                    console.log("volume ∂: %d", -1 * duration / zpVolFactor)
                                    player.adjustVolume(-1 * duration / zpVolFactor)
                                    player.getVolume().then((vol) => console.log("Volume: %d", vol))
                            }
                            break
                    }
                }
                catch (e) {
                    console.error("Error occured evaluating button event.")
                    console.error(e)
                    console.error(evt)
                    return
                }
            }
    }
}
