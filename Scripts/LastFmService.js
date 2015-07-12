
soundPrint.service('LastFmService', ['$http', '$q', function ($http, $q) {

    var init = function (CurrentUser) {
        CurrentUser = {
            recentTracks: null,
            topTracks: null,
            topArtist: null
        };

        var socket = io.connect('http://localhost:8080');
        socket.on('recentTracks', function (data) {
            var response = JSON.parse(data.body);
            console.log(response);
            var recentTracks = response.recenttracks.track;
            for (var i = 0; i < recentTracks.length; i++) {
                //      console.log(recentTracks[i].artist['#text'] + " : " + recentTracks[i].name);
            }
        });
        socket.on('TopTracks', function (data) {
            var response = JSON.parse(data.body);
            var toptracks = response.toptracks.track;
            var musicBrainzIds = [];
            var artists = [];

            for (var i = 0; i < toptracks.length; i++) {
                var _currentTrack = toptracks[i];

                if (_currentTrack.image != null)
                //    artists.push(_currentTrack.artist);
                artists.push(_currentTrack.image[3]);

                if (_currentTrack.artist.mbid) {
                    musicBrainzIds.push(_currentTrack.artist.mbid);
                }
            }
            CurrentUser.topTracks = artists;
            var noDuplicates = removeDuplicates(musicBrainzIds);
            var diff = musicBrainzIds.length - noDuplicates.length;

            console.log("and the number of duplicate artist is: " + diff);

        });
        socket.on('TopArtist', function (data) {
            var response = JSON.parse(data.body);
               console.log(response);
            var topartist = response.topartists.artist;
            for (var i = 0; i < topartist.length; i++) {
                //         console.log(topartist[i].name + '. This Artist has been played ' + topartist[i].playcount);
            }
        })

        return CurrentUser;
    };

    function removeDuplicates(array) {
        var parsedIds = [];
        $.each(array, function (i, el) {
            if ($.inArray(el, parsedIds) === -1) parsedIds.push(el);
        });
        return parsedIds;
    }

    return {
        Init: init
    };
}]);

