/// <reference path="../_app.ts" />
var ngXrmServiceToolkit;
(function (ngXrmServiceToolkit) {
    var Demo;
    (function (Demo) {
        var ngApp;
        (function (ngApp) {
            var Services;
            (function (Services) {
                var XrmService = (function () {
                    function XrmService($q, ngXrmSoapSvc, ngXrmRestSvc) {
                        this.$q = $q;
                        this.ngXrmSoapSvc = ngXrmSoapSvc;
                        this.ngXrmRestSvc = ngXrmRestSvc;
                        this.userList = [];
                        var asyncFn1 = this.retrieveUsers();
                        this.init = Q.all([asyncFn1]);
                    }
                    XrmService.prototype.retrieveSolutionInformation = function () {
                        var self = this;
                        var fetchXml = [
                            "<fetch mapping='logical'>",
                            "<entity name='solution'>",
                            "<all-attributes />",
                            "<filter>",
                            "<condition attribute='uniquename' operator='eq' value='ngXrmServiceToolkitDemo' />",
                            "</filter>",
                            "</entity></fetch>"
                        ].join("");
                        var thisSolution = null;
                        return self.ngXrmSoapSvc.fetch(fetchXml, true).then(function (rslt) {
                            var retrievedSolutions = rslt;
                            if (retrievedSolutions != null && retrievedSolutions.length > 0)
                                thisSolution = retrievedSolutions[0];
                            return thisSolution;
                        });
                    };
                    XrmService.prototype.retrieveUsers = function () {
                        var self = this;
                        if (self.userList.length === 0) {
                            var fetchXml = [
                                "<fetch mapping='logical'>",
                                "<entity name='systemuser'>",
                                "<attribute name='systemuserid' />",
                                "<attribute name='fullname' />",
                                "<filter>",
                                "<condition attribute='isdisabled' operator='eq' value='0' />",
                                "</filter>",
                                "<order attribute='fullname' descending= 'false' />",
                                "</entity></fetch>"
                            ].join("");
                            return self.ngXrmSoapSvc.fetch(fetchXml, true)
                                .then(function (rslt) {
                                self.userList = rslt;
                                return self.userList;
                            })
                                .catch(function (error) {
                                console.log(error);
                                return Q.reject("An error occurred while getting all users.");
                            });
                        }
                        else {
                            return Q.resolve(self.userList);
                        }
                    };
                    //Demo
                    //-Soap
                    //--General
                    XrmService.prototype.soapWhoAmI = function () {
                        var self = this;
                        var request = ["<request i:type='b:WhoAmIRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
                            "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />",
                            "<a:RequestId i:nil='true' />",
                            "<a:RequestName>WhoAmI</a:RequestName>",
                            "</request>"].join("");
                        return self.ngXrmSoapSvc.execute(request)
                            .then(function (rslt) {
                            var whoamiId = rslt.getElementsByTagName("a:Results")[0].childNodes[0].childNodes[1].text;
                            return whoamiId;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while executing the Who Am I request.");
                        });
                        bootbox.alert("soapWhoAmI");
                    };
                    XrmService.prototype.soapGetCurrentUserId = function () {
                        var self = this;
                        return self.ngXrmSoapSvc.getCurrentUserId()
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while executing the getCurrentUserId request.");
                        });
                    };
                    XrmService.prototype.soapGetCurrentUserRoles = function () {
                        var self = this;
                        return self.ngXrmSoapSvc.getCurrentUserRoles()
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while executing the getCurrentUserRoles request.");
                        });
                    };
                    XrmService.prototype.soapIsCurrentUserInRole = function (args) {
                        var self = this;
                        return self.ngXrmSoapSvc.isCurrentUserInRole(args)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while executing the isCurrentUserInRole request.");
                        });
                    };
                    XrmService.prototype.soapGetCurrentUserBusinessUnitId = function () {
                        var self = this;
                        return self.ngXrmSoapSvc.getCurrentUserBusinessUnitId()
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while executing the getCurrentUserBusinessUnitId request.");
                        });
                    };
                    XrmService.prototype.soapFetch = function (fetchXml, fetchAll, maxFetch) {
                        var self = this;
                        return self.ngXrmSoapSvc.fetch(fetchXml, fetchAll, maxFetch)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while executing the fetch request.");
                        });
                    };
                    XrmService.prototype.soapQueryByAttribute = function (queryOptions) {
                        var self = this;
                        return self.ngXrmSoapSvc.queryByAttribute(queryOptions)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while executing the queryByAttribute request.");
                        });
                    };
                    XrmService.prototype.soapQueryAllByAttribute = function (queryOptions, maxRecords) {
                        var self = this;
                        return self.ngXrmSoapSvc.queryAllByAttribute(queryOptions, maxRecords)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while executing the queryAllByAttribute request.");
                        });
                    };
                    //--Record
                    XrmService.prototype.soapCreate = function (entity) {
                        var self = this;
                        return self.ngXrmSoapSvc.createEntity(entity)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while creating the entity.");
                        });
                    };
                    XrmService.prototype.soapRetrieve = function (entityName, entityId, columnSet) {
                        var self = this;
                        return self.ngXrmSoapSvc.retrieveEntity(entityName, entityId, columnSet)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while retrieving the entity.");
                        });
                    };
                    XrmService.prototype.soapRetrieveMultiple = function (query) {
                        var self = this;
                        return self.ngXrmSoapSvc.retrieveMultiple(query)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while executing the RetrieveMultiple.");
                        });
                    };
                    XrmService.prototype.soapUpdate = function (entity) {
                        var self = this;
                        return self.ngXrmSoapSvc.updateEntity(entity)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while updating the entity.");
                        });
                    };
                    XrmService.prototype.soapDelete = function (entityName, entityId) {
                        var self = this;
                        return self.ngXrmSoapSvc.deleteEntity(entityName, entityId)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while deleting the entity.");
                        });
                    };
                    XrmService.prototype.soapSetState = function (entityName, id, stateCode, statusCode) {
                        var self = this;
                        return self.ngXrmSoapSvc.setState(entityName, id, stateCode, statusCode)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while setting the state of the entity.");
                        });
                    };
                    XrmService.prototype.soapAssign = function (targetEntityName, targetId, assigneeEntityName, assigneeId) {
                        var self = this;
                        return self.ngXrmSoapSvc.assign(targetEntityName, targetId, assigneeEntityName, assigneeId)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while assigning the entity.");
                        });
                    };
                    XrmService.prototype.soapAssociate = function (relationshipName, targetEntityName, targetId, relatedEntityName, relatedBusinessEntities) {
                        var self = this;
                        return self.ngXrmSoapSvc.associate(relationshipName, targetEntityName, targetId, relatedEntityName, relatedBusinessEntities)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while creating the association.");
                        });
                    };
                    XrmService.prototype.soapDisassociate = function (relationshipName, targetEntityName, targetId, relatedEntityName, relatedBusinessEntities) {
                        var self = this;
                        return self.ngXrmSoapSvc.disassociate(relationshipName, targetEntityName, targetId, relatedEntityName, relatedBusinessEntities)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurrred while deleting the association.");
                        });
                    };
                    //--Metadata
                    XrmService.prototype.soapRetrieveAllEntityMetadataNgXrmServiceToolkit = function () {
                        var self = this;
                        return self.ngXrmSoapSvc.retrieveAllEntitiesMetadata(["Entity"], true)
                            .then(function (rslt) {
                            return rslt;
                        }).catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurrred while retrieving all entity metadata.");
                        });
                    };
                    XrmService.prototype.soapRetrieveEntityMetadata = function (logicalName) {
                        var self = this;
                        return self.ngXrmSoapSvc.retrieveEntityMetadata(["Entity", "Attributes"], logicalName, true)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject(["An error occurrred while retrieving entity metadata for ", logicalName, "."].join(""));
                        });
                    };
                    XrmService.prototype.soapRetrieveAttributeMetadata = function (entityLogicalName, attributeLogicalName) {
                        var self = this;
                        return self.ngXrmSoapSvc.retrieveAttributeMetadata(entityLogicalName, attributeLogicalName, true)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject(["An error occurrred while retrieving entity metadata for ", entityLogicalName, " and attribute ", attributeLogicalName, "."].join(""));
                        });
                    };
                    //-Rest
                    //--General
                    XrmService.prototype.restRetrieveMultiple = function (type, options) {
                        var self = this;
                        return self.ngXrmRestSvc.retrieveMultipleRecords(type, options)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while performing the RetrieveMultiple.");
                        });
                    };
                    //--Record
                    XrmService.prototype.restCreate = function (type, object) {
                        var self = this;
                        return self.ngXrmRestSvc.createRecord(type, object)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while creating the entity.");
                        });
                    };
                    XrmService.prototype.restRetrieve = function (id, type, select, expand) {
                        var self = this;
                        return self.ngXrmRestSvc.retrieveRecord(id, type, select, expand)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while retrieving the entity.");
                        });
                    };
                    XrmService.prototype.restUpdate = function (id, type, object) {
                        var self = this;
                        return self.ngXrmRestSvc.updateRecord(id, type, object)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while updating the entity.");
                        });
                    };
                    XrmService.prototype.restDelete = function (id, type) {
                        var self = this;
                        return self.ngXrmRestSvc.deleteRecord(id, type)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while deleting the entity.");
                        });
                    };
                    XrmService.prototype.restAssociate = function (entityid1, odataSetName1, entityid2, odataSetName2, relationship) {
                        var self = this;
                        return self.ngXrmRestSvc.associateRecord(entityid1, odataSetName1, entityid2, odataSetName2, relationship)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while creating the association.");
                        });
                    };
                    XrmService.prototype.restDisassociate = function (entityid1, odataSetName, entityid2, relationship) {
                        var self = this;
                        return self.ngXrmRestSvc.disassociateRecord(entityid1, odataSetName, entityid2, relationship)
                            .then(function (rslt) {
                            return rslt;
                        })
                            .catch(function (error) {
                            console.log(error);
                            return Q.reject("An error occurred while deleting the association.");
                        });
                    };
                    XrmService.id = "xrmService";
                    XrmService.$inject = ["$q", "ngXrmServiceToolkitSoap", "ngXrmServiceToolkitRest"];
                    return XrmService;
                })();
                Services.XrmService = XrmService;
                ngApp.app.service(XrmService.id, XrmService);
            })(Services = ngApp.Services || (ngApp.Services = {}));
        })(ngApp = Demo.ngApp || (Demo.ngApp = {}));
    })(Demo = ngXrmServiceToolkit.Demo || (ngXrmServiceToolkit.Demo = {}));
})(ngXrmServiceToolkit || (ngXrmServiceToolkit = {}));
//# sourceMappingURL=XrmService.js.map