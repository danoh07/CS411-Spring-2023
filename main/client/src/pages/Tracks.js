import { useEffect } from "react"

// Track Display Component
const TrackList = ({ tracks }) => {
    return(
      <div>
        <h2>Tracks</h2>
        <ul>
          {tracks.map((track) => (
            <li key={track.id}>
              <p>{track.name}</p>
              <p>{track.artist}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  export default TrackList