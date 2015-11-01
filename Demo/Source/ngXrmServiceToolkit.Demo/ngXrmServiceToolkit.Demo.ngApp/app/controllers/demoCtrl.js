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
                var XrmCommon = ngXrm.XrmServiceToolkit.Common;
                var DemoController = (function () {
                    function DemoController($modal, xrmSvc) {
                        var _this = this;
                        this.$modal = $modal;
                        this.xrmSvc = xrmSvc;
                        this._currentUserId = '';
                        this._soapAssociated = false;
                        this._soapAccountActive = true;
                        this._soapContactActive = true;
                        this._soapTeamActive = false;
                        this._soapTeamUseable = false;
                        this._restAssociated = false;
                        this.soapAccountId = '';
                        this.soapContactId = '';
                        this.soapTeamId = '';
                        this.soapTeamMemberId = '';
                        this.restAccountId = '';
                        this.restContactId = '';
                        this.demoSoapFetch = [];
                        this.demoSoapMetadata = [];
                        this.demoSoapAccess = [];
                        this.demoRestFetch = [];
                        this.soapFetchResult = null;
                        this.crmUserList = [];
                        this.crmUserId = '';
                        this.selectUserModalInstance = null;
                        this.initDemoSoapAccount();
                        this.initDemoSoapContact();
                        this.initDemoRestAccount();
                        this.initDemoRestContact();
                        this.xrmSvc.soapGetCurrentUserId()
                            .then(function (rslt) {
                            _this._currentUserId = rslt;
                            _this.initDemoSoapTeam();
                        })
                            .catch(function (error) {
                            console.log(error);
                        });
                        this.activate();
                    }
                    DemoController.prototype.soapAccountExists = function () { return this.soapAccountId !== ''; };
                    DemoController.prototype.soapContactExists = function () { return this.soapContactId !== ''; };
                    DemoController.prototype.soapTeamExists = function () { return this.soapTeamId !== ''; };
                    DemoController.prototype.soapAssociated = function () { return this._soapAssociated; };
                    DemoController.prototype.restAccountExists = function () { return this.restAccountId !== ''; };
                    DemoController.prototype.restContactExists = function () { return this.restContactId != ''; };
                    DemoController.prototype.restAssociated = function () { return this._restAssociated; };
                    DemoController.prototype.initDemoSoapAccount = function () {
                        this.demoSoapAccount = new XrmCommon.BusinessEntity({ logicalName: 'account' });
                        this.demoSoapAccount.attributes["name"] = "Demo Soap Account";
                        this.demoSoapAccount.attributes["description"] = "Description of Demo Soap Account";
                    };
                    DemoController.prototype.initDemoSoapContact = function () {
                        this.demoSoapContact = new XrmCommon.BusinessEntity({ logicalName: 'contact' });
                        this.demoSoapContact.attributes["firstname"] = "John";
                        this.demoSoapContact.attributes["lastname"] = "Demo Soap Contact";
                        this.demoSoapContact.attributes["gendercode"] = { value: 1, type: "OptionSetValue" };
                    };
                    DemoController.prototype.initDemoSoapTeam = function () {
                        var self = this;
                        self.demoSoapTeam = new XrmCommon.BusinessEntity({ logicalName: 'team' });
                        self.demoSoapTeam.attributes["name"] = "Demo Soap Team";
                        self.demoSoapTeam.attributes["teamtype"] = { value: 1, type: "OptionSetValue" }; //1 : Access
                        self.demoSoapTeam.attributes["administratorid"] = { type: "EntityReference", logicalName: "systemuser", id: self._currentUserId };
                        self.xrmSvc.soapGetCurrentUserBusinessUnitId().then(function (rslt) {
                            self.demoSoapTeam.attributes["businessunitid"] = { type: "EntityReference", logicalName: "businessunit", id: rslt };
                            self._soapTeamUseable = true;
                        });
                    };
                    DemoController.prototype.initDemoRestAccount = function () {
                        this.demoRestAccount = {};
                        this.demoRestAccount.Name = "Demo Rest Account";
                        this.demoRestAccount.Description = "Description of Demo Rest Account";
                    };
                    DemoController.prototype.initDemoRestContact = function () {
                        this.demoRestContact = {};
                        this.demoRestContact.FirstName = "John";
                        this.demoRestContact.LastName = "Demo Rest Contact";
                        this.demoRestContact.GenderCode = { Value: 1 };
                    };
                    DemoController.prototype.soapAddSelectedMemberToTeam = function (memberId) {
                        var self = this;
                        self.xrmSvc.soapAddMemberTeamRequest(self.soapTeamId, memberId)
                            .then(function (rslt) {
                            self.soapTeamMemberId = memberId;
                            bootbox.alert("Selected member added to team.");
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapDoAssignRecord = function (entityName, ownerId) {
                        var self = this;
                        if (entityName === "account" ? !self.soapAccountExists() : !self.soapContactExists()) {
                            bootbox.alert([entityName === "account" ? "An " : "A ", entityName, " has not yet been created. Try the create functionality before trying the assign again."].join(""));
                            return;
                        }
                        self.xrmSvc.soapAssign(entityName, entityName === "account" ? self.soapAccountId : self.soapContactId, "systemuser", ownerId)
                            .then(function (rslt) {
                            bootbox.alert(["Demo ", entityName, " assigned to user with id : ", ownerId].join(""));
                            if (entityName === "account")
                                self.soapRetrieveAccount();
                            else
                                self.soapRetrieveContact();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.openSelectUserModal = function (entityName) {
                        var self = this;
                        self.selectUserModalInstance = self.$modal.open({
                            animation: true,
                            templateUrl: "app/html/selectUserModal.html",
                            controller: "selectUserModalController as vm",
                            size: "sm",
                            resolve: {
                                userList: function () {
                                    return self.crmUserList;
                                },
                            }
                        });
                        self.selectUserModalInstance.result.then(function (userId) {
                            if (entityName === 'account' || entityName === 'contact')
                                self.soapDoAssignRecord(entityName, userId);
                            else if (entityName === 'team')
                                self.soapAddSelectedMemberToTeam(userId);
                        }, function (result) {
                            if (result === "cancel") {
                            }
                        });
                    };
                    DemoController.prototype.activate = function () {
                        var self = this;
                        self.xrmSvc.init.then(function (rslt) {
                            self.xrmSvc.retrieveUsers().then(function (users) {
                                self.crmUserList = users;
                            });
                        });
                    };
                    DemoController.prototype.teamStatus = function () {
                        var self = this;
                        return self._soapTeamUseable ? 'Ready' : 'Not Ready';
                    };
                    DemoController.prototype.soapWhoAmI = function () {
                        var self = this;
                        self.xrmSvc.soapWhoAmI()
                            .then(function (rslt) {
                            bootbox.alert(["Who am I : ", rslt].join(""));
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapGetCurrentUserId = function () {
                        var self = this;
                        self.xrmSvc.soapGetCurrentUserId()
                            .then(function (rslt) {
                            bootbox.alert(["Current user id : ", rslt].join(""));
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapGetCurrentUserRoles = function () {
                        var self = this;
                        self.xrmSvc.soapGetCurrentUserRoles()
                            .then(function (rslt) {
                            bootbox.alert(["Current user roles : ", rslt.join("-")].join(""));
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapIsCurrentUserInRole = function () {
                        var self = this;
                        bootbox.prompt("Role to check:", function (rslt) {
                            if (rslt !== null) {
                                self.xrmSvc.soapIsCurrentUserInRole([rslt])
                                    .then(function (result) {
                                    bootbox.alert(["Is current user in role ", rslt, " : ", result.toString()].join(""));
                                })
                                    .catch(function (error) {
                                    bootbox.alert(error);
                                });
                            }
                        });
                    };
                    DemoController.prototype.soapGetCurrentUserBusinessUnitId = function () {
                        var self = this;
                        self.xrmSvc.soapGetCurrentUserBusinessUnitId()
                            .then(function (rslt) {
                            bootbox.alert(["Current user Business Unit id : ", rslt].join(""));
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapFetch = function () {
                        var self = this;
                        var fetchXml = [
                            "<fetch version='1.0' output-format='xml- platform' mapping='logical' distinct='true' page='1' count='10' >",
                            "<entity name='account' >",
                            "<attribute name='accountid' />",
                            "<attribute name='name' />",
                            "<attribute name='primarycontactid' />",
                            "<attribute name='ownerid' />",
                            "attribute name='statecode' />    ",
                            "attribute name='statuscode' />    ",
                            "<order attribute='name' descending= 'false' />",
                            "<filter type='and' >",
                            "<condition attribute='statecode' operator= 'eq' value= '0' />",
                            "</filter>",
                            "</entity>",
                            "</fetch>"
                        ].join("");
                        self.demoSoapFetch = [];
                        self.xrmSvc.soapFetch(fetchXml, false)
                            .then(function (rslt) {
                            self.demoSoapFetch = rslt;
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapQueryByAttribute = function () {
                        var self = this;
                        var queryOptions = new XrmCommon.QueryOptions({
                            entityName: 'contact',
                            attributes: ['firstname'],
                            values: ['john'],
                            columnSet: ['contactid', 'firstname', 'lastname', 'fullname', 'gendercode', 'statecode', 'statuscode', 'ownerid'],
                            orderBy: ['lastname', 'firstname']
                        });
                        self.demoSoapFetch = [];
                        self.xrmSvc.soapQueryByAttribute(queryOptions)
                            .then(function (rslt) {
                            self.demoSoapFetch = rslt;
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapQueryAllByAttribute = function () {
                        var self = this;
                        var queryOptions = new XrmCommon.QueryOptions({
                            entityName: 'contact',
                            attributes: ['firstname'],
                            values: ['john'],
                            columnSet: ['contactid', 'firstname', 'lastname', 'fullname', 'gendercode', 'statecode', 'statuscode', 'ownerid'],
                            orderBy: ['lastname', 'firstname']
                        });
                        self.demoSoapFetch = [];
                        self.xrmSvc.soapQueryAllByAttribute(queryOptions, 10000)
                            .then(function (rslt) {
                            self.demoSoapFetch = rslt;
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapCreateAccount = function () {
                        var self = this;
                        if (self.soapAccountExists()) {
                            bootbox.alert("An account has already been created. Try the delete functionality before trying the create again.");
                            return;
                        }
                        self.xrmSvc.soapCreate(self.demoSoapAccount)
                            .then(function (rslt) {
                            self.soapAccountId = rslt;
                            self.demoSoapAccount.id = rslt;
                            bootbox.alert(["Demo Account created with id : ", rslt].join(""));
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapRetrieveAccount = function () {
                        var self = this;
                        if (!self.soapAccountExists()) {
                            bootbox.alert("An account has not yet been created. Try the create functionality before trying the retrieve again.");
                            return;
                        }
                        self.demoSoapFetch = [];
                        self.xrmSvc.soapRetrieve('account', self.soapAccountId, ['accountid', 'name', 'description', 'primarycontactid', 'statecode', 'statuscode', 'ownerid'])
                            .then(function (rslt) {
                            self.demoSoapFetch.push(rslt);
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapRetrieveMultipleAccounts = function () {
                        var self = this;
                        var query = ["<a:ColumnSet>",
                            "<a:AllColumns>false</a:AllColumns>",
                            "<a:Columns xmlns:b='http://schemas.microsoft.com/2003/10/Serialization/Arrays'>",
                            "<b:string>accountid</b:string>",
                            "<b:string>name</b:string>",
                            "<b:string>description</b:string>",
                            "<b:string>primarycontactid</b:string>",
                            "<b:string>statecode</b:string>",
                            "<b:string>statuscode</b:string>",
                            "<b:string>ownerid</b:string>",
                            "</a:Columns>",
                            "</a:ColumnSet>",
                            "<a:Distinct>false</a:Distinct>",
                            "<a:EntityName>account</a:EntityName>",
                            "<a:LinkEntities />",
                            "<a:Orders />",
                            "<a:PageInfo>",
                            "<a:Count>100</a:Count>",
                            "<a:PageNumber>1</a:PageNumber>",
                            "<a:PagingCookie i:nil='true' />",
                            "<a:ReturnTotalRecordCount>true</a:ReturnTotalRecordCount>",
                            "</a:PageInfo>",
                            "<a:NoLock>false</a:NoLock>"].join("");
                        self.soapFetchResult = [];
                        self.xrmSvc.soapRetrieveMultiple(query)
                            .then(function (rslt) {
                            self.demoSoapFetch = rslt;
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapUpdateAccount = function () {
                        var self = this;
                        if (!self.soapAccountExists()) {
                            bootbox.alert("An account has not yet been created. Try the create functionality before trying the update again.");
                            return;
                        }
                        self.demoSoapAccount.attributes["name"] = [self.demoSoapAccount.attributes["name"], " Update"].join("");
                        self.demoSoapAccount.attributes["description"] = [self.demoSoapAccount.attributes["namedescription"], " Update"].join("");
                        self.xrmSvc.soapUpdate(self.demoSoapAccount)
                            .then(function (rslt) {
                            bootbox.alert(["Demo Account updated with id : ", self.soapAccountId].join(""));
                            self.soapRetrieveAccount();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapDeleteAccount = function () {
                        var self = this;
                        if (!self.soapAccountExists()) {
                            bootbox.alert("An account has not yet been created. Try the create functionality before trying the delete again.");
                            return;
                        }
                        self.xrmSvc.soapDelete('account', self.soapAccountId)
                            .then(function (rslt) {
                            bootbox.alert(["Demo Account deleted with id : ", self.soapAccountId].join(""));
                            self.soapAccountId = '';
                            self.initDemoSoapAccount();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapSetActiveAccount = function () {
                        var self = this;
                        if (!self.soapAccountExists()) {
                            bootbox.alert("An account has not yet been created. Try the create and set inactive functionality before trying the set active again.");
                            return;
                        }
                        if (self._soapAccountActive) {
                            bootbox.alert("The account is already active. Try the set inactive functionality before trying the set active again.");
                            return;
                        }
                        self.xrmSvc.soapSetState('account', self.soapAccountId, 0, 1)
                            .then(function (rslt) {
                            bootbox.alert(["Demo account activated with id : ", self.soapAccountId].join(""));
                            self._soapAccountActive = true;
                            self.soapRetrieveAccount();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapSetInactiveAccount = function () {
                        var self = this;
                        if (!self.soapAccountExists()) {
                            bootbox.alert("An account has not yet been created. Try the create functionality before trying the set inactive again.");
                            return;
                        }
                        if (!self._soapAccountActive) {
                            bootbox.alert("The account is already inactive. Try the set active functionality before trying the set inactive again.");
                            return;
                        }
                        self.xrmSvc.soapSetState('account', self.soapAccountId, 1, 2)
                            .then(function (rslt) {
                            bootbox.alert(["Demo account deactivated with id : ", self.soapAccountId].join(""));
                            self._soapAccountActive = false;
                            self.soapRetrieveAccount();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapAssignAccountToMe = function () {
                        var self = this;
                        self.soapDoAssignRecord('account', self._currentUserId);
                    };
                    DemoController.prototype.soapAssignAccountToAnother = function () {
                        var self = this;
                        self.openSelectUserModal('account');
                    };
                    DemoController.prototype.soapRetrievePrincipalAccessAccountMe = function () {
                        var self = this;
                        if (!self.soapAccountExists()) {
                            bootbox.alert("An account has not yet been created. Try the create functionality before trying the retrievePrincipalAccess again.");
                            return;
                        }
                        var options = new XrmCommon.AccessOptions({
                            targetEntityName: 'account',
                            targetEntityId: self.soapAccountId,
                            principalEntityName: 'systemuser',
                            principalEntityId: self._currentUserId
                        });
                        self.demoSoapAccess = [];
                        self.xrmSvc.soapRetrievePrincipalAccess(options)
                            .then(function (rslt) {
                            self.demoSoapAccess = rslt;
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapCreateTeam = function () {
                        var self = this;
                        if (self.soapTeamExists()) {
                            bootbox.alert("A team has already been created. Try the delete functionality before trying the create again.");
                            return;
                        }
                        self.xrmSvc.soapCreate(self.demoSoapTeam)
                            .then(function (rslt) {
                            self.soapTeamId = rslt;
                            self.demoSoapTeam.id = rslt;
                            bootbox.alert(["Demo Team created with id : ", rslt].join(""));
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapDeleteTeam = function () {
                        var self = this;
                        if (!self.soapTeamExists()) {
                            bootbox.alert("A team has not yet been created. Try the create functionality before trying the delete again.");
                            return;
                        }
                        self.xrmSvc.soapDelete('team', self.soapTeamId)
                            .then(function (rslt) {
                            bootbox.alert(["Demo Team deleted with id : ", self.soapTeamId].join(""));
                            self.soapTeamId = '';
                            self._soapTeamUseable = false;
                            if (self._currentUserId != '')
                                self.initDemoSoapTeam();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapAddMemberTeam = function () {
                        var self = this;
                        if (!self.soapTeamExists()) {
                            bootbox.alert("A team has not yet been created. Try the create functionality before trying the add member again.");
                            return;
                        }
                        self.openSelectUserModal('team');
                    };
                    DemoController.prototype.soapRemoveMemberTeam = function () {
                        var self = this;
                        if (!self.soapTeamExists()) {
                            bootbox.alert("A team has not yet been created. Try the create functionality before trying the remove member again.");
                            return;
                        }
                        if (self.soapTeamMemberId === '') {
                            bootbox.alert("A member has not yet been added to the team. Try the add member before trying the remove member again.");
                            return;
                        }
                        self.xrmSvc.soapRemoveMemberTeamRequest(self.soapTeamId, self.soapTeamMemberId)
                            .then(function (rslt) {
                            self.soapTeamMemberId = '';
                            bootbox.alert("Member removed from team.");
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapRetrievePrincipalAccessAccountTeam = function () {
                        var self = this;
                        if (!self.soapAccountExists()) {
                            bootbox.alert("An account has not yet been created. Try the create functionality before trying the retrievePrincipalAccess again.");
                            return;
                        }
                        if (!self.soapTeamExists()) {
                            bootbox.alert("A team has not yet been created. Create the team before trying the retrievePrincipalAccess again.");
                            return;
                        }
                        var options = new XrmCommon.AccessOptions({
                            targetEntityName: 'account',
                            targetEntityId: self.soapAccountId,
                            principalEntityName: 'team',
                            principalEntityId: self.soapTeamId
                        });
                        self.demoSoapAccess = [];
                        self.xrmSvc.soapRetrievePrincipalAccess(options)
                            .then(function (rslt) {
                            self.demoSoapAccess = rslt;
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapGrantAccessToAccount = function () {
                        var self = this;
                        if (!self.soapAccountExists()) {
                            bootbox.alert("An account has not yet been created. Try the create functionality before trying the revoke access again.");
                            return;
                        }
                        if (!self.soapTeamExists()) {
                            bootbox.alert("A team has not yet been created. Create the team before trying the revoke access again.");
                            return;
                        }
                        var options = new XrmCommon.AccessOptions({
                            targetEntityName: 'account',
                            targetEntityId: self.soapAccountId,
                            principalEntityName: 'team',
                            principalEntityId: self.soapTeamId,
                            accessRights: ["ReadAccess"]
                        });
                        self.xrmSvc.soapGrantAccess(options)
                            .then(function (rslt) {
                            bootbox.alert("Access to the account has been granted for the team.");
                            self.soapRetrievePrincipalAccessAccountTeam();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapModifyAccessToAccount = function () {
                        var self = this;
                        if (!self.soapAccountExists()) {
                            bootbox.alert("An account has not yet been created. Try the create functionality before trying the revoke access again.");
                            return;
                        }
                        if (!self.soapTeamExists()) {
                            bootbox.alert("A team has not yet been created. Create the team before trying the revoke access again.");
                            return;
                        }
                        var options = new XrmCommon.AccessOptions({
                            targetEntityName: 'account',
                            targetEntityId: self.soapAccountId,
                            principalEntityName: 'team',
                            principalEntityId: self.soapTeamId,
                            accessRights: ["AssignAccess", "WriteAccess"]
                        });
                        self.xrmSvc.soapModifyAccess(options)
                            .then(function (rslt) {
                            bootbox.alert("Access to the account has been modified for the team.");
                            self.soapRetrievePrincipalAccessAccountTeam();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapRevokeAccessToAccount = function () {
                        var self = this;
                        if (!self.soapAccountExists()) {
                            bootbox.alert("An account has not yet been created. Try the create functionality before trying the revoke access again.");
                            return;
                        }
                        if (!self.soapTeamExists()) {
                            bootbox.alert("A team has not yet been created. Create the team before trying the revoke access again.");
                            return;
                        }
                        var options = new XrmCommon.AccessOptions({
                            targetEntityName: 'account',
                            targetEntityId: self.soapAccountId,
                            principalEntityName: 'team',
                            principalEntityId: self.soapTeamId
                        });
                        self.xrmSvc.soapRevokeAccess(options)
                            .then(function (rslt) {
                            bootbox.alert("Access to the account has been revoked for the team.");
                            self.soapRetrievePrincipalAccessAccountTeam();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapCreateContact = function () {
                        var self = this;
                        if (self.soapContactExists()) {
                            bootbox.alert("A contact has already been created. Try the delete functionality before trying the create again.");
                            return;
                        }
                        self.xrmSvc.soapCreate(self.demoSoapContact)
                            .then(function (rslt) {
                            self.soapContactId = rslt;
                            self.demoSoapContact.id = rslt;
                            bootbox.alert(["Demo Contact created with id : ", rslt].join(""));
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapRetrieveContact = function () {
                        var self = this;
                        if (!self.soapContactExists()) {
                            bootbox.alert("A contact has not yet been created. Try the create functionality before trying the retrieve again.");
                            return;
                        }
                        self.demoSoapFetch = [];
                        self.xrmSvc.soapRetrieve('contact', self.soapContactId, ['contactid', 'firstname', 'lastname', 'fullname', 'gendercode', 'statecode', 'statuscode', 'ownerid'])
                            .then(function (rslt) {
                            self.demoSoapFetch.push(rslt);
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapRetrieveMultipleContacts = function () {
                        var self = this;
                        var query = ["<a:ColumnSet>",
                            "<a:AllColumns>false</a:AllColumns>",
                            "<a:Columns xmlns:b='http://schemas.microsoft.com/2003/10/Serialization/Arrays'>",
                            "<b:string>contactid</b:string>",
                            "<b:string>firstname</b:string>",
                            "<b:string>lastname</b:string>",
                            "<b:string>fullname</b:string>",
                            "<b:string>gendercode</b:string>",
                            "<b:string>statecode</b:string>",
                            "<b:string>statuscode</b:string>",
                            "<b:string>ownerid</b:string>",
                            "</a:Columns>",
                            "</a:ColumnSet>",
                            "<a:Criteria>",
                            "<a:Conditions />",
                            "<a:FilterOperator>And</a:FilterOperator>",
                            "<a:Filters>",
                            "<a:FilterExpression>",
                            "<a:Conditions>",
                            "<a:ConditionExpression>",
                            "<a:AttributeName>firstname</a:AttributeName>",
                            "<a:Operator>Equal</a:Operator>",
                            "<a:Values xmlns:b='http://schemas.microsoft.com/2003/10/Serialization/Arrays'>",
                            "<b:anyType i:type='c:string' xmlns:c='http://www.w3.org/2001/XMLSchema'>john</b:anyType>",
                            "</a:Values>",
                            "</a:ConditionExpression>",
                            "</a:Conditions>",
                            "<a:FilterOperator>And</a:FilterOperator>",
                            "<a:Filters />",
                            "</a:FilterExpression>",
                            "</a:Filters>",
                            "</a:Criteria>",
                            "<a:Distinct>false</a:Distinct>",
                            "<a:EntityName>contact</a:EntityName>",
                            "<a:LinkEntities />",
                            "<a:Orders />",
                            "<a:PageInfo>",
                            "<a:Count>0</a:Count>",
                            "<a:PageNumber>0</a:PageNumber>",
                            "<a:PagingCookie i:nil='true' />",
                            "<a:ReturnTotalRecordCount>false</a:ReturnTotalRecordCount>",
                            "</a:PageInfo>",
                            "<a:NoLock>false</a:NoLock>"].join("");
                        self.soapFetchResult = [];
                        self.xrmSvc.soapRetrieveMultiple(query)
                            .then(function (rslt) {
                            self.demoSoapFetch = rslt;
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapUpdateContact = function () {
                        var self = this;
                        if (!self.soapContactExists()) {
                            bootbox.alert("A contact has not yet been created. Try the create functionality before trying the update again.");
                            return;
                        }
                        self.demoSoapContact.attributes["firstname"] = [self.demoSoapContact.attributes["firstname"], " Update"].join("");
                        self.xrmSvc.soapUpdate(self.demoSoapContact)
                            .then(function (rslt) {
                            bootbox.alert(["Demo Contact updated with id : ", self.soapContactId].join(""));
                            self.soapRetrieveContact();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapDeleteContact = function () {
                        var self = this;
                        if (!self.soapContactExists()) {
                            bootbox.alert("A contact has not yet been created. Try the create functionality before trying the delete again.");
                            return;
                        }
                        self.xrmSvc.soapDelete('contact', self.soapContactId)
                            .then(function (rslt) {
                            bootbox.alert(["Demo Contact deleted with id : ", self.soapContactId].join(""));
                            self.soapContactId = '';
                            self.initDemoSoapContact();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapSetActiveContact = function () {
                        var self = this;
                        if (!self.soapContactExists()) {
                            bootbox.alert("A contact has not yet been created. Try the create and set inactive functionality before trying the set active again.");
                            return;
                        }
                        if (self._soapContactActive) {
                            bootbox.alert("The contact is already active. Try the set inactive functionality before trying the set active again.");
                            return;
                        }
                        self.xrmSvc.soapSetState('contact', self.soapContactId, 0, 1)
                            .then(function (rslt) {
                            bootbox.alert(["Demo Contact activated with id : ", self.soapContactId].join(""));
                            self._soapContactActive = true;
                            self.soapRetrieveContact();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapSetInactiveContact = function () {
                        var self = this;
                        if (!self.soapContactExists()) {
                            bootbox.alert("A contact has not yet been created. Try the create functionality before trying the set inactive again.");
                            return;
                        }
                        if (!self._soapContactActive) {
                            bootbox.alert("The contact is already inactive. Try the set active functionality before trying the set inactive again.");
                            return;
                        }
                        self.xrmSvc.soapSetState('contact', self.soapContactId, 1, 2)
                            .then(function (rslt) {
                            bootbox.alert(["Demo Contact deactivated with id : ", self.soapContactId].join(""));
                            self._soapContactActive = false;
                            self.soapRetrieveContact();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapAssignContactToMe = function () {
                        var self = this;
                        self.soapDoAssignRecord('contact', self._currentUserId);
                    };
                    DemoController.prototype.soapAssignContactToAnother = function () {
                        var self = this;
                        self.openSelectUserModal('contact');
                    };
                    DemoController.prototype.soapRetrievePrincipalAccessContact = function () {
                        var self = this;
                        if (!self.soapContactExists()) {
                            bootbox.alert("A contact has not yet been created. Try the create functionality before trying the retrievePrincipalAccess again.");
                            return;
                        }
                        var options = new XrmCommon.AccessOptions({
                            targetEntityName: 'contact',
                            targetEntityId: self.soapContactId,
                            principalEntityName: 'systemuser',
                            principalEntityId: self._currentUserId
                        });
                        self.demoSoapAccess = [];
                        self.xrmSvc.soapRetrievePrincipalAccess(options)
                            .then(function (rslt) {
                            self.demoSoapAccess = rslt;
                            //let msg: string = ["Access Rights :<br />", rslt.join("<br />")].join("");
                            //bootbox.alert(msg);
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapAssociate = function () {
                        var self = this;
                        if (!self.soapAccountExists() || !self.soapContactExists()) {
                            bootbox.alert("You must first create the account and the contact in the SOAP section before you can try the associate functionality.");
                            return;
                        }
                        if (!self._soapAccountActive || !self._soapContactActive) {
                            bootbox.alert("Make sure both the account and the contact in the SOAP section are in state: Active!");
                            return;
                        }
                        if (self.soapAssociated()) {
                            bootbox.alert("The account and contact are already associated. Try the disassociate functionality before trying the associate again.");
                            return;
                        }
                        self.xrmSvc.soapAssociate('account_primary_contact', 'contact', self.soapContactId, 'account', [self.demoSoapAccount])
                            .then(function (rslt) {
                            bootbox.alert("The soap account and contact have been associated.");
                            self._soapAssociated = true;
                            self.soapRetrieveAccount();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapDisassociate = function () {
                        var self = this;
                        if (!self._soapAccountActive || !self._soapContactActive) {
                            bootbox.alert("Make sure both the account and the contact in the SOAP section are in state: Active!");
                            return;
                        }
                        if (!self.soapAssociated()) {
                            bootbox.alert("The account and contact are not yet associated. Try the associate functionality before trying the disassociate again.");
                            return;
                        }
                        self.xrmSvc.soapDisassociate('account_primary_contact', 'contact', self.soapContactId, 'account', [self.demoSoapAccount])
                            .then(function (rslt) {
                            bootbox.alert("The soap account and contact have been disassociated.");
                            self._soapAssociated = false;
                            self.soapRetrieveAccount();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapRetrieveAllEntityMetadata = function () {
                        var self = this;
                        self.demoSoapMetadata = [];
                        self.xrmSvc.soapRetrieveAllEntityMetadataNgXrmServiceToolkit()
                            .then(function (rslt) {
                            self.demoSoapMetadata = rslt;
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapRetrieveEntityMetadata = function () {
                        var self = this;
                        self.demoSoapMetadata = [];
                        self.xrmSvc.soapRetrieveEntityMetadata('account')
                            .then(function (rslt) {
                            self.demoSoapMetadata = rslt;
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.soapRetrieveAttributeMetadata = function () {
                        var self = this;
                        self.demoSoapMetadata = [];
                        self.xrmSvc.soapRetrieveAttributeMetadata('account', 'primarycontactid')
                            .then(function (rslt) {
                            self.demoSoapMetadata = rslt;
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.restRetrieveMultiple = function () {
                        var self = this;
                        self.demoRestFetch = [];
                        self.xrmSvc.restRetrieveMultiple('Account', '$top=10&$select=AccountId,Name,Description,PrimaryContactId')
                            .then(function (rslt) {
                            self.demoRestFetch = rslt;
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.restCreateAccount = function () {
                        var self = this;
                        if (self.restAccountExists()) {
                            bootbox.alert("An account has already been created. Try the delete functionality before trying the create again.");
                            return;
                        }
                        self.xrmSvc.restCreate('Account', self.demoRestAccount)
                            .then(function (rslt) {
                            self.restAccountId = rslt.AccountId;
                            self.demoRestAccount.AccountId = rslt.AccountId;
                            bootbox.alert(["Demo Account created with id : ", rslt.AccountId].join(""));
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.restRetrieveAccount = function () {
                        var self = this;
                        if (!self.restAccountExists()) {
                            bootbox.alert("An account has not yet been created. Try the create functionality before trying the retrieve again.");
                            return;
                        }
                        self.demoRestFetch = [];
                        self.xrmSvc.restRetrieve(self.restAccountId, 'Account', ["AccountId", "Name", "Description", "PrimaryContactId"], null)
                            .then(function (rslt) {
                            self.demoRestFetch.push(rslt);
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.restUpdateAccount = function () {
                        var self = this;
                        if (!self.restAccountExists()) {
                            bootbox.alert("An account has not yet been created. Try the create functionality before trying the update again.");
                            return;
                        }
                        this.demoRestAccount.Name = "Demo Rest Account Update";
                        this.demoRestAccount.Description = "Description of Demo Rest Account Update";
                        self.xrmSvc.restUpdate(self.restAccountId, 'Account', self.demoRestAccount)
                            .then(function (rslt) {
                            bootbox.alert(["Demo Account updated with id : ", self.restAccountId].join(""));
                            self.restRetrieveAccount();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.restDeleteAccount = function () {
                        var self = this;
                        if (!self.restAccountExists()) {
                            bootbox.alert("An account has not yet been created. Try the create functionality before trying the delete again.");
                            return;
                        }
                        self.xrmSvc.restDelete(self.restAccountId, 'Account')
                            .then(function (rslt) {
                            bootbox.alert(["Demo Account deleted with id : ", self.restAccountId].join(""));
                            self.restAccountId = '';
                            self.initDemoRestAccount();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.restCreateContact = function () {
                        var self = this;
                        if (self.restContactExists()) {
                            bootbox.alert("A contact has already been created. Try the delete functionality before trying the create again.");
                            return;
                        }
                        self.xrmSvc.restCreate('Contact', self.demoRestContact)
                            .then(function (rslt) {
                            self.restContactId = rslt.ContactId;
                            self.demoRestContact.ContactId = rslt.ContactId;
                            bootbox.alert(["Demo Contact created with id : ", rslt.ContactId].join(""));
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.restRetrieveContact = function () {
                        var self = this;
                        if (!self.restContactExists()) {
                            bootbox.alert("A contact has not yet been created. Try the create functionality before trying the retrieve again.");
                            return;
                        }
                        self.demoRestFetch = [];
                        self.xrmSvc.restRetrieve(self.restContactId, 'Contact', ["ContactId", "FirstName", "LastName", "FullName", "GenderCode"], null)
                            .then(function (rslt) {
                            self.demoRestFetch.push(rslt);
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.restUpdateContact = function () {
                        var self = this;
                        if (!self.restContactExists()) {
                            bootbox.alert("A contact has not yet been created. Try the create functionality before trying the update again.");
                            return;
                        }
                        this.demoRestContact.FirstName = "John Update";
                        self.xrmSvc.restUpdate(self.restContactId, 'Contact', self.demoRestContact)
                            .then(function (rslt) {
                            bootbox.alert(["Demo Contact updated with id : ", self.restContactId].join(""));
                            self.restRetrieveContact();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.restDeleteContact = function () {
                        var self = this;
                        if (!self.restContactExists()) {
                            bootbox.alert("A contact has not yet been created. Try the create functionality before trying the delete again.");
                            return;
                        }
                        self.xrmSvc.restDelete(self.restContactId, 'Contact')
                            .then(function (rslt) {
                            bootbox.alert(["Demo Contact deleted with id : ", self.restContactId].join(""));
                            self.restContactId = '';
                            self.initDemoRestContact();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.restAssociate = function () {
                        var self = this;
                        if (!self.restAccountExists() || !self.restContactExists()) {
                            bootbox.alert("You must first create the account and the contact in the REST section before you can try the associate functionality.");
                            return;
                        }
                        if (self.restAssociated()) {
                            bootbox.alert("The account and contact are already associated. Try the disassociate functionality before trying the associate again.");
                            return;
                        }
                        self.xrmSvc.restAssociate(self.restContactId, 'Contact', self.restAccountId, 'Account', 'account_primary_contact')
                            .then(function (rslt) {
                            bootbox.alert("The rest account and contact have been associated.");
                            self._restAssociated = true;
                            self.restRetrieveAccount();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.prototype.restDisassociate = function () {
                        var self = this;
                        if (!self.restAssociated()) {
                            bootbox.alert("The account and contact are not yet associated. Try the associate functionality before trying the disassociate again.");
                            return;
                        }
                        self.xrmSvc.restDisassociate(self.restContactId, 'Contact', self.restAccountId, 'account_primary_contact')
                            .then(function (rslt) {
                            bootbox.alert("The rest account and contact have been disassociated.");
                            self._restAssociated = false;
                            self.restRetrieveAccount();
                        })
                            .catch(function (error) {
                            bootbox.alert(error);
                        });
                    };
                    DemoController.id = "demoController";
                    DemoController.$inject = ["$modal", ngXrmServiceToolkit.Demo.ngApp.Services.XrmService.id];
                    return DemoController;
                })();
                Controllers.DemoController = DemoController;
                ngApp.app.controller(DemoController.id, DemoController);
            })(Controllers = ngApp.Controllers || (ngApp.Controllers = {}));
        })(ngApp = Demo.ngApp || (Demo.ngApp = {}));
    })(Demo = ngXrmServiceToolkit.Demo || (ngXrmServiceToolkit.Demo = {}));
})(ngXrmServiceToolkit || (ngXrmServiceToolkit = {}));
//# sourceMappingURL=demoCtrl.js.map