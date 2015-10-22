/// <reference path="_app.ts" />
 
module ngXrmServiceToolkit.Demo.ngApp {
	export var app = angular.module("app", ["ngRoute", "ui.bootstrap", "ui.router", "angular-loading-bar", "ngXrm"]);

	export class ApplicationConfiguration {
		static $inject = ["$stateProvider", "$urlRouterProvider"];
		constructor($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
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
				})
			;
		}
	}

	app.config(ApplicationConfiguration);

	export class LoadingBarConfiguration {
		static $inject = ["cfpLoadingBarProvider"];

		constructor(cfpLoadingBarProvider: any) {
			cfpLoadingBarProvider.includeBar = false;
		}
	}

	app.config(LoadingBarConfiguration);
}