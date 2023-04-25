const {google} = require('googleapis');
const User = require('../models/userModel');

// Use your own API credentials
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CLITET_REDIRECT_URI
  );

// Configure YouTube API client
const youtubeApi = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  });


const getMyPlaylist = async (req, res) => {
    try {
        const user = req.user
        console.log(user)

        oauth2Client.setCredentials({
            access_token: user.accessToken
        });
          

        const youtube = google.youtube({
            version: 'v3',
            auth: oauth2Client
        });

        const respond = await youtube.playlists.list({
        part: 'snippet,contentDetails',
        mine: true,
        maxResults: 25
        });

        const playlists = respond.data.items;
        console.log(`Found ${playlists.length} playlists.`);
        playlists.forEach((playlist) => {
        console.log(`${playlist.snippet.title} (${playlist.id})`);
        })
        
        res.status(200).json(respond)

    } catch (error) {
        res.status(400).json({error: error})
    }
}

const createPlaylist = async (req, res) => {
    try {
        const user = req.user
        console.log(user)

        oauth2Client.setCredentials({
            access_token: user.accessToken
        });
          

        const youtube = google.youtube({
            version: 'v3',
            auth: oauth2Client
        });

        const { playlistName, playlistDescription } = req.body

        // Use the `playlists.insert()` method to create a new playlist
        const respond = await youtube.playlists.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: playlistName,
                    description: playlistDescription
                },
                status: {
                    privacyStatus: 'PRIVATE'
                }
            }
        });

        res.status(200).json(respond)

    } catch (error) {
        res.status(400).json({error: error})
    }
}

const updatePlaylist = async (req, res) => {
    try {
        const user = req.user
        console.log(user)

        oauth2Client.setCredentials({
            access_token: user.accessToken
        });
          

        const youtube = google.youtube({
            version: 'v3',
            auth: oauth2Client
        });

        // An array of video IDs to add to the playlist
        const { videoIds } = req.body;
        var respond
        // Loop through the array and add each video to the playlist
        for (let i = 0; i < videoIds.length; i++) {
            respond = await youtube.playlistItems.insert({
                part: 'snippet',
                requestBody: {
                snippet: {
                    playlistId: 'PLAYLIST_ID',
                    resourceId: {
                    kind: 'youtube#video',
                    videoId: videoIds[i]
                    }
                }
                }
            })
        }

        res.status(200).json(respond)

    } catch (error) {
        res.status(400).json({error: error})
    }
}

const search = async (req, res) => {
    try { 

        const { searchParam }  = req.params
    
        // Use the `search.list()` method to search for videos
        const response = await youtubeApi.search.list({
            part: 'id,snippet',
            q: searchParam,
            type: 'video',
            maxResults: 15
        })
    
        res.status(200).json(response)
    
        } catch (error) {
          res.status(400).json({error: error})
        }
}

const logout = (req, res) => {
    try {
        const user = req.user
        const { email } = user
        console.log(user)
        User.findOneAndUpdate({ email }, {$unset: { accessToken: "", refreshToken: "" }})
        res.status(200)

    } catch (error) {
      res.status(400).json({error: error})
    }
}

module.exports = {getMyPlaylist, createPlaylist, updatePlaylist, logout, search}
