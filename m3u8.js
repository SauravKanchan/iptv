const axios = require('axios');
const m3u8Parser = require('m3u8-file-parser');
const fs = require('fs');

const TIMEOUT = 200000;

const api = new axios.create({
	timeout: TIMEOUT
});

function inUrl(url, arr) {
	for (let i = 0; i < arr.length; i++) {
		if (url.includes(arr[i])) { 
			return true
		}	
	}
	return false
}

(async () => {
	let res = await api.get('https://raw.githubusercontent.com/billacablewala/m3u8/master/README.md');
	let reader = new m3u8Parser();
	let urls = res.data
		.replace(/= "/g, '="')
		.replace(/EXTINF:0,/g, 'EXTINF:0 ')
		.replace(/EXTINF:-1,/g, 'EXTINF:-1 ')
		.replace(/ttvg-logo/g, 'tvg-logo')
		.replace(/tvg-logo"" ,/g, 'tvg-logo"" ')
		.replace(/"MOVIES,/g, 'MOVIES"')
		.replace(/"HINDI""/g, '"HINDI"')
		.replace(/.jpg /g, '.jpg" ')
		.replace(/.png"" /g, '.png" ')
		.replace(/tvg-logo="src=/g, 'tvg-logo=')
		.split('#EXTINF:');

	urls.forEach((url, i) => {
		try {
			if (i === 0) {
				reader.read(url);
			} else {
				reader.read('#EXTINF:' + url);
			}
		} catch (error) {
			console.log('Error in parsing: ', '#EXTINF:' + url);
		}
	});

	reader.read((await api.get("https://iptv-org.github.io/iptv/countries/in.m3u")).data);

	let parsed = reader.getResult().segments;

	let channels_raw = new Set();

	let count = 0;

	let m3u8_urls = new Set()

	parsed.forEach(async (d, index) => {
		if (inUrl(d.url, ['210.210.155.66','.ts']) || m3u8_urls.has(d.url)) {
			console.log('skipped', d.url);
			count++;
			return;
		}
		m3u8_urls.add(d.urls);
		try {
			let res = await api.get(d.url);
			count++;
			if (res.status === 200) {
				let temp = { ...d.inf };
				temp.url = d.url;
				temp.tvgLogo = temp.tvgLogo? temp.tvgLogo: temp.logo? temp.logo : ""
				channels_raw.add(temp);
			}
			if (index % 10 === 0 || count > 500) {
				fs.writeFileSync('src/m3u8.json', JSON.stringify([...channels_raw]));
			}
		} catch (e) {
			count++;
		}
		console.log(

			`Completed/Total: ${count}/${parsed.length}. Valid: ${channels_raw.size}`
		);
	});

	fs.writeFileSync('src/m3u8.json', JSON.stringify([...channels_raw]));
})();
