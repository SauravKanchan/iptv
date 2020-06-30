const channels = require('./src/m3u8.json');
const axios = require('axios');
const fs = require('fs');

const api = new axios.create({
	timeout: 1000
});

let count = 0;

let images = [];
channels.forEach(async (d) => {
	if (d.tvgLogo) {
		try {
			let res = await api.get(d.tvgLogo);
			count++;
			if (res.status !== 200) {
				images.push(d.title);
			}
        } catch (e) {
            count++;
			images.push(d.title);
		}
	} else {
		count++;
		images.push(d.title);
	}
	console.log(`Completed ${count} out of ${channels.length}`);
});

fs.writeFileSync('invalidImages.json', JSON.stringify(images));