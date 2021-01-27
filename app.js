const WebSocket = require('ws')
const { Sonos } = require('sonos')
const static = require('node-static');

const verbose = process.env.VERBOSE || false

const deHost = process.env.DECONZ_WS_HOST || '192.168.1.50'
const dePort = process.env.DECONZ_WS_PORT || 443
const switch_id = process.env.DECONZ_SWITCH_ID || 6 // SYMFONISK

const zpHost = process.env.ZP_HOST || '192.168.1.3'
const zpVolFactor = process.env.ZP_VOLFACTOR || 150 // factor used to convert from millis => volume adjustment delta

var tsClockwiseStart = 0
var tsCounterClockwiseStart = 0

// init sonos player
const player = new Sonos(zpHost);

// init listening to deconz
const ws = new WebSocket('ws://' + deHost + ':' + dePort)

// starting webserver for TTS audio files
new static.Server('./static');
// new static.Server('./satic', { cache: 3600 });

console.log('Start listening...')

player.getFavorites().then(favorites => {
    console.log('Got current favorites %j', favorites)
}).catch(err => { console.log('Error occurred %j', err) })


// IKEA-SYMFONISK-REMOTE https://dresden-elektronik.github.io/deconz-rest-doc/endpoints/sensors/button_events/#ikea-symfonisk-remote
ws.onmessage = (msg) => {
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
            if (evt.id == switch_id) {
                try {
                    switch (evt.state.buttonevent) {
                        case 1002:
                            console.log("Toggle playback")
                            player.togglePlayback()
                            break
                        case 1004:
                            console.log("Next title in queue")
                            player.next()
                            break
                        case 1005:
                            console.log("Previous title in queue")
                            player.previous()
                            break
                        case 2001:
                            tsClockwiseStart = Date.now()
                            break
                        case 2003:
                            duration = Date.now() - tsClockwiseStart
                            console.log("volume ∂: %d", duration / zpVolFactor)
                            player.adjustVolume(duration / zpVolFactor)
                            player.getVolume().then((vol) => console.log("Volume: %d", vol))
                            break
                        case 3001:
                            tsCounterClockwiseStart = Date.now()
                            break
                        case 3003:
                            duration = Date.now() - tsCounterClockwiseStart
                            console.log("volume ∂: %d", -1 * duration / zpVolFactor)
                            player.adjustVolume(-1 * duration / zpVolFactor)
                            player.getVolume().then((vol) => console.log("Volume: %d", vol))
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
