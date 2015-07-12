soundPrint.controller('HomeController', ['$scope', 'LastFmService', 'ThirdPartyLoginService', function ($scope, LastFmService, ThirdPartyLoginService) {
    var socket = io.connect('http://localhost:8080');
   // var user = {};

    $scope.name = "Hello Tre ... er.. er ... Sir Tron";
    var name = $scope.name;
    console.log($scope.name);


    ThirdPartyLoginService.Login();
    var user = LastFmService.Init();
    var wait = setInterval(function () {
        if (user.topTracks) {
            var images = [];
            //  $scope.user = user.topTracks;
            for (var i = 0; i < user.topTracks.length; i++){
                var image = user.topTracks[i]['#text'];
        //        console.log(image);
                var htmlArtistImage = '<div> <img src="'+image+'" width: 50px height: 50px/> </div>';
                images.push(htmlArtistImage);
            }

            document.getElementById('artistImages').innerHTML = images.join("");

            
            clearInterval(wait);
        }
    }, 700);

  
}]);
