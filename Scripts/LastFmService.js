
soundPrint.service('LastFmService', ['$http', '$q', function ($http, $q) {

    var init = function () {
        var socket = io.connect('http://localhost:8080');
        socket.on('recentTracks', function (data) {
            var response = JSON.parse(data.body);
            var recentTracks = response.recenttracks.track;
            for (var i = 0; i < recentTracks.length; i++) {
                //      console.log(recentTracks[i].artist['#text'] + " : " + recentTracks[i].name);
            }
        });
        socket.on('TopTracks', function (data) {
            var response = JSON.parse(data.body);
            var toptracks = response.toptracks.track;
            for (var i = 0; i < toptracks.length; i++) {
                //      console.log(toptracks[i].artist.name + " : " + toptracks[i].name + '. This song has been played ' +  toptracks[i].playcount);
            }
        });
        socket.on('TopArtist', function (data) {
            var response = JSON.parse(data.body);
            console.log(response);
            var topartist = response.topartists.artist;
            for (var i = 0; i < topartist.length; i++) {
                //         console.log(topartist[i].name + '. This Artist has been played ' + topartist[i].playcount);
            }
        }

        )
    };

    return {
            Init: init
    };
}]);

