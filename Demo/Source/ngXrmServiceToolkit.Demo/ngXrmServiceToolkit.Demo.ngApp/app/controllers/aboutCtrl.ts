/// <reference path="../_app.ts" />

module ngXrmServiceToolkit.Demo.ngApp.Controllers {
	"use strict";

	import Models = ngXrmServiceToolkit.Demo.ngApp.Models;

	export class AboutController {
		static id: string = 'aboutController';
		static $inject: string[] = [ngXrmServiceToolkit.Demo.ngApp.Services.XrmService.id];

		solution: Models.Solution = null;

		constructor(private xrmSvc: ngXrmServiceToolkit.Demo.ngApp.Services.IXrmService) {
			this.activate();
		}

		activate() {
			const self = this;
			
			self.xrmSvc.retrieveSolutionInformation().then((rslt) => {
				self.solution = Models.Solution.Convert(rslt);
			});			
		}
	}

	app.controller(AboutController.id, AboutController);
} 