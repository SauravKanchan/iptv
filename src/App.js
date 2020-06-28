/* eslint react/prop-types: 0 */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import m3u8Parser from 'm3u8-file-parser'
import './App.css'
import brokenImg from './img/brokenimage.png'
import fuzzysort from 'fuzzysort';
import ReactPlayer from "react-player";


let channels_raw = [];


function App() {

  const [channels, setChannels] = useState([]);
  const [url, setUrl] = useState();


  const ChannelImage = ({ channel }) => {
    const [source, setSource] = useState(channel.tvgLogo);
    return (
      <img
        className="h-32 m-2 rounded shadow max-w-32"
        src={source}
        alt="channel-logo"
        onClick={() => setUrl(channel.url)}
        onError={() => setSource(brokenImg)}
      />
    );
  };



  async function search(event) {
    let filtered_channels = [];
    let result = await fuzzysort.goAsync(event.target.value, channels_raw, {
      limit: 15,
      key: "title",
      allowTypo: false,
    });
    result.forEach((d) => {
      filtered_channels.push(d.obj);
    });
    setChannels(filtered_channels);
  }

  
  useEffect(() => {
    const fetchChannels = async () => {
      let res = await axios.get('https://raw.githubusercontent.com/billacablewala/m3u8/master/README.md')
      let reader = new m3u8Parser()
      let urls = res.data
        .replace(/= "/g, '="')
        .replace(/EXTINF:0,/g, 'EXTINF:0 ')
        .replace(/EXTINF:-1,/g, 'EXTINF:-1 ')
        .replace(/ttvg-logo/g, 'tvg-logo')
        .replace(/tvg-logo"" ,/g, 'tvg-logo"" ')
        .split('#EXTINF:')

      urls.forEach((url, i) => {
        try {
          if (i === 0) {
            reader.read(url)
          } else {
            reader.read('#EXTINF:' + url)
          }
        } catch (error) {
          console.log('Error in reading url')
        }
      })
      let parsed = reader.getResult().segments
      
      parsed.forEach((d) => {
          let temp = { ...d.inf }
          temp.url = d.url
          channels_raw.push(temp);
      })

    
      setChannels(channels_raw);

      
    };
    try {
      fetchChannels()
    } catch (error) {
      console.log('Error in fetching channels')
    }
  }, [])
  return (
    <div className="max-w-6xl mx-auto ">
      <div className="flex justify-between py-8">
        <header className="px-4 text-2xl font-bold">IPTV</header>
        <input
          type="text"
          alt="search"
          className="px-4 bg-gray-100 border rounded-full"
          placeholder="Search for a channel"
          onChange={search}
        />
      </div>
      {url && <ReactPlayer playing controls url={url} />}
      <div className="flex flex-wrap justify-between">
        {channels &&
          channels.map((channel) => {
            return (
              <div key={JSON.stringify(channel)}>
                {[
                  <ChannelImage channel={channel} key={1} />,
                  <p className="px-4p-4" key={2}>
                    {channel.title}
                  </p>,
                ]}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App
