import { useState, useEffect } from 'react'
import { usePlaylistContext } from '../hooks/usePlaylistContext'

const PlaylistForm = () => {
  const { dispatch } = usePlaylistContext()
  const [selectedPlaylist, setSelectedPlaylist] = useState('')
  const [login, setLogin] = useState(false)
  

  useEffect(() => {
    try {
      const loginstate = localStorage.getItem('spotify_login')
      if (loginstate) {
        setLogin(true)
      
      }

    } catch (error) {
      console.log(error)
    }

  }, [login])

  const getYoutube = () => {
    if (selectedPlaylist !== 'youtube') {
      console.log('Change playlist to youtube')
      dispatch({type: 'SET_PLAYLISTS', payload: 'youtube'})
      setSelectedPlaylist('youtube')

    }
  } 
  
  const getSpotify = () => {
    if (selectedPlaylist !== 'spotify') {
      console.log('Change playlist to spotify')

      dispatch({type: 'SET_PLAYLISTS', payload: 'spotify'})

      setSelectedPlaylist('spotify')
    }
  } 

  const handleClick = () => {
    window.open('http://localhost:8888/api/spotify/getAuthUrl', '_self')
    setLogin(true)
    localStorage.setItem('spotify_login', 'logged in')
  }

  return (
    <div className='playlist-buttons'>
      <button disabled={selectedPlaylist === 'youtube'} 
        className='get-playlist-buttons-youtube'
        onClick={getYoutube}>
          <i class="fa-brands fa-youtube fa-xl"/>
          Get YouTube Playlist
      </button>
      {login && <button disabled={selectedPlaylist === 'spotify'} 
        className='get-playlist-buttons' 
        onClick={getSpotify}>
          <i class="fa-brands fa-spotify fa-xl" />
          Get Spotify Playlist
        </button>}
      {!login && <button disabled={selectedPlaylist === 'spotify' || selectedPlaylist === 'youtube'} 
      className='get-playlist-buttons' 
      onClick={handleClick}>
        <i class="fa-brands fa-spotify fa-xl" />
        Login to spotify
      </button>}
    </div>
  )
}

export default PlaylistForm