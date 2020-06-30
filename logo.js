const channels = require('./src/m3u8.json')
const fs = require('fs')

const channelsWithLogo = []

const LogoPath = {
    "Star Plus": "StarPlus.jpeg",
    "Newsmax": "NewsMax.jpeg",
    "Republic Bharat": "republic.png",
    "DD National": "DDNational.jpeg",
    "DD Sports": "DDSports.png",
    "B4U Kadak": "B4UKadak.jpeg"
}

const BASE_URL = "https://raw.githubusercontent.com/SauravKanchan/iptv/master/logo/"
channels.forEach(d => { 
    if (Object.keys(LogoPath).includes(d.title? d.title: "")) { 
        d.tvgLogo = BASE_URL+LogoPath[d.title]
    }
    channelsWithLogo.push(d)
})

fs.writeFileSync("src/m3u8.json", JSON.stringify(channelsWithLogo))