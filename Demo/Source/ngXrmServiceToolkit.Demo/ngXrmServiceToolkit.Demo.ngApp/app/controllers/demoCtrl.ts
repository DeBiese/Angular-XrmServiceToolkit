/// <reference path="../_app.ts" />

module ngXrmServiceToolkit.Demo.ngApp.Controllers {
	"use strict";

	import XrmCommon = ngXrm.XrmServiceToolkit.Common;

	export interface IDemoController {
		soapWhoAmI: () => void;
		soapGetCurrentUserId: () => void;
		soapGetCurrentUserRoles: () => void;
		soapIsCurrentUserInRole: () => void;
		soapGetCurrentUserBusinessUnitId: () => void;
		soapFetch: () => void;
		soapQueryByAttribute: () => void;
		soapQueryAllByAttribute: () => void;

		soapCreateAccount: () => void;
		soapRetrieveAccount: () => void;
		soapRetrieveMultipleAccounts: () => void;
		soapUpdateAccount: () => void;
		soapDeleteAccount: () => void;
		soapSetActiveAccount: () => void;
		soapSetInactiveAccount: () => void;
		soapAssignAccountToMe: () => void;
		soapAssignAccountToAnother: () => void;
		soapRetrievePrincipalAccessAccount: () => void;

		soapCreateContact: () => void;
		soapRetrieveContact: () => void;
		soapRetrieveMultipleContacts: () => void;
		soapUpdateContact: () => void;
		soapDeleteContact: () => void;
		soapSetActiveContact: () => void;
		soapSetInactiveContact: () => void;
		soapAssignContactToMe: () => void;
		soapAssignContactToAnother: () => void;
		soapRetrievePrincipalAccessContact: () => void;

		soapAssociate: () => void;
		soapDisassociate: () => void;

		soapRetrieveAllEntityMetadata: () => void;
		soapRetrieveEntityMetadata: () => void;
		soapRetrieveAttributeMetadata: () => void;

		restRetrieveMultiple: () => void;

		restCreateAccount: () => void;
		restRetrieveAccount: () => void;
		restUpdateAccount: () => void;
		restDeleteAccount: () => void;
		restCreateContact: () => void;
		restRetrieveContact: () => void;
		restUpdateContact: () => void;
		restDeleteContact: () => void;

		restAssociate: () => void;
		restDisassociate: () => void;
	}

	export class DemoController implements IDemoController {
		static id: string = "demoController";

		private _currentUserId: string = '';

		private _soapAssociated: boolean = false;
		private _soapAccountActive: boolean = true;
		private _soapContactActive: boolean = true;
		private _restAssociated: boolean = false;		

		private soapAccountExists(): boolean { return this.soapAccountId !== ''; }
		private soapContactExists(): boolean { return this.soapContactId !== ''; }
		private soapAssociated(): boolean { return this._soapAssociated; }

		private restAccountExists(): boolean { return this.restAccountId !== ''; }
		private restContactExists(): boolean { return this.restContactId != ''; }
		private restAssociated(): boolean { return this._restAssociated; }

		private soapAccountId: string = '';
		private soapContactId: string = '';
		private restAccountId: string = '';
		private restContactId: string = '';

		demoSoapAccount: XrmCommon.BusinessEntity;
		demoSoapContact: XrmCommon.BusinessEntity;
		demoSoapFetch: XrmCommon.BusinessEntity[] = [];
		demoSoapMetadata: XrmCommon.IMetadata[] = [];
		demoRestAccount: any;
		demoRestContact: any;
		demoRestFetch: any[] = [];

		soapFetchResult: XrmCommon.BusinessEntity[] = null;	
		
		crmUserList: XrmCommon.BusinessEntity[] = [];	
		crmUserId: string = '';
		selectUserModalInstance: any = null;
		
		static $inject: string[] = ["$modal", ngXrmServiceToolkit.Demo.ngApp.Services.XrmService.id];
		constructor(private $modal: any, private xrmSvc: ngXrmServiceToolkit.Demo.ngApp.Services.IXrmService) {
			this.initDemoSoapAccount();
			this.initDemoSoapContact();
			this.initDemoRestAccount();
			this.initDemoRestContact();

			this.xrmSvc.soapGetCurrentUserId()
				.then((rslt) => {
					this._currentUserId = rslt;
				})
				.catch((error) => {
					console.log(error);
				});

			this.activate();
		}

		private initDemoSoapAccount() {
			this.demoSoapAccount = new XrmCommon.BusinessEntity({ logicalName: 'account' });
			this.demoSoapAccount.attributes["name"] = "Demo Soap Account";
			this.demoSoapAccount.attributes["description"] = "Description of Demo Soap Account";
		}

		private initDemoSoapContact() {
			this.demoSoapContact = new XrmCommon.BusinessEntity({ logicalName: 'contact' });
			this.demoSoapContact.attributes["firstname"] = "John";
			this.demoSoapContact.attributes["lastname"] = "Demo Soap Contact";
			this.demoSoapContact.attributes["gendercode"] = { value: 1, type: "OptionSetValue" };
		}

		private initDemoRestAccount() {
			this.demoRestAccount = {};
			this.demoRestAccount.Name = "Demo Rest Account";
			this.demoRestAccount.Description = "Description of Demo Rest Account";
		}

		private initDemoRestContact() {
			this.demoRestContact = {};
			this.demoRestContact.FirstName = "John";
			this.demoRestContact.LastName = "Demo Rest Contact";
			this.demoRestContact.GenderCode = { Value: 1 };
		}

		private soapDoAssignAccount(entityName: string, ownerId: string) {
			const self = this;

			if (entityName === "account" ? !self.soapAccountExists() : !self.soapContactExists()) {
				bootbox.alert([entityName === "account" ? "An " : "A ", entityName, " has not yet been created. Try the create functionality before trying the assign again."].join(""));
				return;
			}

			self.xrmSvc.soapAssign(entityName, entityName === "account" ? self.soapAccountId : self.soapContactId, "systemuser", ownerId)
				.then((rslt) => {
					bootbox.alert(["Demo ", entityName, " assigned to user with id : ", ownerId].join(""));
					if (entityName === "account")
						self.soapRetrieveAccount();
					else
						self.soapRetrieveContact();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		private openSelectUserModal(entityName: string): void {
			const self = this;
			self.selectUserModalInstance = self.$modal.open({
				animation: true,
				templateUrl: "app/html/selectUserModal.html",
				controller: "selectUserModalController as vm",
				size: "sm",
				resolve: {
					userList() {
						return self.crmUserList;
					},
				}
			});

			self.selectUserModalInstance.result.then(
				function (userId: string) {
					self.soapDoAssignAccount(entityName, userId);
				},
				function (result: any) {
					if (result === "cancel") {
						//Do Nothing
					}
				});
		}

		activate() {
			const self = this;
			self.xrmSvc.init.then((rslt) => {
				self.xrmSvc.retrieveUsers().then((users) => {
					self.crmUserList = users;
				});
			});
		}

		soapWhoAmI(): void {
			const self = this;
			self.xrmSvc.soapWhoAmI()
				.then((rslt) => {
					bootbox.alert(["Who am I : ", rslt].join(""));
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapGetCurrentUserId(): void {
			const self = this;
			self.xrmSvc.soapGetCurrentUserId()
				.then((rslt) => {
					bootbox.alert(["Current user id : ", rslt].join(""));
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapGetCurrentUserRoles(): void {
			const self = this;
			self.xrmSvc.soapGetCurrentUserRoles()
				.then((rslt) => {
					bootbox.alert(["Current user roles : ", rslt.join("-")].join(""));
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapIsCurrentUserInRole(): void {
			const self = this;
			bootbox.prompt("Role to check:", (rslt) => {
				if (rslt !== null) {
					self.xrmSvc.soapIsCurrentUserInRole([rslt])
						.then((result) => {
							bootbox.alert(["Is current user in role ", rslt, " : ", result.toString()].join(""));
						})
						.catch((error) => {
							bootbox.alert(error);
						});
				}
			});
		}
		soapGetCurrentUserBusinessUnitId(): void {
			const self = this;
			self.xrmSvc.soapGetCurrentUserBusinessUnitId()
				.then((rslt) => {
					bootbox.alert(["Current user Business Unit id : ", rslt].join(""));
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapFetch(): void {
			const self = this;
			let fetchXml: string = [
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
				.then((rslt) => {
					self.demoSoapFetch = rslt;
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapQueryByAttribute(): void {
			const self = this;
			let queryOptions: XrmCommon.QueryOptions = new XrmCommon.QueryOptions({
				entityName: 'contact',
				attributes: ['firstname'],
				values: ['john'],
				columnSet: ['contactid', 'firstname', 'lastname', 'fullname', 'gendercode', 'statecode', 'statuscode', 'ownerid'],
				orderBy: ['lastname', 'firstname']
			});

			self.demoSoapFetch = [];
			self.xrmSvc.soapQueryByAttribute(queryOptions)
				.then((rslt) => {
					self.demoSoapFetch = rslt;
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapQueryAllByAttribute(): void {
			const self = this;
			let queryOptions: XrmCommon.QueryOptions = new XrmCommon.QueryOptions({
				entityName: 'contact',
				attributes: ['firstname'],
				values: ['john'],
				columnSet: ['contactid', 'firstname', 'lastname', 'fullname', 'gendercode', 'statecode', 'statuscode', 'ownerid'],
				orderBy: ['lastname', 'firstname']
			});

			self.demoSoapFetch = [];
			self.xrmSvc.soapQueryAllByAttribute(queryOptions, 10000)
				.then((rslt) => {
					self.demoSoapFetch = rslt;
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}


		soapCreateAccount(): void {
			const self = this;

			if (self.soapAccountExists()) {
				bootbox.alert("An account has already been created. Try the delete functionality before trying the create again.");
				return;
			}

			self.xrmSvc.soapCreate(self.demoSoapAccount)
				.then((rslt) => {
					self.soapAccountId = rslt;
					self.demoSoapAccount.id = rslt;
					bootbox.alert(["Demo Account created with id : ", rslt].join(""));
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapRetrieveAccount(): void {
			const self = this;

			if (!self.soapAccountExists()) {
				bootbox.alert("An account has not yet been created. Try the create functionality before trying the retrieve again.");
				return;
			}

			self.demoSoapFetch = [];
			self.xrmSvc.soapRetrieve('account', self.soapAccountId, ['accountid', 'name', 'description', 'primarycontactid', 'statecode', 'statuscode', 'ownerid'])
				.then((rslt) => {
					self.demoSoapFetch.push(rslt);
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapRetrieveMultipleAccounts(): void {
			const self = this;

			let query: string =
				["<a:ColumnSet>",
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
				.then((rslt) => {
					self.demoSoapFetch = rslt;
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapUpdateAccount(): void {
			const self = this;

			if (!self.soapAccountExists()) {
				bootbox.alert("An account has not yet been created. Try the create functionality before trying the update again.");
				return;
			}

			self.demoSoapAccount.attributes["name"] = [self.demoSoapAccount.attributes["name"], " Update"].join("");
			self.demoSoapAccount.attributes["description"] = [self.demoSoapAccount.attributes["namedescription"], " Update"].join("");
			self.xrmSvc.soapUpdate(self.demoSoapAccount)
				.then((rslt) => {
					bootbox.alert(["Demo Account updated with id : ", self.soapAccountId].join(""));
					self.soapRetrieveAccount();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapDeleteAccount(): void {
			const self = this;

			if (!self.soapAccountExists()) {
				bootbox.alert("An account has not yet been created. Try the create functionality before trying the delete again.");
				return;
			}

			self.xrmSvc.soapDelete('account', self.soapAccountId)
				.then((rslt) => {
				bootbox.alert(["Demo Account deleted with id : ", self.soapAccountId].join(""));
					self.soapAccountId = '';					
					self.initDemoSoapAccount();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapSetActiveAccount(): void {
			const self = this;

			if (!self.soapAccountExists()) {
				bootbox.alert("An account has not yet been created. Try the create and set inactive functionality before trying the set active again.");
				return;
			}

			if (self._soapAccountActive) {
				bootbox.alert("The account is already active. Try the set inactive functionality before trying the set active again.");
				return;
			}

			self.xrmSvc.soapSetState('account', self.soapAccountId, 0, 1)
				.then((rslt) => {
					bootbox.alert(["Demo account activated with id : ", self.soapAccountId].join(""));
					self._soapAccountActive = true;
					self.soapRetrieveAccount();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapSetInactiveAccount(): void {
			const self = this;

			if (!self.soapAccountExists()) {
				bootbox.alert("An account has not yet been created. Try the create functionality before trying the set inactive again.");
				return;
			}

			if (!self._soapAccountActive) {
				bootbox.alert("The account is already inactive. Try the set active functionality before trying the set inactive again.");
				return;
			}

			self.xrmSvc.soapSetState('account', self.soapAccountId, 1, 2)
				.then((rslt) => {
					bootbox.alert(["Demo account deactivated with id : ", self.soapAccountId].join(""));
					self._soapAccountActive = false;
					self.soapRetrieveAccount();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}		
		soapAssignAccountToMe(): void {
			const self = this;

			self.soapDoAssignAccount('account', self._currentUserId);
		}
		soapAssignAccountToAnother(): void {
			const self = this;

			self.openSelectUserModal('account');
		}
		soapRetrievePrincipalAccessAccount(): void {
			const self = this;

			if (!self.soapAccountExists()) {
				bootbox.alert("An account has not yet been created. Try the create functionality before trying the retrievePrincipalAccess again.");
				return;
			}

			let options = new XrmCommon.AccessOptions({
				targetEntityName: 'account',
				targetEntityId: self.soapAccountId,
				principalEntityName: 'systemuser',
				principalEntityId: self._currentUserId
			});

			self.xrmSvc.soapRetrievePrincipalAccess(options)
				.then((rslt) => {
					let msg: string = ["Access Rights :<br />", rslt.join("<br />")].join("");
					bootbox.alert(msg);
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}

		soapCreateContact(): void {
			const self = this;

			if (self.soapContactExists()) {
				bootbox.alert("A contact has already been created. Try the delete functionality before trying the create again.");
				return;
			}

			self.xrmSvc.soapCreate(self.demoSoapContact)
				.then((rslt) => {
					self.soapContactId = rslt;
					self.demoSoapContact.id = rslt;
					bootbox.alert(["Demo Contact created with id : ", rslt].join(""));
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapRetrieveContact(): void {
			const self = this;

			if (!self.soapContactExists()) {
				bootbox.alert("A contact has not yet been created. Try the create functionality before trying the retrieve again.");
				return;
			}

			self.demoSoapFetch = [];
			self.xrmSvc.soapRetrieve('contact', self.soapContactId, ['contactid', 'firstname', 'lastname', 'fullname', 'gendercode', 'statecode', 'statuscode', 'ownerid'])
				.then((rslt) => {
					self.demoSoapFetch.push(rslt);
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapRetrieveMultipleContacts(): void {
			const self = this;

			let query: string =
				["<a:ColumnSet>",
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
				.then((rslt) => {
					self.demoSoapFetch = rslt;
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapUpdateContact(): void {
			const self = this;

			if (!self.soapContactExists()) {
				bootbox.alert("A contact has not yet been created. Try the create functionality before trying the update again.");
				return;
			}

			self.demoSoapContact.attributes["firstname"] = [self.demoSoapContact.attributes["firstname"], " Update"].join("");
			self.xrmSvc.soapUpdate(self.demoSoapContact)
				.then((rslt) => {
					bootbox.alert(["Demo Contact updated with id : ", self.soapContactId].join(""));
					self.soapRetrieveContact();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapDeleteContact(): void {
			const self = this;

			if (!self.soapContactExists()) {
				bootbox.alert("A contact has not yet been created. Try the create functionality before trying the delete again.");
				return;
			}

			self.xrmSvc.soapDelete('contact', self.soapContactId)
				.then((rslt) => {
				bootbox.alert(["Demo Contact deleted with id : ", self.soapContactId].join(""));
					self.soapContactId = '';
					self.initDemoSoapContact();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapSetActiveContact(): void {
			const self = this;

			if (!self.soapContactExists()) {
				bootbox.alert("A contact has not yet been created. Try the create and set inactive functionality before trying the set active again.");
				return;
			}

			if (self._soapContactActive) {
				bootbox.alert("The contact is already active. Try the set inactive functionality before trying the set active again.");
				return;
			}

			self.xrmSvc.soapSetState('contact', self.soapContactId, 0, 1)
				.then((rslt) => {
					bootbox.alert(["Demo Contact activated with id : ", self.soapContactId].join(""));
					self._soapContactActive = true;
					self.soapRetrieveContact();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapSetInactiveContact(): void {
			const self = this;

			if (!self.soapContactExists()) {
				bootbox.alert("A contact has not yet been created. Try the create functionality before trying the set inactive again.");
				return;
			}

			if (!self._soapContactActive) {
				bootbox.alert("The contact is already inactive. Try the set active functionality before trying the set inactive again.");
				return;
			}

			self.xrmSvc.soapSetState('contact', self.soapContactId, 1, 2)
				.then((rslt) => {
					bootbox.alert(["Demo Contact deactivated with id : ", self.soapContactId].join(""));
					self._soapContactActive = false;
					self.soapRetrieveContact();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapAssignContactToMe(): void {
			const self = this;

			self.soapDoAssignAccount('contact', self._currentUserId);
		}
		soapAssignContactToAnother(): void {
			const self = this;

			self.openSelectUserModal('contact');
		}
		soapRetrievePrincipalAccessContact(): void {
			const self = this;

			if (!self.soapContactExists()) {
				bootbox.alert("A contact has not yet been created. Try the create functionality before trying the retrievePrincipalAccess again.");
				return;
			}

			let options = new XrmCommon.AccessOptions({
				targetEntityName: 'contact',
				targetEntityId: self.soapContactId,
				principalEntityName: 'systemuser',
				principalEntityId: self._currentUserId
			});

			self.xrmSvc.soapRetrievePrincipalAccess(options)
				.then((rslt) => {
					let msg: string = ["Access Rights :<br />", rslt.join("<br />")].join("");
					bootbox.alert(msg);
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}

		soapAssociate(): void {
			const self = this;

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
				.then((rslt) => {
					bootbox.alert("The soap account and contact have been associated.");
					self._soapAssociated = true;
					self.soapRetrieveAccount();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapDisassociate(): void {
			const self = this;

			if (!self._soapAccountActive || !self._soapContactActive) {
				bootbox.alert("Make sure both the account and the contact in the SOAP section are in state: Active!");
				return;
			}
			if (!self.soapAssociated()) {
				bootbox.alert("The account and contact are not yet associated. Try the associate functionality before trying the disassociate again.");
				return;
			}

			self.xrmSvc.soapDisassociate('account_primary_contact', 'contact', self.soapContactId, 'account', [self.demoSoapAccount])
				.then((rslt) => {
					bootbox.alert("The soap account and contact have been disassociated.");
					self._soapAssociated = false;
					self.soapRetrieveAccount();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}

		soapRetrieveAllEntityMetadata(): void {
			const self = this;

			self.demoSoapMetadata = [];
			self.xrmSvc.soapRetrieveAllEntityMetadataNgXrmServiceToolkit()
				.then((rslt) => {
				self.demoSoapMetadata = rslt;
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapRetrieveEntityMetadata(): void {
			const self = this;

			self.demoSoapMetadata = [];
			self.xrmSvc.soapRetrieveEntityMetadata('account')
				.then((rslt) => {
					self.demoSoapMetadata = rslt;
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		soapRetrieveAttributeMetadata(): void {
			const self = this;

			self.demoSoapMetadata = [];
			self.xrmSvc.soapRetrieveAttributeMetadata('account', 'primarycontactid')
				.then((rslt) => {
					self.demoSoapMetadata = rslt;
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}

		restRetrieveMultiple(): void {
			const self = this;

			self.demoRestFetch = [];
			self.xrmSvc.restRetrieveMultiple('Account', '$top=10&$select=AccountId,Name,Description,PrimaryContactId')
				.then((rslt) => {
					self.demoRestFetch = rslt;
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}

		restCreateAccount(): void {
			const self = this;

			if (self.restAccountExists()) {
				bootbox.alert("An account has already been created. Try the delete functionality before trying the create again.");
				return;
			}

			self.xrmSvc.restCreate('Account', self.demoRestAccount)
				.then((rslt) => {
					self.restAccountId = rslt.AccountId;
					self.demoRestAccount.AccountId = rslt.AccountId;
					bootbox.alert(["Demo Account created with id : ", rslt.AccountId].join(""));
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		restRetrieveAccount(): void {
			const self = this;

			if (!self.restAccountExists()) {
				bootbox.alert("An account has not yet been created. Try the create functionality before trying the retrieve again.");
				return;
			}

			self.demoRestFetch = [];
			self.xrmSvc.restRetrieve(self.restAccountId, 'Account', ["AccountId", "Name", "Description", "PrimaryContactId"], null)
				.then((rslt) => {
					self.demoRestFetch.push(rslt);
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		restUpdateAccount(): void {
			const self = this;

			if (!self.restAccountExists()) {
				bootbox.alert("An account has not yet been created. Try the create functionality before trying the update again.");
				return;
			}

			this.demoRestAccount.Name = "Demo Rest Account Update";
			this.demoRestAccount.Description = "Description of Demo Rest Account Update";
			self.xrmSvc.restUpdate(self.restAccountId, 'Account', self.demoRestAccount)
				.then((rslt) => {
					bootbox.alert(["Demo Account updated with id : ", self.restAccountId].join(""));
					self.restRetrieveAccount();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		restDeleteAccount(): void {
			const self = this;

			if (!self.restAccountExists()) {
				bootbox.alert("An account has not yet been created. Try the create functionality before trying the delete again.");
				return;
			}

			self.xrmSvc.restDelete(self.restAccountId, 'Account')
				.then((rslt) => {
					bootbox.alert(["Demo Account deleted with id : ", self.restAccountId].join(""));
					self.restAccountId = '';
					self.initDemoRestAccount();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		restCreateContact(): void {
			const self = this;

			if (self.restContactExists()) {
				bootbox.alert("A contact has already been created. Try the delete functionality before trying the create again.");
				return;
			}

			self.xrmSvc.restCreate('Contact', self.demoRestContact)
				.then((rslt) => {
					self.restContactId = rslt.ContactId;
					self.demoRestContact.ContactId = rslt.ContactId;
					bootbox.alert(["Demo Contact created with id : ", rslt.ContactId].join(""));
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		restRetrieveContact(): void {
			const self = this;

			if (!self.restContactExists()) {
				bootbox.alert("A contact has not yet been created. Try the create functionality before trying the retrieve again.");
				return;
			}

			self.demoRestFetch = [];
			self.xrmSvc.restRetrieve(self.restContactId, 'Contact', ["ContactId", "FirstName", "LastName", "FullName", "GenderCode"], null)
				.then((rslt) => {
					self.demoRestFetch.push(rslt);
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		restUpdateContact(): void {
			const self = this;

			if (!self.restContactExists()) {
				bootbox.alert("A contact has not yet been created. Try the create functionality before trying the update again.");
				return;
			}

			this.demoRestContact.FirstName = "John Update";
			self.xrmSvc.restUpdate(self.restContactId, 'Contact', self.demoRestContact)
				.then((rslt) => {
					bootbox.alert(["Demo Contact updated with id : ", self.restContactId].join(""));
					self.restRetrieveContact();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		restDeleteContact(): void {
			const self = this;

			if (!self.restContactExists()) {
				bootbox.alert("A contact has not yet been created. Try the create functionality before trying the delete again.");
				return;
			}

			self.xrmSvc.restDelete(self.restContactId, 'Contact')
				.then((rslt) => {
					bootbox.alert(["Demo Contact deleted with id : ", self.restContactId].join(""));
					self.restContactId = '';
					self.initDemoRestContact();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}

		restAssociate(): void {
			const self = this;

			if (!self.restAccountExists() || !self.restContactExists()) {
				bootbox.alert("You must first create the account and the contact in the REST section before you can try the associate functionality.");
				return;
			}
			if (self.restAssociated()) {
				bootbox.alert("The account and contact are already associated. Try the disassociate functionality before trying the associate again.");
				return;
			}

			self.xrmSvc.restAssociate(self.restContactId, 'Contact', self.restAccountId, 'Account', 'account_primary_contact')
				.then((rslt) => {
					bootbox.alert("The rest account and contact have been associated.");
					self._restAssociated = true;
					self.restRetrieveAccount();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
		restDisassociate(): void {
			const self = this;

			if (!self.restAssociated()) {
				bootbox.alert("The account and contact are not yet associated. Try the associate functionality before trying the disassociate again.");
				return;
			}

			self.xrmSvc.restDisassociate(self.restContactId, 'Contact', self.restAccountId, 'account_primary_contact')
				.then((rslt) => {
					bootbox.alert("The rest account and contact have been disassociated.");
					self._restAssociated = false;
					self.restRetrieveAccount();
				})
				.catch((error) => {
					bootbox.alert(error);
				});
		}
	}

	app.controller(DemoController.id, DemoController);
}  