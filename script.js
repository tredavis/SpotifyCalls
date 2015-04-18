(function () {
    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    var userProfileSource = document.getElementById('user-profile-template').innerHTML,
        userProfileTemplate = Handlebars.compile(userProfileSource),
        userProfilePlaceholder = document.getElementById('user-profile');

    var oauthSource = document.getElementById('oauth-template').innerHTML,
        oauthTemplate = Handlebars.compile(oauthSource),
        oauthPlaceholder = document.getElementById('oauth');

    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {
            // render oauth info
            oauthPlaceholder.innerHTML = oauthTemplate({
                access_token: access_token,
                refresh_token: refresh_token
            });

            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    userProfilePlaceholder.innerHTML = userProfileTemplate(response);

                    $('#login').hide();
                    $('#loggedin').show();
                }
            });
        }
        else {
            // render initial screen
            $('#login').show();
            $('#loggedin').hide();
        }

        document.getElementById('obtain-new-token').addEventListener('click', function () {
            $.ajax({
                url: '/refresh_token',
                data: {
                    'refresh_token': refresh_token
                }
            }).done(function (data) {
                access_token = data.access_token;
                oauthPlaceholder.innerHTML = oauthTemplate({
                    access_token: access_token,
                    refresh_token: refresh_token
                });
            });
        }, false);
    }

    var socket = io.connect('http://localhost:8080');
    socket.on('tracks', function (data) {
        var h = ' ';
        var trackArray = data.tracks;
        for (var i = 0; i < trackArray.length; i++) {
            var num = i + 1;
            var song = trackArray[i];
            var trackArtist = song.name;
            for (var x = 0; x < trackArtist.length; x++) {
                if (trackArtist) {
                    var artistId = trackArtist[x].id;
                    var artistName = trackArtist[x].name;
                }               

            //From here I need to go back and figure out how to save the songs to a mongo database. 
            }
            

            h += '<div>' + num + '.  ' + song.track + ' By:  ' + artistName + '</div>';
        }
        console.log('There are ' + trackArray.length + ' songs retrieved from your playlist');
        alert('There are ' + trackArray.length + ' songs retrieved from your playlist');

     
        document.getElementById('trackOutput').innerHTML = h;

    });
})();
