soundPrint.controller('HomeController', ['$scope', 'LastFmService', function ($scope, LastFmService) {
    $scope.name = "Hello Tre ... er.. er ... Sir Tron";
    var name = $scope.name;
    console.log($scope.name);

    LastFmService.Init();
}]);
