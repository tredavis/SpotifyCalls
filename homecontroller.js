var soundPrintApp = angular.module('soundPrintApp', []);

soundPrintApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('//');
    $interpolateProvider.endSymbol('//');
});

soundPrintApp.controller('HomeController', ['$scope', function ($scope) {
   
    console.log('testing on angular');
    $scope.name = 'tre';
    var socket = io.connect('http://localhost:8080');
    socket.on('tracks', function (data) {
        console.log(data.tracks[0]);
        $scope.songs = data.tracks[0];
        return $scope.songs;
      
    });

  
}]);

