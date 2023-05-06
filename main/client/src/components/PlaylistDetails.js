import { usePlaylistContext } from "../hooks/usePlaylistContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useEffect, useState } from "react"

const PlaylistDetails = ({ playlist }) => {

    const [videos, setVideos] = useState()
    const [expended, setExpended] = useState(false)
    const [completed, setCompleted] = useState(false)
    useEffect(() => {
  
    }, [videos])

    const { dispatch } = usePlaylistContext()
    const { user } = useAuthContext()
    
    const handleClick = async () => {
      if(!user) {
        return
      }

      const response = await fetch(`/api/youtube/delete/playlist/${playlist.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
      })
      const json = await response.json()

      if (response.ok) {
        console.log(json)
        dispatch({type: 'DELETE_PLAYLIST'})
      }
    }

    const testonclick = async () => {
      if (expended) {
        setVideos(null)
        setExpended(false)
      } else {

        try {
          console.log('clicked!')
          const response = await fetch(`/api/youtube/playlistItems/${playlist.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`,
            },
          });
  
          const json = await response.json();
  
          if (response.ok) {
            setVideos(json.items)
          }
        } catch (error) {
          console.log(error)
        }

        setExpended(true)
      }
    }

    const handleConvertPlaylist = async () => {
      try {

        const response = await fetch(`/api/convert/youtube/playlist/spotify/${playlist.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },

        })
    
        if (response.ok) {
          console.log(response)
          setCompleted(true)
        }
      } catch (error) {
        console.log(error)
      }
    }
  
    return (
      <div className="playlist-details">
        <h4>{playlist.snippet.title}</h4>
        {playlist.snippet.thumbnails.high.url ? 
        <img alt="text" src= {playlist.snippet.thumbnails.high.url} /> : 
        <img alt="text" src="" />}
        <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        {!expended && <span className="arrow-button" onClick={testonclick}><div class="arrow"></div></span>}
        {expended && <span className="arrow-button-up" onClick={testonclick}><div class="arrow-up"></div></span>}
        <div>{videos && (videos.map(video => { console.log(video)
          return <h3>{video.snippet.title}</h3>
        }))}</div>
        {(expended && !completed) && <button className="convert-button" disabled={completed} onClick={handleConvertPlaylist}>Convert To Spotify</button>}
        {(expended && completed) && <div className="complete">Converted!</div>}
        </div>
    )
  }
  
  export default PlaylistDetails