
soundPrint.service('ThirdPartyLoginService', ['$http', '$q', function ($http, $q) {
    var login = function () {
        var socket = io.connect('http://localhost:8080');
        //LastFm Query String
        if (window.location.search && window.location.search.includes('?token')) {
            function getLastFMHashParams() {
                var a = window.location.search.substring(1);
                var hashParams = {};
                var e,
                    r = /([^&;=]+)=?([^&;]*)/g,
                    a = window.location.search.substring(1);
                while (e = r.exec(a)) {
                    hashParams[e[1]] = decodeURIComponent(e[2]);
                }
                return hashParams;
            }
            var params = getLastFMHashParams();
            return CurrentUserLastFm(params);
        }        // Spotify Query String
        else {
            function getSpotifyHashParams() {
                var hashParams = {};
                var e,
                    r = /([^&;=]+)=?([^&;]*)/g,
                    q = window.location.hash.substring(1);
                while (e = r.exec(q)) {
                    hashParams[e[1]] = decodeURIComponent(e[2]);
                }
                return hashParams;
            }
            var params = getSpotifyHashParams();
            return CurrentUserSpotify(params);
        }

        function CurrentUserLastFm(params) {
            var token = params.token;
            console.log('emitted the token: ' + token)
            return socket.emit('LastFmToken', { token: token }, function (error, message) {
                console.log(message)
            })
        }
        function loginDisplay() {
            $('#login').hide();
            $('#loggedin').show();
            $('#savedTrackList').show();
        }
        function logoutDisplay() {
            $('#login').show();
            $('#loggedin').hide();
            $('#savedTrackList').hide();
        }
        function CurrentUserSpotify(params) {
            var access_token = params.access_token,
           refresh_token = params.refresh_token,
           error = params.error;
            if (error) {
                alert('There was an error during the authentication');
            } else {
                if (access_token) {
                    $.ajax({
                        url: 'https://api.spotify.com/v1/me',
                        headers: {
                            'Authorization': 'Bearer ' + access_token
                        },
                        success: function (response) {
                            loginDisplay();
                        }
                    });
                } else {
                    logoutDisplay();
                }
            }
        };
    }

    return {
        Login: login
    }
}]);
