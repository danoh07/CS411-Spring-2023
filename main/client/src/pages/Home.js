import { useEffect } from "react"
import { usePlaylistContext } from "../hooks/usePlaylistContext"
import { useAuthContext } from "../hooks/useAuthContext"
// components
import PlaylistDetails from "../components/PlaylistDetails"
import SpotifyPlaylistDetails from "../components/SpotifyPlaylistDetails"
import PlaylistForm from "../components/PlaylistForm"

// for state variable to store playlists
import { useState } from "react";

const Home = () => {

  const {playlists, dispatch} = usePlaylistContext()
  const {user} = useAuthContext()
  // YT playlist state var
  const [ytPlaylists, setYtPlaylists] = useState([]);

  // Spotify
  const [SpPlaylists, setSpPlaylists] = useState([]);

  useEffect(() => {

    console.log(playlists)

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

    // Fetches Spotify playlist Information
    async function fetchSpotifyPlaylist() {
      const response = await fetch('api/spotify/get/playlist', {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
      },
        });
        const data = await response.json();
        
        if (response.ok) {
          setSpPlaylists(data.body.items);
        }
    }
    

  
    if (user) {
      if (playlists === 'youtube') {
        fetchYoutubePlaylists()
      }
      if (playlists === 'spotify') {
        fetchSpotifyPlaylist()
      }
    }
  }, [dispatch, user, playlists]);

  return (
    <div className="home">
      {(playlists === 'youtube' || !playlists) && <div className="playlist">
        {ytPlaylists && ytPlaylists.map(playlist => (
          <PlaylistDetails playlist={playlist} key={playlist.id} />
        ))}
      </div>}
      {playlists === 'spotify' && <div className="playlist">
        {SpPlaylists && SpPlaylists.map(playlist => (
          <SpotifyPlaylistDetails playlist={playlist} key={playlist.id} />
        ))}
      </div>}
      <PlaylistForm />
    </div>
  )
}


export default Home