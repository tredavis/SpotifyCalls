

exports.userRecentTracks = function (username, apiKey) {
    return 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + username + '&api_key=' + apiKey + '&format=json';
};

exports.userTopTracks = function(username, apiKey) {
    return 'http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=' + username + '&api_key=' + apiKey + '&format=json';
};

exports.userRecommendedArtists = function(username, apiKey) {
    return 'http://ws.audioscrobbler.com/2.0/?method=user.getRecommendedArtists&user=' + username + '&api_key=' + apiKey + '&format=json';
};

exports.userTopArtist = function (username, apiKey) {
    return 'http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=' + username + '&api_key=' + apiKey + '&format=json';
}

