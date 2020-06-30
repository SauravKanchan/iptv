/* eslint react/prop-types: 0 */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import brokenImg from './img/brokenimage.png'
import fuzzysort from 'fuzzysort'
import ReactPlayer from 'react-player'
import urls from './m3u8.json'

function App() {
  const [channels, setChannels] = useState([])
  const [url, setUrl] = useState()

  const ChannelImage = ({ channel }) => {
    const [source, setSource] = useState(channel.tvgLogo)
    return (
      <img
        className="object-contain w-32 h-32 m-2 rounded shadow"
        src={source}
        alt="channel-logo"
        onClick={() => openUrl(channel.url)}
        onError={() => setSource(brokenImg)}
      />
    )
  }

  async function openUrl(url) {
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) {
      setUrl(url)
      window.scrollTo(0, 0)
      try {
        await axios.get(url)
      } catch (e) {
        setUrl()
        alert('Falied to load channel')
      }
    } else {
      window.open(url, '_blank')
    }
  }

  async function search(event) {
    let filtered_channels = []
    if (event.target.value) {
      let result = await fuzzysort.goAsync(event.target.value, urls, {
        limit: 15,
        key: 'title',
        allowTypo: false,
      })
      result.forEach((d) => {
        filtered_channels.push(d.obj)
      })
    } else {
      filtered_channels = urls
    }
    setChannels(filtered_channels)
  }

  useEffect(() => {
    const fetchChannels = async () => {
      setChannels(urls)
    }
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
      <div className="grid grid-cols-8">
        {channels &&
          channels.map((channel) => {
            return (
              <div key={JSON.stringify(channel)}>
                {[
                  <ChannelImage channel={channel} key={1} />,
                  <p className="p-2" key={2}>
                    {channel.title}
                  </p>,
                ]}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default App
