import { useEffect } from "react"
import { usePlaylistContext } from "../hooks/usePlaylistContext"
import { useAuthContext } from "../hooks/useAuthContext"
// components
import PlaylistDetails from "../components/PlaylistDetails"
import PlaylistForm from "../components/PlaylistForm"

const Home = () => {

  const {playlists, dispatch} = usePlaylistContext()
  const {user} = useAuthContext()

  useEffect(() => {
    
    const fetchPlaylists = async () => {
      const response = await fetch('/api/playlists', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_PLAYLISTS', payload: json})
      }
    }
    if(user) { 
      fetchPlaylists() 
    }

  }, [dispatch, user])

  const handleClick = () => {
    window.open('http://localhost:8888/api/spotify/getAuthUrl', "_self")
  }
  const handlegetplaylist= async () => {
    const response = await fetch('/api/spotify/get/playlist', {
      method: 'Get',
      headers: {'Content-Type': 'application/json'},
    })
    const json = await response.json()

    console.log(json.body.items)
  }

  const handlegetsearch= async () => {
    const response = await fetch('/api/spotify/search/track' + '/shake it off', {
      method: 'Get',
      headers: {'Content-Type': 'application/json'},
    })
    const json = await response.json()

    console.log(json)
  }

  const handlegetytplaylist= async () => {
    const response = await fetch('/api/youtube/myPlaylist', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
    })
    const json = await response.json()

    console.log(json)
  }

  return (
    <div className="home">
      <div className="playlists">
        {playlists && playlists.map(playlist => (
          <PlaylistDetails playlist={playlist} key={playlist._id} />
        ))}
      </div>
      <button onClick={handleClick}>spotify Test</button>
      <button onClick={handlegetplaylist}>spotify playlist</button>
      <button onClick={handlegetsearch}>spotify search</button>
      <button onClick={handlegetytplaylist}>youtube playlist</button>

      <PlaylistForm />
    </div>
  )
}

export default Home