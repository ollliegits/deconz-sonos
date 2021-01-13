const { Sonos } = require('sonos')

const zpHost = process.env.ZP_HOST || '192.168.1.3'

var playerState

const player = new Sonos(zpHost);
// player.play()
//     .then(() => console.log('now playing'))

player.getVolume()
    .then((volume) => console.log(`current volume = ${volume}`))
