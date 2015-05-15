# SpotifyCalls
Basically the same application as my other repo "Soundprint" (minus) .NET. Using Node.js instead. 
Basic app that uses Node.js and Express to make calls to Spotify and pull down the Authenticated ALL users saved tracks.

In the effort not to display my secret keys. The server side script is unavailable to view. However, I will briefly explain. 

1.I am using a spotify-node-wrapper to place the calls to spotify's API. 
2.Once the data is returned.
3.Once completed the tracks (items) are sent to a MongoDb and stored. 
4.Using Socket.io, I pass the tracks from db to the client side script. 
5.Then parse and display the items. Voila!
