var ngXrmServiceToolkit;
(function (ngXrmServiceToolkit) {
    var Demo;
    (function (Demo) {
        var ngApp;
        (function (ngApp) {
            var Controllers;
            (function (Controllers) {
                "use strict";
                var SelectUserModalController = (function () {
                    function SelectUserModalController(userList) {
                        this.crmUserId = '';
                        this.crmUserList = userList;
                    }
                    SelectUserModalController.id = "selectUserModalController";
                    return SelectUserModalController;
                })();
                Controllers.SelectUserModalController = SelectUserModalController;
                ngApp.app.controller(SelectUserModalController.id, SelectUserModalController);
            })(Controllers = ngApp.Controllers || (ngApp.Controllers = {}));
        })(ngApp = Demo.ngApp || (Demo.ngApp = {}));
    })(Demo = ngXrmServiceToolkit.Demo || (ngXrmServiceToolkit.Demo = {}));
})(ngXrmServiceToolkit || (ngXrmServiceToolkit = {}));
//# sourceMappingURL=selectUserModalCtrl.js.map