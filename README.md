# Open TV

This projects gathers data from [iptv-org](https://github.com/iptv-org/iptv) and [billacablewala](https://github.com/billacablewala/m3u8).

This project loops through all the links and check if it is working or not. Only valid links are entered into [m3u8.json](https://github.com/SauravKanchan/iptv/blob/master/src/m3u8.json)

If user are using a phone, Stream will open in a new tab otherwise it will be played in site's player
### Run project locally
```shell script
git clone https://github.com/SauravKanchan/iptv.git
cd iptv
yarn install
yarn start
```

### Contributing
If you want to add more source then make changes in [m3u8.js](https://github.com/SauravKanchan/iptv/blob/master/m3u8.js) don't make any changes in [src/m3u8.json](https://github.com/SauravKanchan/iptv/blob/master/src/m3u8.json) as it generated from m3u8.js

> Note: We do not host any content ourselves
