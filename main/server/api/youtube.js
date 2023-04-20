const {google} = require('googleapis');

// Configure YouTube API client
const youtubeApi = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

module.exports = youtubeApi;
