import { useState } from 'react'
import { usePlaylistContext } from '../hooks/usePlaylistContext'
import { useAuthContext } from '../hooks/useAuthContext'

const PlaylistForm = () => {
  const { dispatch } = usePlaylistContext()
  const { user } = useAuthContext()
  const [title, setTitle] = useState('')
  const [songs, setSongs] = useState('')
  const [load, setLoad] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if(!user) {
      setError('You must be logged in')
      return
    }

    const playlist = {title, songs, load}
    
    const response = await fetch('/api/playlists', {
      method: 'POST',
      body: JSON.stringify(playlist),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })

    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }
    if (response.ok) {
      setError(null)
      setTitle('')
      setSongs('')
      setLoad('')
      setEmptyFields([])
      console.log('new playlist added:', json)
      dispatch({type: 'CREATE_PLAYLIST', payload: json})
    }

  }

  return (
    <form className="create" onSubmit={handleSubmit}> 
      <h3>Add a New Playlist</h3>

      <label>Playlist Title:</label>
      <input 
        type="text" 
        onChange={(e) => setTitle(e.target.value)} 
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>song:</label>
      <input 
        type="text" 
        onChange={(e) => setSongs(e.target.value)} 
        value={[songs]}
        className={emptyFields.includes('songs') ? 'error' : ''}

      />

      <label>load:</label>
      <input 
        type="number" 
        onChange={(e) => setLoad(e.target.value)} 
        value={load} 
      />

      <button>Add Playlist</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default PlaylistForm