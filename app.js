const WebSocket = require('ws')

const host = process.env.DECONZ_WS_HOST || '192.168.1.50'
const port = process.env.DECONZ_WS_PORT || 443
const switch_id = process.env.DECONZ_SWITCH_ID || 6 // SYMFONISK

var clockwiseStart = 0
var counterClockwiseStart = 0

const ws = new WebSocket('ws://' + deHost + ':' + dePort)

console.log('Start listening...')

ws.onmessage = handleBridgeEvent
// IKEA-SYMFONISK-REMOTE https://dresden-elektronik.github.io/deconz-rest-doc/endpoints/sensors/button_events/#ikea-symfonisk-remote
function handleBridgeEvent(msg) {
    try {
        var evt = JSON.parse(msg.data)
    }
    catch (e) {
        console.log("Cannot parse because data is not is proper json format.")
        return
    }

    if (evt && evt.e == 'changed' && evt.id == switch_id) {
        try {
            switch (evt.state.buttonevent) {
                case 1002:
                    console.log("Button 1 - Short release")
                    break
                case 1004:
                    console.log("Button 1 - Double press")
                    break
                case 1005:
                    console.log("Button 1 - Triple press")
                    break
                case 2001:
                    // console.log("Rotate clockwise - Hold")
                    clockwiseStart = Date.now()
                    break
                case 2003:
                    // console.log("Rotate clockwise - Long release")
                    duration = Date.now() - clockwiseStart
                    console.log("Rotate clockwise: %d", duration)
                    break
                case 3001:
                    // console.log("Rotate counter clockwise - Hold")
                    counterClockwiseStart = Date.now()
                    break
                case 3003:
                    // console.log("Rotate counter clockwise - Long release")
                    duration = Date.now() - counterClockwiseStart
                    console.log("Rotate counter clockwise: %d", duration)
                    break
                case 2002:
                    console.log("Rotate clockwise - Short release")
                    break
                case 3002:
                    console.log("Rotate counter clockwise - Short release")
                    break
                default:
                    console.log('Unsupported buttonevent %s', evt.state.buttonevent)
            }
        }
        catch (e) {
            console.log("Error occured evaluating button event.")
            console.log(e)
            return
        }
    }
}
