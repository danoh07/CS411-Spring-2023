import { useEffect } from "react"
import { usePlaylistContext } from "../hooks/usePlaylistContext"
import { useAuthContext } from "../hooks/useAuthContext"
// components
import PlaylistDetails from "../components/PlaylistDetails"
import PlaylistForm from "../components/PlaylistForm"

// for state variable to store playlists
import { useState } from "react";

const Home = () => {

  const {playlists, dispatch} = usePlaylistContext()
  const {user} = useAuthContext()

  // YT playlist state var
  const [ytPlaylists, setYtPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const response = await fetch('/api/playlists', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await response.json();
  
      if (response.ok) {
        dispatch({ type: 'SET_PLAYLISTS', payload: json });
      }
    };
  
    const fetchYoutubePlaylists = async () => {
      const response = await fetch('/api/youtube/myPlaylist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
      });
      const json = await response.json();
  
      if (response.ok) {
        setYtPlaylists(json);
      }
    };
  
    if (user) {
      fetchPlaylists();
      fetchYoutubePlaylists();
    }
  
  }, [dispatch, user]);
  

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

    //assign the received json data to the YT playlist state var
    if (response.ok) {
      setYtPlaylists(json);
    }

    console.log(json)
  }

  // component that will display YT playlist info
  const YouTubePlaylist = ({ playlist }) => {
    return (
      <div className="youtube-playlist">
        <img src={playlist.snippet.thumbnails.default.url} alt="Thumbnail" />
        <h3>{playlist.snippet.title}</h3>
        <button>Convert to Spotify Playlist</button>
      </div>
    );
  };

  return (
    <div className="home">
      <div className="playlists">
        {playlists && playlists.map(playlist => (
          <PlaylistDetails playlist={playlist} key={playlist._id} />
        ))}
      </div>
      <div className="youtube-playlists">
      {ytPlaylists.map((playlist) => (
        <YouTubePlaylist playlist={playlist} key={playlist.id} />
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