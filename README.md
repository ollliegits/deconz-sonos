# deconz-sonos
Control your Sonos via Zigbee using your [Phoscon](https://phoscon.de/) gateway.

## Requirements
Deconz-sonos is a Node.js app. In order to use it, you are required to have a Node.js server running at all times in your home Wifi network. 
Most likely you have built your Phoscon gateway (aka deCONZ gateway) yourself using a Raspberry Pi. The best option is to also install the Node.js on this Raspberry, along with the deCONZ software.

## Installation

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
Finally install deconz-sonos from this Github repo using npm:

    npm install ollliegits/deconz-sonos

## Configuration

## Usage
