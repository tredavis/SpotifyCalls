var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi();

function TrackObject(trackName, artistName, dateAdded, popularity, previewSong, uri){
            this.trackName = trackName;
            this.artistName = artistName;
            this.dateAdded = dateAdded;
            this.popularity = popularity;
            this.previewSong = previewSong;
            this.uri = uri;
        };


function createTrackObjects (data) {    
    var userTrackCollection = [];
    var rawTracks = []; 
    rawTracks = data.body.items;
        //Loop through data return and create Track objects
        for(var i = 0; i < rawTracks.length; i++){
            var track = new TrackObject(rawTracks[i].track.name,
                rawTracks[i].track.artists, rawTracks[i].added_at,
                rawTracks[i].track.popularity, rawTracks[i].track.previewSong, rawTracks[i].track.uri);

            userTrackCollection.push(track);    
        }
        return userTrackCollection;
    };

    exports.SpotifyGetAllSavedTracks = function(token, offset) {
        var masterTrackHolder = [];
        var access_token = token;
        spotifyApi.setAccessToken(access_token);
        var offset = offset;
        var trackDto;

        spotifyApi.getMySavedTracks({
            limit: 50,
            offset: offset
        }).then(function (data){
            var assemebledTracks = createTrackObjects(data);
            masterTrackHolder.push(assemebledTracks);
           // console.log(masterTrackHolder)
            /*if(data.body.next){
                offset += (offset + 50)
                spotifyApi.getMySavedTracks({
                    limit: 50, 
                    offset: offset
                }).then(function(data){
                    var aTracks = createTrackObjects(data);
                    masterTrackHolder.push(assemebledTracks);
                })
            }*/
            /*else{
                console.log("Done")
            }*/
        })
        return masterTrackHolder;
    };


/*function getAllUserSavedTracks(offset, array, count) {
    var userTrackArray = array;
    count = count;
    var offset = offset;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.getMySavedTracks({
                            limit: 50, //50 is the max limit spotify will allow. TD
                            offset: offset
                        }).then(function (data) {
                            var savedTracksArray = data.body.items;
                            for (var i = 0; i < savedTracksArray.length; i++) {
                                var dateAdded = savedTracksArray[i].added_at;
                                var savedTracks = savedTracksArray[i].track.name;
                                var artistList = savedTracksArray[i].track.artists;
                                var popularity = savedTracksArray[i].track.popularity;
                                var previewSong = savedTracksArray[i].track.preview_url;
                                var uri = savedTracksArray[i].track.uri;
                                var trackObject = {
                                    trackName: savedTracks,
                                    artistName: artistList,
                                    dateAdded: dateAdded,
                                    popularity: popularity,
                                    previewSong: previewSong,
                                    uri: uri
                                };
                                userTrackArray.push(trackObject);
                                userArtistArray.push(trackObject.artistName);
                            }
                            if (data.body.next) {
                                count += 1;
                                offset += (offset + 50);
                                getAllUserSavedTracks(offset, userTrackArray, count);
                                console.log("Count is now at " + count);
                            } else {
                                console.log('Sending tracks to DB... ');
                                console.log(userArtistArray);
                                var artistIdArray = sendArtistForEvaluation(userArtistArray);
                                client.emit('ids', { ids: artistIdArray });
                                client.on('parsedIds', function (arr) {
                                    var i, d, limit = 50, idBin = [], idArray;
                                    idArray = arr.parsedIds;
                                    for (i = 0, d = idArray.length; i < d; i += limit) {
                                        ids = idArray.slice(i, i + limit);
                                        sendArtistToSpotify(ids);
                                    };
                                });
                                console.log('connect db called');
                                connectDb(userTrackArray);
                            }
                        });
};
*/