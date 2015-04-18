var soundPrintApp = angular.module('soundPrintApp', []);

soundPrintApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('//');
    $interpolateProvider.endSymbol('//');
});

soundPrintApp.controller('HomeController', ['$scope', function ($scope) {
   
    console.log('testing on angular');
    $scope.name = 'tre';
    var socket = io.connect('http://localhost:8888');
    socket.on('tracks', function (data) {
        
        $scope.trackArray = data.tracks[0];
        console.log($scope.trackArray.name);
    });

  
}]);

