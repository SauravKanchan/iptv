const channels = require('./src/m3u8.json')
const fs = require('fs')
const LogoPath = require('./LogoPath.json');

const channelsWithLogo = []


const BASE_URL = "https://raw.githubusercontent.com/SauravKanchan/iptv/master/logo/"
channels.forEach(d => {
    d.title =d.title? d.title.replace('CNBC ?????', 'CNBC Awaaz'):"";
    if (Object.keys(LogoPath).includes(d.title? d.title: "")) { 
        d.tvgLogo = BASE_URL+LogoPath[d.title]
    }
    channelsWithLogo.push(d)
})

fs.writeFileSync("src/m3u8.json", JSON.stringify(channelsWithLogo, null, 4))