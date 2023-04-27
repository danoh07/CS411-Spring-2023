import React from "react";

import styles from "../pages/Home.module.css";

const YouTubePlaylist = ({ playlist, fetchPlaylistVideos }) => {
    return (
      <div className={styles.youtubePlaylistCard}>
        <div
          className={styles.youtubePlaylist}
          onClick={() => fetchPlaylistVideos(playlist.id)}
        >
          <img
            src={playlist.snippet.thumbnails.default.url}
            alt="Thumbnail"
            className={styles.youtubePlaylistImg}
          />
          <p className={styles.youtubePlaylistName}>{playlist.snippet.title}</p>
          <div className={styles.buttonContainer}>
            <button className={styles.convertButton}>Convert to Spotify Playlist</button>
          </div>
        </div>
      </div>
    );
  };
  

export default YouTubePlaylist;
