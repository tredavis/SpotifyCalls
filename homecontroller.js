var soundPrintApp = angular.module('soundPrintApp', []);

soundPrintApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('//');
    $interpolateProvider.endSymbol('//');
});

soundPrintApp.controller('HomeController', ['$scope', function ($scope) {
   
    //console.log('testing on angular');
    //$scope.name = 'tre';
    //var socket = io.connect('http://localhost:8080');
    //socket.on('tracks', function (data) {
    //    var tarray = [];
    //    for (var i = 1; i < 200; i++) {
    //        tarray += data;
    //    }
    //    $scope.tracks = tarray.;
    //    console.log($scope.tracks);
    //});

  
}]);

