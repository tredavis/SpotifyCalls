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
                    $('#savedTrackList').show();
                }
            });
        }
        else {
            // render initial screen
            $('#login').show();
            $('#loggedin').hide();
            $('#savedTrackList').hide();

        }

        //document.getElementById('obtain-new-token').addEventListener('click', function () {
        //    $.ajax({
        //        url: '/refresh_token',
        //        data: {
        //            'refresh_token': refresh_token
        //        }
        //    }).done(function (data) {
        //        access_token = data.access_token;
        //        oauthPlaceholder.innerHTML = oauthTemplate({
        //            access_token: access_token,
        //            refresh_token: refresh_token
        //        });
        //    });
        //}, false);
    }
})();



$(function () {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    //Makes changes to the toastr button
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    $("#userName").change(function () {
        (function loadTracks() {
            //variable that stores the a button
            var compareTracksButton = '<br > <button id="test" class="btn btn-info"> Compare Tracks </button>';
            $('#loadButton ').fadeOut('slow');
            var socket = io.connect('http://localhost:8080');
            var userName = '';
            userName = document.getElementById('userName').value;
            var name = capitalizeFirstLetter(userName);
            socket.emit('user', { userName: userName });
            socket.on('tracks', function (data) {
                var populateData = function () {
                    var artistId;
                    var artistName, art1, art2, art3;
                    var h = '<h2 id="greenBanner"> Showing Tracks from ' + name +  "'s database </h2>" ;
                    var trackArray = data.tracks;
                    for (var i = 0; i < trackArray.length; i++) {
                        var num = i + 1;
                        var song = trackArray[i];
                        var trackArtist = song.name;
                        var numArtist = trackArray[i].name.length;
                        var artistCount = trackArtist.length;
                        for (var x = 0; x < artistCount; x++) {
                            if (artistCount === 1) {
                                artistId = trackArtist[x].id;
                                artistName = trackArtist[x].name;
                            }
                            else if (artistCount === 2) {
                                art1 = trackArtist[0].name;
                                art2 = trackArtist[1].name;
                                artistId = trackArtist[x].id;
                            }
                            else if (artistCount >= 2) {
                                art1 = trackArtist[0];
                                art2 = trackArtist[1];
                                art3 = trackArtist[2];
                                artistId = trackArtist[x].id;
                            }
                        }
                        if (numArtist === 1) { h += '<div>' + num + '.  ' + song.track + ' By:  ' + artistName + '</div>'; }
                        else if (numArtist === 2) { h += '<div>' + num + '.  ' + song.track + ' By:  ' + art1 + ' ft. ' + art2 + '</div>'; }
                        else { h += '<div>' + num + '.  ' + song.track + ' By:  ' + art1.name + ' ft. ' + art2.name + ' and ' + art3.name + '</div>'; }
                    }
                    toastr.success('There are ' + trackArray.length + ' songs saved for ' + name + compareTracksButton);
                    document.getElementById('trackOutput').innerHTML = h;
                }
                if (!data) {
                    console.log('Waiting for data to load');
                    setInterval(function () { populateData() }, 1000);
                } else {
                    populateData();
                }
            });
        })();
    });
});
