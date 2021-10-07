# deconz-sonos
Control your Sonos via Zigbee using your [Phoscon](https://phoscon.de/) gateway.

## Requirements
Deconz-sonos is a Node.js app. In order to use it, you are required to have a Node.js server running at all times in your home Wifi network. 
Most likely you have built your Phoscon gateway (aka deCONZ gateway) yourself using a Raspberry Pi. The best option is to also install the Node.js on this Raspberry, along with the deCONZ software.

## Installation

### Git command line tools
First, check if git is installed by typing `which git`.

    pi@phoscon:~ $ which git
    /usr/bin/git


In case no result is displayed, install git using `apt-get`:

    sudo apt-get install git


### Node.js
First, check if nodejs is installed by typing `which node`.

    pi@phoscon:~ $ which node
    /usr/local/bin/node


In case no result is displayed, install Node.js using `apt-get`:

    sudo apt-get install nodejs

Using a **Raspberry Pi Zero** or **Raspberry Pi 1**? For the older `ARMv6` CPU architecture of these models, the official support for Node.js ended with version v10.21.0.
You can install an unofficial release from nodejs.org using [this script](https://github.com/ollliegits/nodejs-linux-installer).

### Node-Sonos Library
Install the great [node-sonos](https://github.com/bencevans/node-sonos) library from github.com/bencevans using npm.

    npm install sonos

For other installation options consult the [official page](https://github.com/bencevans/node-sonos#install).

### DeCONZ-Sonos App
Finally install deconz-sonos from this Github repo using npm: `npm install ollliegits/deconz-sonos`.

Now that all prerequisits are installed, deconz-sonos can be setup to run as a systemd service.

1. Place the file `deconz-sonos.service` under `/lib/systemd/system/`. (`sudo ln -s deconz-sonos.service /lib/systemd/system/deconz-sonos.service`)
1. Start the service: `systemctl start deconz-sonos`
1. Enable auto-start at boot: `systemctl enable deconz-sonos`

### For Google Cloud TTS support

In order for TTS support (from branch `feat/favorites-selection-with-tts`) you must set the environment variable `GCP_KEY` with your personal GCP key.
```
read -s GCP_KEY
```

## Install an update from Git

Run `npm install ollliegits/deconz-sonos#feat/favorites-selection-with-tts` to install latest version from Git.
Restart the deconz-sonos service on the machine: `sudo service deconz-sonos restart`.