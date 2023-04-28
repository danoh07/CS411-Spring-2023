import { usePlaylistContext } from "../hooks/usePlaylistContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useEffect, useState } from "react"

const SpotifyPlaylistDetails = ({ playlist }) => {

    const [tracks, setTracks] = useState()
    const [expended, setExpended] = useState(false)
    useEffect(() => {
  
    }, [tracks])

    const { dispatch } = usePlaylistContext()
    const { user } = useAuthContext()
    
    const handleClick = async () => {
      if(!user) {
        return
      }

      const response = await fetch('/api/playlists/' + playlist._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'DELETE_PLAYLIST', payload: json})
      }
    }

    const testonclick = async () => {
      if (expended) {
        setTracks(null)
        setExpended(false)
      } else {

        try {
          console.log('clicked!')
          const response = await fetch(`/api/spotify/get/playlists/${playlist.id}/tracks`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          })
          const json = await response.json();

          if (response.ok) {
            setTracks(json)
          }
        } catch (error) {
          console.log(error)
        }
        setExpended(true)
      }
    }

    const handleConvertPlaylist = async () => {
      try {

        const response = await fetch(`/api/convert/spotify/playlist/youtube/${playlist.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        })
    
        if (response.ok) {
          console.log(response)
        }
      } catch (error) {
        console.log(error)
      }

    }
  
    return (
      <div className="playlist-details">
        <h4>{playlist.name}</h4>
        {playlist.images[0] ? 
        <img alt="text" src= {playlist.images[0].url} /> : 
        <img alt="text" src="" />}
        <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        {!expended && <span className="arrow-button" onClick={testonclick}><div class="arrow"></div></span>}
        {expended && <span className="arrow-button-up" onClick={testonclick}><div class="arrow-up"></div></span>}
        <div>{tracks && (tracks.map(track => { console.log(track)
          return <h3>{track.track.name}</h3>
        }))}</div>
        {expended && <span className="convert-button" onClick={handleConvertPlaylist}>Convert To Spotify</span>}
        </div>
    )
  }
  
  export default SpotifyPlaylistDetails