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

### For Developers

If you want all the sources then you can make a GET request to:
```html
https://raw.githubusercontent.com/SauravKanchan/iptv/master/src/m3u8.json
```

Respose:

```
[   
        ...
	{
		"duration": -1,
		"title": "FASTWAY NEWS",
		"tvgLogo": "https://pbs.twimg.com/profile_images/637936076590440448/mmN3Fnsa_400x400.jpg",
		"groupTitle": "PUNJABI",
		"url": "http://163.47.214.155:1935/fwnews/live/chunklist_w1742074574.m3u8"
	},
	{
		"duration": -1,
		"title": "B4U Movies ((New!)",
		"tvgLogo": "https://www.the-ba-group.com/wp-content/uploads/2018/03/b4u-movies-logo.png",
		"groupTitle": "HINDI",
		"url": "http://103.199.161.254/Content/b4umovies/Live/Channel(B4UMovies)/index.m3u8"
	},
	{
		"duration": -1,
		"title": "Puthuyugam TV",
		"tvgId": "",
		"tvgName": "",
		"tvgLanguage": "Hindi",
		"tvgLogo": "https://raw.githubusercontent.com/SauravKanchan/iptv/master/logo/puthuyugamTV.png",
		"tvgCountry": "IN",
		"tvgUrl": "",
		"groupTitle": "",
		"url": "http://103.199.160.85/Content/puthuyugam/Live/Channel(Puthuyugam)/index.m3u8"
	},
	{
		"duration": -1,
		"title": "Mastiii",
		"tvgId": "",
		"tvgName": "",
		"tvgLanguage": "Hindi",
		"tvgLogo": "https://raw.githubusercontent.com/SauravKanchan/iptv/master/logo/masti.jpeg",
		"tvgCountry": "IN",
		"tvgUrl": "",
		"groupTitle": "Music",
		"url": "http://103.199.160.85/Content/masthi/Live/Channel(Masthi)/index.m3u8"
	},
	{
		"duration": -1,
		"title": "B4U Kadak (New!)",
		"tvgLogo": "https://i.imgur.com/Qwj4DnA.png",
		"groupTitle": "HINDI",
		"url": "http://103.199.160.85/Content/moviehouse/Live/Channel(MovieHouse)/index.m3u8"
	}
        ...
]
```

### Contributing
If you want to add more source then make changes in [m3u8.js](https://github.com/SauravKanchan/iptv/blob/master/m3u8.js) don't make any changes in [src/m3u8.json](https://github.com/SauravKanchan/iptv/blob/master/src/m3u8.json) as it generated from m3u8.js

> Note: We do not host any content ourselves
