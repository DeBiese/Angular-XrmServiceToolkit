/// <reference path="../_app.ts" />
var ngXrmServiceToolkit;
(function (ngXrmServiceToolkit) {
    var Demo;
    (function (Demo) {
        var ngApp;
        (function (ngApp) {
            var Models;
            (function (Models) {
                var Solution = (function () {
                    function Solution(solution) {
                        if (solution != null) {
                            this.createdOn = solution.createdOn;
                            this.description = solution.description;
                            this.uniqueName = solution.uniqueName;
                            this.friendlyName = solution.friendlyName;
                            this.version = solution.version;
                        }
                    }
                    Solution.Convert = function (businessEntity) {
                        var result = new Solution();
                        if (businessEntity != null && businessEntity.logicalName === "solution" && businessEntity.attributes != null) {
                            if (businessEntity.attributes["createdon"] !== undefined)
                                result.createdOn = businessEntity.attributes["createdon"].value;
                            if (businessEntity.attributes["description"] !== undefined)
                                result.description = businessEntity.attributes["description"].value;
                            if (businessEntity.attributes["uniquename"] !== undefined)
                                result.uniqueName = businessEntity.attributes["uniquename"].value;
                            if (businessEntity.attributes["friendlyname"] !== undefined)
                                result.friendlyName = businessEntity.attributes["friendlyname"].value;
                            if (businessEntity.attributes["version"] !== undefined)
                                result.version = businessEntity.attributes["version"].value;
                        }
                        return result;
                    };
                    return Solution;
                })();
                Models.Solution = Solution;
            })(Models = ngApp.Models || (ngApp.Models = {}));
        })(ngApp = Demo.ngApp || (Demo.ngApp = {}));
    })(Demo = ngXrmServiceToolkit.Demo || (ngXrmServiceToolkit.Demo = {}));
})(ngXrmServiceToolkit || (ngXrmServiceToolkit = {}));
//# sourceMappingURL=Solution.js.map