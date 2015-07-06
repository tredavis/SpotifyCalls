var soundPrint = angular.module('soundPrint', ['ngRoute']);

soundPrint.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider.when('/', {
        templateUrl: 'index.html',
        controller: 'HomeController'
    })
    //.when('/last_data', {
    //    templateUrl: '/index.html',
    //    controller: 'LoginController'
    //})

}]);
