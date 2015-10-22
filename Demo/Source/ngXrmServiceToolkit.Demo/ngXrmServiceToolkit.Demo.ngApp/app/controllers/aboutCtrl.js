/// <reference path="../_app.ts" />
var ngXrmServiceToolkit;
(function (ngXrmServiceToolkit) {
    var Demo;
    (function (Demo) {
        var ngApp;
        (function (ngApp) {
            var Controllers;
            (function (Controllers) {
                "use strict";
                var Models = ngXrmServiceToolkit.Demo.ngApp.Models;
                var AboutController = (function () {
                    function AboutController(xrmSvc) {
                        this.xrmSvc = xrmSvc;
                        this.solution = null;
                        this.activate();
                    }
                    AboutController.prototype.activate = function () {
                        var self = this;
                        self.xrmSvc.retrieveSolutionInformation().then(function (rslt) {
                            self.solution = Models.Solution.Convert(rslt);
                        });
                    };
                    AboutController.id = 'aboutController';
                    AboutController.$inject = [ngXrmServiceToolkit.Demo.ngApp.Services.XrmService.id];
                    return AboutController;
                })();
                Controllers.AboutController = AboutController;
                ngApp.app.controller(AboutController.id, AboutController);
            })(Controllers = ngApp.Controllers || (ngApp.Controllers = {}));
        })(ngApp = Demo.ngApp || (Demo.ngApp = {}));
    })(Demo = ngXrmServiceToolkit.Demo || (ngXrmServiceToolkit.Demo = {}));
})(ngXrmServiceToolkit || (ngXrmServiceToolkit = {}));
//# sourceMappingURL=aboutCtrl.js.map