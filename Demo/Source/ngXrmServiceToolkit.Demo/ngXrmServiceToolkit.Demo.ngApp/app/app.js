/// <reference path="_app.ts" />
var ngXrmServiceToolkit;
(function (ngXrmServiceToolkit) {
    var Demo;
    (function (Demo) {
        var ngApp;
        (function (ngApp) {
            ngApp.app = angular.module("app", ["ngRoute", "ui.bootstrap", "ui.router", "angular-loading-bar", "ngXrm"]);
            var ApplicationConfiguration = (function () {
                function ApplicationConfiguration($stateProvider, $urlRouterProvider) {
                    $urlRouterProvider.otherwise("/app/welcome");
                    $stateProvider
                        .state("app", {
                        url: "/app",
                        templateUrl: "app/html/main.html"
                    })
                        .state("app.about", {
                        url: "/about",
                        templateUrl: "app/html/about.html",
                        controller: ngXrmServiceToolkit.Demo.ngApp.Controllers.AboutController.id,
                        controllerAs: 'vm'
                    })
                        .state("app.demo", {
                        url: "/demo",
                        templateUrl: "app/html/demo.html",
                        controller: ngXrmServiceToolkit.Demo.ngApp.Controllers.DemoController.id,
                        controllerAs: 'vm'
                    })
                        .state("app.welcome", {
                        url: "/welcome",
                        templateUrl: "app/html/welcome.html"
                    });
                }
                ApplicationConfiguration.$inject = ["$stateProvider", "$urlRouterProvider"];
                return ApplicationConfiguration;
            })();
            ngApp.ApplicationConfiguration = ApplicationConfiguration;
            ngApp.app.config(ApplicationConfiguration);
            var LoadingBarConfiguration = (function () {
                function LoadingBarConfiguration(cfpLoadingBarProvider) {
                    cfpLoadingBarProvider.includeBar = false;
                }
                LoadingBarConfiguration.$inject = ["cfpLoadingBarProvider"];
                return LoadingBarConfiguration;
            })();
            ngApp.LoadingBarConfiguration = LoadingBarConfiguration;
            ngApp.app.config(LoadingBarConfiguration);
        })(ngApp = Demo.ngApp || (Demo.ngApp = {}));
    })(Demo = ngXrmServiceToolkit.Demo || (ngXrmServiceToolkit.Demo = {}));
})(ngXrmServiceToolkit || (ngXrmServiceToolkit = {}));
//# sourceMappingURL=app.js.map