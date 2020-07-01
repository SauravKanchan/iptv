const axios = require('axios');
const m3u8Parser = require('m3u8-file-parser');
const fs = require('fs');
const LogoPath = require('./LogoPath.json');

const TIMEOUT = 200000;

const api = new axios.create({
	timeout: TIMEOUT
});

function inUrl(url, arr) {
	for (let i = 0; i < arr.length; i++) {
		if (url.includes(arr[i])) {
			return true;
		}
	}
	return false;
}

let channels_raw = new Set();

let count = 0;

const BASE_URL = 'https://raw.githubusercontent.com/SauravKanchan/iptv/master/logo/';

let m3u8_urls = new Set();

function updateLink() {
	fs.writeFileSync('src/m3u8.json', JSON.stringify([ ...channels_raw ], null, 4));
}

async function addChannel(channel) {
	if (inUrl(channel.url, [ '210.210.155.66', '.ts' ]) || m3u8_urls.has(channel.url)) {
		console.log('skipped', channel.url);
		count++;
		return;
	}

	if (Object.keys(LogoPath).includes(channel.title ? channel.title : '')) {
		channel.tvgLogo = BASE_URL + LogoPath[channel.title];
		console.log('Add local logo to ', channel.title);
	}

	let res = {};
	try {
		res = await api.get(channel.url);
	} catch (e) {
		console.log('Error loading: ', channel.url);
		res = { status: 403 };
	}
	if (res.status === 200) {
		channels_raw.add({ ...channel });
	}
	m3u8_urls.add(channel.url);
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

	reader.read((await api.get('https://iptv-org.github.io/iptv/countries/in.m3u')).data);

	let parsed = reader.getResult().segments;

	parsed.forEach(async (d, index) => {
		if (d.url.includes('https://raw.githubusercontent.com')) {
			let res = await api.get(d.url);
			let parser = new m3u8Parser();
			parser.read(res.data);

			parser.getResult().segments.forEach(async (child) => {
				let temp = { ...d.inf };
				temp.url = child.url;
				await addChannel(temp);
				console.log('Parent:  ', d.url, 'Child: ', child.url);
			});
		} else {
			let temp = { ...d.inf };
			temp.url = d.url;
			temp.tvgLogo = temp.tvgLogo ? temp.tvgLogo : temp.logo ? temp.logo : '';
			await addChannel(temp);
		}
		updateLink();
		count++;
		console.log(`Completed/Total: ${count}/${parsed.length}. Valid: ${channels_raw.size}`);
	});
})();
