import { useEffect } from "react"
import { usePlaylistContext } from "../hooks/usePlaylistContext"
import { useAuthContext } from "../hooks/useAuthContext"
// components
import PlaylistDetails from "../components/PlaylistDetails"
import PlaylistForm from "../components/PlaylistForm"

// for state variable to store playlists
import { useState } from "react";

// Import the CSS module
import styles from "./Home.module.css";


const Home = () => {

  const {playlists, dispatch} = usePlaylistContext()
  const {user} = useAuthContext()
  const [error, setError] = useState(null);

  // YT playlist state var
  const [ytPlaylists, setYtPlaylists] = useState([]);

  // Spotify
  const [SpPlaylists, setSpPlaylists] = useState([]);

  // state var for individual playlist data
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // // State var for Spotify Tracks
  const [selectedSpPlaylist, setSelectedSpPlaylist] = useState(null);

  


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
      fetchPlaylists();
      fetchYoutubePlaylists();
      fetchSpotifyPlaylist();
    }
  }, [dispatch, user]);

  const fetchPlaylistTracks = async (playlistId) => {
    const response = await fetch(`/api/spotify/get/playlists/${playlistId}/tracks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      if (json.body) {
        setSelectedSpPlaylist(json.body.tracks);
      } else {
        console.error('Response has no body:', json);
      }
      
    } else {
      console.error('Failed to fetch playlist tracks:', json);
    }

    console.log(json);
  };

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
      // setSpPlaylists(json);
    }

    console.log(json)
  }

  // component that will display YT playlist info
  const YouTubePlaylist = ({ playlist }) => {
    return (
      <div 
        className="youtube-playlist"
        onClick={() => fetchPlaylistVideos(playlist.id)}
      >
        <img src={playlist.snippet.thumbnails.default.url} alt="Thumbnail" />
        <h3>{playlist.snippet.title}</h3>
        <button>Convert to Spotify Playlist</button>
      </div>
    );
  };

  // fetch individual videos in YT playlist
  const fetchPlaylistVideos = async (playlistId) => {
    const response = await fetch(`/api/youtube/playlistItems/${playlistId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
  
    if (response.ok) {
      setSelectedPlaylist(json);
    }
  
    console.log(json);
  };

  function PlaylistVideos({ videos }) {
    if (!Array.isArray(videos)) {
      console.error("videos is not an array:", videos);
      return null;
    }
  
    return (
      <div className="playlist-videos">
        {videos.map((video) => (
          <div key={video.id} className="video">
            <h3>{video.title}</h3>
            <p>{video.description}</p>
          </div>
        ))}
      </div>
    );
  }
  
  

  // Displays Spotify Title and Playlist Image
  const SpotifyPlaylist = ({ playlist }) => {
    return (
      <div className="spotify-playlist" onClick={() => fetchPlaylistTracks(playlist.id)}>
        <img src={playlist.images[0].url} alt={playlist.name} className="spotify-playlist-img" />
        <p className="spotify-playlist-name">{playlist.name}</p>
        <div className="button-container">
          <button className="convertButton">Convert to YouTube Playlist</button>
        </div>
      </div>

    );
  };

  

  return (
    <div className={styles.home}>
      <div className={styles.playlists}>
        {playlists && playlists.map(playlist => (
          <PlaylistDetails playlist={playlist} key={playlist._id} />
        ))}
      </div>
      <div className={styles.youtube-playlists}>
      {ytPlaylists.map((playlist) => (
        <YouTubePlaylist playlist={playlist} key={playlist.id} />
      ))}
      </div>

      <div className="spotify-playlists">
        <h1>Spotify Playlists</h1>
        <div className="library-body">
          {SpPlaylists.map((playlist) => (
            <div className="playlist-card"><SpotifyPlaylist playlist={playlist} key={playlist.id}/></div>
          ))}
        
        </div>
      </div>

      {/* <div className="spotify-tracks">
        <h2>Tracks</h2>
        {tracks.map((track, index) => (
          <Track key={index} track={track} />
        ))}
      </div> */}

      {/* <div className="home">
        <h1>My Spotify Tracks</h1>
        <div className="tracks">
          {selectedSpPlaylist && selectedSpPlaylist.map((track, index) => (
          <fetchSpotifyPlaylistTracks key={index} track={track} />
        ))}
      </div>
    </div> */}

      {selectedPlaylist && <PlaylistVideos videos={selectedPlaylist.items} />}
      <button onClick={handleClick}>spotify Test</button>
      <button onClick={handlegetplaylist}>spotify playlist</button>
      <button onClick={handlegetsearch}>spotify search</button>
      <button onClick={handlegetytplaylist}>youtube playlist</button>

      <PlaylistForm />
    </div>

  )
  
}


export default Home