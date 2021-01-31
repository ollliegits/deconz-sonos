# deconz-sonos
Control your Sonos via Zigbee using your [Phoscon](https://phoscon.de/) gateway.

## Requirements
Deconz-sonos is a Node.js app. In order to use it, you are required to have a Node.js server running at all times in your home Wifi network.
Most likely you have built your Phoscon gateway (aka deCONZ gateway) yourself using a Raspberry Pi. The best option is to also install the Node.js on this Raspberry, along with the deCONZ software.

## Installation

### Node.js
First, check if nodejs is installed by typing `which node`.

```sh
pi@phoscon:~ $ which node
/usr/local/bin/node
```

In case no result is displayed, install Node.js using `apt-get`:

```sh
sudo apt-get install nodejs
```

Using a **Raspberry Pi Zero** or **Raspberry Pi 1**? For the older `ARMv6` CPU architecture of these models, the official support for Node.js ended with version v10.21.0.
You can install an unofficial release from nodejs.org using [this script](https://github.com/ollliegits/nodejs-linux-installer).

### Node-Sonos Library
Install the [node-sonos](https://github.com/bencevans/node-sonos) library from github.com/bencevans using npm.

    npm install sonos

For other installation options consult the [official page](https://github.com/bencevans/node-sonos#install).

### DeCONZ-Sonos App
Finally install deconz-sonos from this Github repo using npm:

```sh
# install from master
npm install ollliegits/deconz-sonos

# install from branch
npm install 'ollliegits/deconz-sonos#feat/favorites-selection-with-tts'
```

Now that all prerequisits are installed, deconz-sonos can be setup to run as a systemd service.

Use the file `deconz-sonos.service` as template, adapt to your needs, and save in directory `/lib/systemd/system/deconz-sonos.service`.

Now your deconz-sonos is ready to run as a systemd service:

```sh
# start at boot
sudo systemctl enable deconz-sonos

# start|stop|restart manually
sudo service deconz-sonos start

# view logs of this systemd unit
journalctl -u deconz-sonos.service

# view logs of this systemd unit in follow-mode
journalctl -uf deconz-sonos.service
```

## Configuration & Usage

TODO: