import React from 'react';

const YouTubeVideo = ({ video }) => {
  return (
    <div className="youtube-video">
      <h3>{video.snippet.title}</h3>
      <p>{video.snippet.description}</p>
    </div>
  );
};

export default YouTubeVideo;
