import SpotifyWebApi from 'spotify-web-api-js';

export var spotifyApi = new SpotifyWebApi();

// Set spotify access token if present in hash
if (window.location.hash) {
    let token = window.location.hash.split('&')[0].split('=')[1];
    spotifyApi.setAccessToken(token);

// Else redirect and authenticate the user
} else {
    let client_id = '219140b97e454450b4d6ab9761e0c408';

    // Uncomment to deploy to vercel vs locally
    let redirect_uri = 'http://localhost:8080/';
    // let redirect_uri = 'https://spotify-vis.vercel.app/';

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    window.location.replace(url);
}
