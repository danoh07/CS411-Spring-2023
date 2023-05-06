# CS411-Spring-2023
## In this web application:
* The users are able to loggin in by Google OAuth or by signing up with their own email and password, which are then stored in a MongoDB database. 
* Then the user is able to fetch their Youtube playlist and Spotify playlist after logging in to the respective platforms using OAuth2.0. 
* The playlist content can be viewed and converted into the other platform's playlist.

## Note:
* All the api calls to the other platforms are handled in the backend
* The front end only call on the backend

## Instructions:
* Simply clone the repo and npm install packages
* Set the .env file

### .env file in the server directory should have the following
```
PORT= <Port Number>
MONGO_URI= <For Mongo DB>
SECRET= < key for hash (can be any password)>
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CLIENT_REDIRECT_URI=
KEY= <sessions key>
YOUTUBE_API_KEY=
```