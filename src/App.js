/* eslint react/prop-types: 0 */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import brokenImg from './img/brokenimage.png';
import fuzzysort from 'fuzzysort';
import ReactPlayer from 'react-player';
import urls from './m3u8.json';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function App() {
	const [ channels, setChannels ] = useState([]);
	const [ url, setUrl ] = useState(null);
	const [ selectedChannel, setSelectedChannel ] = useState();

	const ChannelImage = ({ channel }) => {
		const [ source, setSource ] = useState(channel.tvgLogo);
		return (
			<LazyLoadImage
				className="object-contain w-32 h-32 m-2 rounded shadow"
				src={source}
				alt="channel-logo"
				onClick={() => openUrl(channel)}
				onError={() => setSource(brokenImg)}
			/>
		);
	};

	async function openUrl(channel) {
		let url = channel.url
		let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		if (!isMobile) {
			setUrl(url);
			setSelectedChannel(channel);
			window.scrollTo(0, 0);
			try {
				await axios.get(url);
			} catch (e) {
				setUrl();
				alert('Falied to load channel');
			}
		} else {
			window.open(url, '_blank');
		}
	}

	async function search(event) {
		let filtered_channels = [];
		if (event.target.value) {
			let result = await fuzzysort.goAsync(event.target.value, urls, {
				limit: 15,
				key: 'title',
				allowTypo: false
			});
			result.forEach((d) => {
				filtered_channels.push(d.obj);
			});
		} else {
			filtered_channels = urls;
		}
		setChannels(filtered_channels);
	}

	useEffect(() => {
		const fetchChannels = async () => {
			setChannels(urls);
		};
		try {
			fetchChannels();
		} catch (error) {
			console.log('Error in fetching channels');
		}
	}, []);

	return (
		<div className="max-w-6xl mx-auto ">
			<div className="flex justify-between py-8">
				<header className="sticky top-0 px-4 text-2xl font-bold">OPEN TV</header>
				<input
					type="text"
					alt="search"
					className="px-4 bg-gray-100 border rounded-full"
					placeholder="Search for a channel"
					onChange={search}
				/>
			</div>
			{url && (
				<div className="flex justify-between mx-2 my-8 bg-gray-100">
					<div className="flex flex-col justify-center">
						<h1 className="hidden px-4 py-8 text-4xl font-bold md:block">{selectedChannel.title}</h1>
						<img src={selectedChannel.tvgLogo} alt="" className="block w-20 h-20 px-4 bg-gray-800 rounded" />
					</div>
					<ReactPlayer playing controls url={url} />{' '}
				</div>
			)}
			{/* <h1 className="px-2 text-2xl">{searchText ? 'All Channels' : `Showing Results for ${searchText}`}</h1> */}
			<div className="grid grid-cols-4 md:grid-cols-8">
				{channels &&
					channels.map((channel) => {
						return (
							<div key={JSON.stringify(channel)}>
								{[
									<ChannelImage channel={channel} key={1} />,
									<p className="p-2" key={2}>
										{channel.title}
									</p>
								]}
							</div>
						);
					})}
			</div>
		</div>
	);
}

export default App;
