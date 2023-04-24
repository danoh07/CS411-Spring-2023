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

  

  return (
    <div className="home">
      <div className="playlists">
        {playlists && playlists.map(playlist => (
          <PlaylistDetails playlist={playlist} key={playlist._id} />
        ))}
      </div>
      <PlaylistForm />
    </div>
  )
}

export default Home