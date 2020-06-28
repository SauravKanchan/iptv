import React, { useEffect, useState } from 'react'
import axios from 'axios'
import m3u8Parser from 'm3u8-file-parser'
import './App.css'

function App() {
  const [channels, setChannels] = useState([])
  useEffect(() => {
    const fetchChannels = async () => {
      let res = await axios.get('https://raw.githubusercontent.com/billacablewala/m3u8/master/README.md')
      let reader = new m3u8Parser()
      let urls = res.data.split('\n')
      urls.forEach((url) => {
        try {
          reader.read(url)
        } catch (error) {
          console.log('Error in reading url')
        }
      })
      setChannels(reader.getResult().segments)
      console.log(reader.getResult().segments)
    }
    try {
      fetchChannels()
    } catch (error) {
      console.log('Error in fetching channels')
    }
  }, [])
  return (
    <div className="max-w-6xl mx-auto ">
      <header className="px-4 text-2xl font-bold">IPTV</header>
      <div className="flex flex-wrap justify-between">
        {channels &&
          channels.map((channel) => {
            console.log(channel)
            return (
              <div>
                <img
                  className="h-32 p-4 m-2 rounded shadow"
                  src={channel.inf && channel.inf.tvgLogo}
                  alt="channel-logo"
                />
                <p className="px-4">{channel.inf && channel.inf.title}</p>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default App
