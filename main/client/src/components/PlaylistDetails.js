import { usePlaylistContext } from "../hooks/usePlaylistContext"
import { useAuthContext } from "../hooks/useAuthContext"
// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const PlaylistDetails = ({ playlist }) => {

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

    return (
      <div className="playlist-details">
        <h4>{playlist.title}</h4>
        <p><strong>Songs : </strong>{playlist.songs}</p>
        <p><strong>Load: </strong>{playlist.load}</p>
        <p>{formatDistanceToNow(new Date(playlist.createdAt), { addSuffix: true })}</p>
        <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
      </div>
    )
  }
  
  export default PlaylistDetails