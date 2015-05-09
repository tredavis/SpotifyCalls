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
    }
})();



$(function () {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    //Makes changes to the toastr button
    toastr.options = {
        "closeButton": false,
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
    $("#deleteSongs").click(function () {
        var socket = io.connect('http://localhost:8080');
        userName = document.getElementById('userName').value;
        socket.emit('clearDb', { action: userName });
        $(this).prop("disabled", true);
    });

    $("#userName").change(function () {
        (function loadTracks() {
            //variable that stores the a button
            var compareTracksButton = '<br > <button id="test" class="btn btn-info"> Compare Tracks </button>';
            $('#loadButton ').fadeOut('slow');
            var socket = io.connect('http://localhost:8080');
            var userName = '';
            userName = document.getElementById('userName').value;
            var name = capitalizeFirstLetter(userName);
            if (userName != 'null') {
                socket.emit('user', { userName: userName });
                socket.on('tracks', function (data) {
                    if (data) {
                        (function populateData() {
                            //    console.log(data); //Sam and Tyler
                            var artistId;
                            var songPop = [];
                            var trackArtistIdArray = [];
                            var artistName, art1, art2, art3;
                            var h = '<h2 id="greenBanner"> Showing Tracks from ' + name + "'s database </h2>";
                            var trackArray = data.tracks;
                            for (var i = 0; i < trackArray.length; i++) {
                                var song = trackArray[i]; var num = i + 1;
                                //If tyler or sam selected. The values will equal something different
                                if (userName == 'sam' || userName == 'tyler') {
                                    console.log(song);
                                    var trackArtist = song.name;
                                    var numArtist = trackArray[i].name.length;
                                    var songName = song.track;
                                } else {
                                    var trackArtist = song.artistName;
                                    var numArtist = trackArray[i].artistName.length;
                                    var preview = ' <a href=" ' + song.previewSong + '"> Listen Here </a> ';
                                    var songName = song.trackName;
                                }
                                var artistCount = trackArtist.length;
                                for (var x = 0; x < artistCount; x++) {
                                    if (artistCount === 1) {
                                        artistId = trackArtist[x].id;
                                        artistName = trackArtist[x].name;
                                        trackArtistIdArray.push(artistId);
                                    }
                                    else if (artistCount === 2) {
                                        art1Id = trackArtist[0].id;
                                        art2Id = trackArtist[1].id;
                                        art1 = trackArtist[0].name;
                                        art2 = trackArtist[1].name;
                                        artistId = trackArtist[x].id;
                                        trackArtistIdArray.push(art1Id, art2Id);
                                    }
                                    else if (artistCount >= 2) {
                                        art1Id = trackArtist[0].id;
                                        art2Id = trackArtist[1].id;
                                        art3Id = trackArtist[2].id;
                                        art1 = trackArtist[0].name;
                                        art2 = trackArtist[1].name;
                                        art3 = trackArtist[2].name;
                                        artistId = trackArtist[x].id;
                                        trackArtistIdArray.push(art1Id, art2Id, art3Id);
                                    }
                                }
                                songPop.push(song.popularity);
                                if (numArtist === 1) { h += '<div>' + num + '.  ' + songName + ' By:  ' + artistName + preview + '</div>'; }
                                else if (numArtist === 2) { h += '<div>' + num + '.  ' + songName + ' By:  ' + art1 + ' ft. ' + art2 + preview + '</div>'; }
                                else { h += '<div>' + num + '.  ' + songName + ' By:  ' + art1 + ' ft. ' + art2 + ' and ' + art3 + preview + '</div>'; }
                            }
                            //  console.log(songPop);
                            toastr.success('There are ' + trackArray.length + ' songs saved for ' + name + compareTracksButton);
                            document.getElementById('trackOutput').innerHTML = h;
                            removeDuplicates(trackArtistIdArray);
                            return average(songPop);
                        })();
                    }
                        //if (!data) {
                        //    console.log('Waiting for data to load');
                        //    setInterval(function () { populateData() }, 1000);
                        // } 
                    else {
                        //    populateData();
                    }


                });
            }
            else {
                console.log('there is no user selected');
            }
        })();

        function average(arr) {
            var total = 0;
            var avg;
            $.each(arr, function () {
                total += this;
                avg = (Math.round(total / arr.length));
            });
            return hipsterFunction(avg)
        };
        function removeDuplicates(array) {
            var parsedIds = [];
            $.each(array, function (i, el) {
                if ($.inArray(el, parsedIds) === -1) parsedIds.push(el);
            });
            return createArtistForCall(parsedIds);
        }
        function removeDuplicates2(array) {
            var parsedIds = [];
            $.each(array, function (i, el) {
                if ($.inArray(el, parsedIds) === -1) parsedIds.push(el);
            });
            console.log(parsedIds);
        }
        function createArtistForCall(arr) {
            var artistProfileArray = [];
            var userRapGenreContainer = [];
            var userIndieGenreContainer = [];
            var userTechnoGenreContainer = [];
            var userPopGenreContainer = [];
            var userOldiesGenreContainer = [];
            var userGenreScore = { rap: 0, indie: 0, techno: 0, pop: 0, oldies: 0 };
            var socket = io.connect('http://localhost:8080');
            var i, d, idBin, limit = 50, idBin = [];
            for (i = 0, d = arr.length; i < d; i += limit) {
                ids = arr.slice(i, i + limit);
                socket.emit('artistIds', { artistIds: ids });
                var h = '';
                socket.on('artistSoundPrintProfiles', function (data) {
                    var artist = data.profile;
                    var genre = artist.genre;
                    var name = data.profile.name;
                    h += '<div>' + 'Artist Name is  ' + genre + '  ' + '</div>'
                    //    document.getElementById('artistOutput').innerHTML = h;
                    if (genre == undefined) {
                   //     console.log( name +' has not had a genre given to him yet');
                    }
                    else if ((genre.includes('rap')) || (genre.includes('hip'))) {
                        userRapGenreContainer.push(genre);
                        userGenreScore.rap += (1 / 4);
                    }
                    else if (genre.includes('indie') || (genre.includes('wave')) || (genre.includes('wonky'))) {
                        userIndieGenreContainer.push(genre);
                        userGenreScore.indie += .25;
                    }
                    else if (genre.includes('elect') || (genre.includes('house')) || (genre.includes('edm')) || (genre.includes('dance')) || (genre.includes('tro'))) {
                        userTechnoGenreContainer.push(genre);
                        userGenreScore.techno += .25;
                    }
                    else if (genre.includes('pop')){
                        userPopGenreContainer.push(genre);
                        userGenreScore.pop += .25;
                    }
                    else if ((genre.includes('soul')) || (genre.includes('disco'))){
                        userOldiesGenreContainer.push(genre);
                        userGenreScore.oldies += .25     ;

                    }                   
                    else {
                       console.log(genre);
                    }
                    console.log(userGenreScore);
                });
            };
        }
        function hipsterFunction(score) {
            var hipsterStatus = 0;
            hipsterStatus = (100 - score);
            toastr.info('Chances are ' + hipsterStatus + '% you are a  hipster');
        }

        function displayArtist(data) {
            if (data) {

            }
            else {
                toastr.danger('Error Error!');
            }
        }
    });
});
