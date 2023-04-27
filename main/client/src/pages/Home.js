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
import TrackList from "./Tracks"

// Import YouTubeVideo for displaying individual videos in playlists
import YouTubeVideo from '../components/YouTubeVideo';
import YouTubePlaylist from "../components/YouTubePlaylist";


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

  // State var for track titles
  const [tracks, setTracks] = useState([]);

  // Keep track of current Spotify Playlist
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  


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
    console.log(playlistId)
    
    const response = await fetch(`/api/spotify/get/playlists/${playlistId}/tracks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      // Only keeping console.log(json) gives the entire track detail
      // console.log(json);

      // This alone will list out the track Titles only as an array
      const trackTitles = json.map((track) => track.track.name);
      setTracks(trackTitles);
      setSelectedPlaylistId(playlistId);
      console.log(trackTitles);
      
    } else {
      console.error('Failed to fetch playlist tracks:', json);
    }
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

  // fetch individual videos in YT playlist
  const fetchPlaylistVideos = async (playlistId) => {
    console.log(playlistId)
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
            <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
            <h3>{video.snippet.title}</h3>
          </div>
        ))}
      </div>
    );
  }
  
  

  const handleConvertPlaylist = async () => {
    const url = '5G523ZrqMvswd6v4EIKXJY'
    const response = await fetch(`/api/convert/spotify/playlist/youtube/${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
    })

    if (response.ok) {
      console.log(response)
    }


  }
  
  
  const handleConvertPlaylistToSpotifty = async () => {
    const url = 'PL1WTFXTGiZrnrtQuiPere9iZopkoQB9F8'
    const response = await fetch(`/api/convert/youtube/playlist/spotify/${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
    })

    if (response.ok) {
      console.log(response)
    }
  }
  

  // Displays Spotify Title and Playlist Image
  const SpotifyPlaylist = ({ playlist }) => {
    
    var url ="" 

    if (playlist.images[0]) {
      url = playlist.images[0].url
    }
    
    return (
      <div className="spotify-playlist" onClick={() => fetchPlaylistTracks(playlist.id)}>
        <img src={url} alt={playlist.name} className="spotify-playlist-img" />
        <p className="spotify-playlist-name">{playlist.name}</p>
        <div className="button-container">
          <button className="convertButton">Convert to YouTube Playlist</button>
        </div>
        {playlist.id == selectedPlaylistId && tracks.length > 0 && (
          <ol>
            {tracks.map((track, index) => (
              <li className="spotifyTrack" key={index}>{track}</li>
            ))}
          </ol>
        )}
        {/* <ul>
          {TrackList.map((track) => (
            <li key={track.id}>{track.name}</li>
          ))}
        </ul> */}
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
      <div className={styles.youtubePlaylists}>
      {ytPlaylists.map((playlist) => (
        <YouTubePlaylist
          playlist={playlist}
          key={playlist.id}
          fetchPlaylistVideos={fetchPlaylistVideos}
        />
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

      {selectedPlaylist && <PlaylistVideos videos={selectedPlaylist.items} />}
      <button onClick={handleClick}>spotify Test</button>
      <button onClick={handlegetplaylist}>spotify playlist</button>
      <button onClick={handlegetsearch}>spotify search</button>
      <button onClick={handlegetytplaylist}>youtube playlist</button>
      <button onClick={handleConvertPlaylist}>convert playlist</button>
      <button onClick={handleConvertPlaylistToSpotifty}>convert playlist to spotify</button>
      <PlaylistForm />
    </div>

  )
  
}


export default Home