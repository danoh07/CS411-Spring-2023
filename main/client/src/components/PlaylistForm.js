import { useState } from 'react'
import { usePlaylistContext } from '../hooks/usePlaylistContext'

const PlaylistForm = () => {
  const { dispatch } = usePlaylistContext()
  const [selectedPlaylist, setSelectedPlaylist] = useState('')
    
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
    window.open('http://localhost:8888/api/spotify/getAuthUrl', "_self")
  }

  return (
    <div className='playlist-buttons'>
      <button disabled={selectedPlaylist === 'youtube'} 
        className='get-playlist-buttons-youtube'
        onClick={getYoutube}>
          <i class="fa-brands fa-youtube fa-xl"/>
          Get YouTube Playlist
      </button>
      <button disabled={selectedPlaylist === 'spotify'} 
        className='get-playlist-buttons' 
        onClick={getSpotify}>
          <i class="fa-brands fa-spotify fa-xl" />
          Get Spotify Playlist
        </button>
      <button disabled={selectedPlaylist === 'spotify' || selectedPlaylist === 'youtube'} 
      className='get-playlist-buttons' 
      onClick={handleClick}>
        <i class="fa-brands fa-spotify fa-xl" />
        Login to spotify
      </button>
    </div>
  )
}

export default PlaylistForm