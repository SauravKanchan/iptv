/* eslint react/prop-types: 0 */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import brokenImg from './img/brokenimage.png'
import fuzzysort from 'fuzzysort'
import ReactPlayer from 'react-player'
import urls from './m3u8.json'
import { LazyLoadImage } from 'react-lazy-load-image-component'

function SvgComponent(props) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path
        clipRule="evenodd"
        d="M46 37H2a1 1 0 01-1-1V8a1 1 0 011-1h44a1 1 0 011 1v28a1 1 0 01-1 1zM45 9H3v26h42V9zm-24 7c.214 0 .4.082.563.196l7.771 4.872A.99.99 0 0130 22a.981.981 0 01-.405.783l-7.974 4.981A.982.982 0 0121 28a1 1 0 01-1-1V17a1 1 0 011-1zm-6 23h18a1 1 0 110 2H15a1 1 0 110-2z"
        fill="currentColor"
        stroke="currentColor"
      />
    </svg>
  )
}

function App() {
  const [channels, setChannels] = useState([])
  const [url, setUrl] = useState(null)
  const [selectedChannel, setSelectedChannel] = useState()

  const ChannelImage = ({ channel }) => {
    const [source, setSource] = useState(channel.tvgLogo)
    return (
      <LazyLoadImage
        className="object-contain w-20 h-20 mx-2 my-4 bg-white rounded shadow md:w-32 md:h-32"
        src={source}
        alt="channel-logo"
        onClick={() => openUrl(channel)}
        onError={() => setSource(brokenImg)}
      />
    )
  }

  async function openUrl(channel) {
    let url = channel.url
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) {
      setUrl(url)
      setSelectedChannel(channel)
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
    <div>
      <div className="overflow-x-hiddenbg-gray-100 ">
        <header className="fixed top-0 left-0 w-full bg-blue-700 shadow ">
          <div className="container flex px-2 py-2 mx-auto md:justify-between md:max-w-6xl md:py-4 ">
            <div className="sticky top-0 flex items-center justify-center flex-shrink px-4 space-x-2 text-2xl font-bold text-white md:w-auto">
              <SvgComponent className="w-8 h-8" />
              <span className="hidden md:block">OpenTV</span>
            </div>
            <input
              type="text"
              alt="search"
              className="block px-4 py-1 ml-auto bg-gray-100 border rounded-full md:py-2 md:px-4"
              placeholder="Search for a channel"
              onChange={search}
            />
          </div>
        </header>
        <div className="max-w-6xl pt-20 mx-auto md:pt-32">
          {url && (
            <div className="flex justify-between px-16 py-8 mx-2 my-8 bg-gray-100 shadow-md">
              <div className="flex flex-col justify-center">
                <h1 className="hidden px-4 py-8 text-4xl font-bold md:block">{selectedChannel.title}</h1>
                <img
                  src={selectedChannel.tvgLogo}
                  alt=""
                  className="block object-contain w-12 h-12 px-4 mx-4 bg-white rounded md:w-20 md:h-20"
                />
              </div>
              <ReactPlayer playing controls url={url} />{' '}
            </div>
          )}
          <div className="grid grid-cols-4 px-2 md:grid-cols-8">
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
      </div>
    </div>
  )
}

export default App
