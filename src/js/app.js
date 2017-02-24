(function(angular){

    "use strict";

    angular
        .module("acmktplace", ["ngRoute"])

        .config(function($routeProvider){
            $routeProvider
                .when("/login", {
                    templateUrl: "partials/login.html",
                    controller: "loginController",
                    controllerAs: "context"
                })
                .when("/order/:numPedido/:CPFouCNPJ", {
                    templateUrl: "partials/order.html",
                    controller: "orderController",
                    controllerAs: "context",
                    authorize: true
                })
                .otherwise({
                    redirectTo: "/login"
                });
        })

        .run(function($rootScope, $location, authService){

            $rootScope.logged = false;

            $rootScope.$on("$routeChangeStart", function(evt, to, from){
                if (to.authorize === true){
                    to.resolve = to.resolve || {};
                    if (!to.resolve.authorizationResolver){
                        to.resolve.authorizationResolver = function(authService) {
                            return authService.authorize();
                        };
                    }
                }
            });

            $rootScope.$on("$routeChangeError", function(evt, to, from, error){
                if (error instanceof AuthorizationError){
                    $location.path("/login");
                }
            });
        })

        .controller("loginController", function($rootScope, $scope, $location, authService){
            $rootScope.logged = false;
            $scope.numPedido = '';
            $scope.CPFouCNPJ = '';

            $scope.submitForm = function(isValid) {
                if (isValid) {
                    // Passa os dados para o rootScope
                    $rootScope.numPedido = $scope.numPedido;
                    $rootScope.CPFouCNPJ = $scope.CPFouCNPJ;

                    // Redireciona para a pagina do pedido
                    authService.authenticated = true;
                    $location.path("/order/"+$scope.numPedido+"/"+$scope.CPFouCNPJ);
                }
            };
        })

        .controller("orderController", function($rootScope, $scope){
            $rootScope.logged = true;

            $scope.menuOpen = false;
            $scope.showMenu = function(){
                $scope.menuOpen = !$scope.menuOpen;
                console.log($scope.menuOpen);
            };
        })

        .service("authService", function($q, $timeout){
            var self = this;
            this.authenticated = false;
            this.authorize = function() {
                return this
                    .getInfo()
                    .then(function(info){
                        if (info.authenticated === true)
                            return true;
                        // anonymous
                        throw new AuthorizationError();
                    });
            };
            this.getInfo = function() {
                return $timeout(function(){
                    return self;
                }, 1000);
            };
        });

        // Custom error type
        function AuthorizationError(description) {
            this.message = "Forbidden";
            this.description = description || "User authentication required.";
        }

        AuthorizationError.prototype = Object.create(Error.prototype);
        AuthorizationError.prototype.constructor = AuthorizationError;

})(angular);
