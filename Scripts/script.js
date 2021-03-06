//$(function () {
    
//});

$(function () {
    var socket = io.connect('http://localhost:8080');
    
    socket.on('tracks', function(data){
        console.log(data + "hiadlfa");
    });

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
    };

    //Delete's the user's tracks from the database
    $("#deleteSongs").click(function () {
        var socket = io.connect('http://localhost:8080');
        userName = document.getElementById('userName').value;
        socket.emit('clearDb', { action: userName });
        $(this).prop("disabled", true);
    });
    var someAray = [];
    var artistProfileArray = [],
            userRapGenreContainer = [],
            userIndieGenreContainer = [],
            userTechnoGenreContainer = [],
            userPopGenreContainer = [],
            userOldiesGenreContainer = [],
            userUnknownGenreContainer = [];
    var userGenreScore = { rap: 0, indie: 0, techno: 0, pop: 0, oldies: 0, unknown: 0 }

    function hipsterFunction2(score) {
        var totalScore = score.pop + score.rap + score.indie + score.techno + score.oldies;
    //    console.log(totalScore);
        var rapScore = Math.round((score.rap / totalScore) * 100);
        var indieScore = Math.round((score.indie / totalScore) * 100);
        var technoScore = Math.round((score.techno / totalScore) * 100);
        var oldiesScore = Math.round((score.oldies / totalScore) * 100);
        var popScore = Math.round((score.pop / totalScore) * 100);
   //     console.log(" Rap: " + rapScore + "%   Indie: " + indieScore + "%   Techno/House: " + technoScore + "%   Oldies: " + oldiesScore + "%  Pop: " + popScore + "%  ");
    }

    socket.on('artistSoundPrintProfiles', function (data) {
        someAray.push(data.profile);
        var h = ' ';
        var artist = data.profile;
        var id = artist.id;
        var genre = artist.genre;
        var name = data.profile.name;
        var pop = artist.hipsterStatus;
        h += '<div>' + 'Artist Name is  ' + genre + '  ' + '</div>'
        //    document.getElementById('artistOutput').innerHTML = h;
        if (genre == undefined) {
            //     console.log( name +' has not had a genre given to him yet');
            userUnknownGenreContainer.push(genre);
            userGenreScore.unknown += 1;
        } else if ((genre.includes('rap')) || (genre.includes('hip')) || (genre.includes('crunk'))) {
            userRapGenreContainer.push(genre);
            userGenreScore.rap += 1;
        } else if (genre.includes('indie') || (genre.includes('wave')) || (genre.includes('wonky'))) {
            userIndieGenreContainer.push(genre);
            userGenreScore.indie += 1;
        } else if (genre.includes('elect') || (genre.includes('house')) || (genre.includes('edm')) || (genre.includes('dance')) || (genre.includes('tro'))) {
            userTechnoGenreContainer.push(genre);
            userGenreScore.techno += 1;
        } else if (genre.includes('pop')) {
            userPopGenreContainer.push(genre);
            userGenreScore.pop += 1;
        } else if ((genre.includes('soul')) || (genre.includes('disco'))) {
            userOldiesGenreContainer.push(genre);
            userGenreScore.oldies += 1;
        } else {
            console.log(genre);
        }
        hipsterFunction2(userGenreScore);
     //   console.log(userGenreScore);

    });

    $("#userName").change(function () {
        (function loadTracks() {
            //variable that stores the a button
            var compareTracksButton = '<br > <button id="test" class="btn btn-info"> Compare Tracks </button>';
            $('#loadButton ').fadeOut('slow');
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
                                var song = trackArray[i];
                                var num = i + 1;
                                //If tyler or sam selected. The values will equal something different
                                if (name == 'Sam' || name == 'Tyler') {
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
                                    } else if (artistCount === 2) {
                                        art1Id = trackArtist[0].id;
                                        art2Id = trackArtist[1].id;
                                        art1 = trackArtist[0].name;
                                        art2 = trackArtist[1].name;
                                        artistId = trackArtist[x].id;
                                        trackArtistIdArray.push(art1Id, art2Id);
                                    } else if (artistCount >= 2) {
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
                                if (numArtist === 1) {
                                    h += '<div>' + num + '.  ' + songName + ' By:  ' + artistName + preview + '</div>';
                                } else if (numArtist === 2) {
                                    h += '<div>' + num + '.  ' + songName + ' By:  ' + art1 + ' ft. ' + art2 + preview + '</div>';
                                } else {
                                    h += '<div>' + num + '.  ' + songName + ' By:  ' + art1 + ' ft. ' + art2 + ' and ' + art3 + preview + '</div>';
                                }
                            }
                            toastr.success('There are ' + trackArray.length + ' songs saved for ' + name + compareTracksButton);
                            document.getElementById('trackOutput').innerHTML = h;
                            removeDuplicates(trackArtistIdArray);
                            return average(songPop);
                        })();
                    }
                    else {
                        populateData();
                    }
                });
            } else {
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
            return hipsterFunction2(avg)
        };

        socket.on('ids', function (data) {
            //   console.log(data);
            removeDuplicates(data.ids);
        });
        function removeDuplicates(array) {
            var parsedIds = [];
            $.each(array, function (i, el) {
                if ($.inArray(el, parsedIds) === -1) parsedIds.push(el);
            });
            socket.emit('parsedIds', { parsedIds: parsedIds });
        }
    });
});