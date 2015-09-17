//SoundPrint Global Object
var MongoClient = require('mongodb').MongoClient;


function SoundPrint() {
	this.User = {
		type: "Sound Print User",
		SpotifyLibrary: null,
		LastFmLibrary: null
	}

	var about = {
		Version: "1.0.0",
		Author: "Montre Davis",
		Created: "2015",
		Updated: "September 2015"
	};

	return this;
};

//SoundPrint User which will have it's own functions
SoundPrint.prototype.NewUser = function () {
	function SoundPrintUser(){
		this.UserName = null,
		this.FirstName =  null,
		this.LastName = null,
		this.Email = null,
		this.ImageUrl = null, 
		this.SpotifyLibrary = {
			tracks : "Test"
		},
		this.LastFmLibrary = null
	}

	return SoundPrintUser;
};



SoundPrint.prototype.ClearUser = function(soundPrintUser){
	soundPrintUser.UserName = null;
	soundPrintUser.FirstName = null;
	soundPrintUser.LastName = null;
	soundPrintUser.Email = null;
	soundPrintUser.ImageUrl = null;
	soundPrintUser.SongLibrary.Spotify = null;
	soundPrintUser.SongLibrary.LastFm = null;

	return sUser
}

SoundPrint.prototype.GetUserTracks = function(user){
	
	MongoClient.connect("mongodb://localhost:27017/soundprint", function (err, db){
		var collection = db.collection(user.userName);
		if(!err){
			collection.count(function(error, count){
				if(count){
					var stream = collection.find().toArray(function(err, items){
						
						if(!err){
							
						}
					//		console.log(items);
					})
				}
				else{
					console.log("There are no tracks");
				}
			})
		}
	});
};

//Save to MongoDb
SoundPrint.prototype.SaveTracksToDb = function(user, tracks){
	MongoClient.connect("mongodb://localhost:27017/soundprint", function (err, db){
		var userCollection = user.UserName;
		var collection = db.collection(userCollection);

		if(!err){
			collection.count(function(err, count){
				if(count){
					console.log('There is already data in this collection');
					var stream = collection.find().toArray(function (err, items) {
						client.emit('tracks', { tracks: items });
					});
				}
				// else{
				// 	if (songs) {
				// 		console.log('trying to insert songs');
				// 		collection.insert(songs);
				// 		console.log('songs inserted')
				// 		connectDb(null);
				// 	} 
				// }
			});
		} 
		else {
			console.log('couldnt connect to the database ' + err);
		}
	});
}

SoundPrint.prototype.GetSpotifyTracks = function(user){

}


module.exports = SoundPrint;