/// <reference path="../_app.ts" />


module ngXrmServiceToolkit.Demo.ngApp.Services {
	import XrmCommon = ngXrm.XrmServiceToolkit.Common;
	import XrmRest = ngXrm.XrmServiceToolkit.Common.Rest;
	import XrmSoap = ngXrm.XrmServiceToolkit.Common.Soap;
	

	export interface IXrmService {
		init: ng.IPromise<{}[]>;

		retrieveSolutionInformation: () => ng.IPromise<XrmCommon.IBusinessEntity>;
		retrieveUsers: () => ng.IPromise<XrmCommon.BusinessEntity[]>;

		soapWhoAmI: () => ng.IPromise<string>;
		soapGetCurrentUserId: () => ng.IPromise<string>;
		soapGetCurrentUserRoles: () => ng.IPromise<string[]>;
		soapIsCurrentUserInRole: (args: string[]) => ng.IPromise<boolean>;
		soapGetCurrentUserBusinessUnitId: () => ng.IPromise<string>;
		soapFetch: (fetchXml: string, fetchAll: boolean, maxFetch?: number) => ng.IPromise<XrmCommon.BusinessEntity[]>;
		soapQueryByAttribute: (queryOptions: XrmCommon.QueryOptions) => ng.IPromise<XrmCommon.BusinessEntity[]>;
		soapQueryAllByAttribute: (queryOptions: XrmCommon.QueryOptions, maxRecords?: number) => ng.IPromise<XrmCommon.BusinessEntity[]>;

		soapCreate: (entity: XrmCommon.BusinessEntity) => ng.IPromise<string>;
		soapRetrieve: (entityName: string, entityId: string, columnSet: string[]) => ng.IPromise<XrmCommon.BusinessEntity>;
		soapRetrieveMultiple: (query: string) => ng.IPromise<XrmCommon.BusinessEntity[]>;
		soapUpdate: (entity: XrmCommon.BusinessEntity) => ng.IPromise<string>;
		soapDelete: (entityName: string, entityId: string) => ng.IPromise<string>;
		soapSetState: (entityName: string, id: string, stateCode: number, statusCode: number) => ng.IPromise<string>;
		soapAssign: (targetEntityName: string, targetId: string, assigneeEntityName: string, assigneeId: string) => ng.IPromise<string>;
		soapRetrievePrincipalAccess: (accessOptions: XrmCommon.AccessOptions) => ng.IPromise<string[]>;
		soapGrantAccess: (accessOptions: XrmCommon.AccessOptions) => ng.IPromise<string>;
		soapModifyAccess: (accessOptions: XrmCommon.AccessOptions) => ng.IPromise<string>;
		soapRevokeAccess: (accessOptions: XrmCommon.AccessOptions) => ng.IPromise<string>;

		soapAssociate: (relationshipName: string, targetEntityName: string, targetId: string, relatedEntityName: string, relatedBusinessEntities: XrmCommon.BusinessEntity[]) => ng.IPromise<string>;
		soapDisassociate: (relationshipName: string, targetEntityName: string, targetId: string, relatedEntityName: string, relatedBusinessEntities: XrmCommon.BusinessEntity[]) => ng.IPromise<string>;

		soapAddMemberTeamRequest: (teamId: string, memberId: string) => ng.IPromise<any>;
		soapRemoveMemberTeamRequest: (teamId: string, memberId: string) => ng.IPromise<any>;

		soapRetrieveAllEntityMetadataNgXrmServiceToolkit: () => ng.IPromise<XrmCommon.IMetadata[]>;
		soapRetrieveEntityMetadata: (logicalName: string) => ng.IPromise<XrmCommon.IEntityMetadata[]>;
		soapRetrieveAttributeMetadata: (entityLogicalName: string, attributeLogicalName: string) => ng.IPromise<any[]>;

		restRetrieveMultiple: (type: string, options?: string) => ng.IPromise<any[]>;

		restCreate: (type: string, object: any) => ng.IPromise<any>;
		restRetrieve: (id: string, type: string, select: string[], expand: string[]) => ng.IPromise<any>;
		restUpdate: (id: string, type: string, object: any) => ng.IPromise<any>;
		restDelete: (id: string, type: string) => ng.IPromise<any>;

		restAssociate: (entityid1: string, odataSetName1: string, entityid2: string, odataSetName2: string, relationship: string) => ng.IPromise<any>;
		restDisassociate: (entityid1: string, odataSetName: string, entityid2: string, relationship: string) => ng.IPromise<any>;
	}

	export class XrmService implements IXrmService {
		static id: string = "xrmService";
		static $inject = ["$q", "ngXrmServiceToolkitSoap", "ngXrmServiceToolkitRest"];

		private userList: XrmCommon.BusinessEntity[] = [];
		init: ng.IPromise<{}[]>;

		constructor(private $q: ng.IPromise<any>, private ngXrmSoapSvc: ngXrm.XrmServiceToolkit.Soap.SoapClient, private ngXrmRestSvc: ngXrm.XrmServiceToolkit.Rest.RestClient) {
			let asyncFn1 = this.retrieveUsers();
			this.init = Q.all([asyncFn1]);
		}

		retrieveSolutionInformation(): ng.IPromise<XrmCommon.IBusinessEntity> {
			const self = this;
			let fetchXml: string = [
				"<fetch mapping='logical'>",
				"<entity name='solution'>",
				"<all-attributes />",
				"<filter>",
				"<condition attribute='uniquename' operator='eq' value='ngXrmServiceToolkitDemo' />",
				"</filter>",
				"</entity></fetch>"
				].join("");
			let thisSolution: XrmCommon.IBusinessEntity = null;

			return self.ngXrmSoapSvc.fetch(fetchXml, true).then((rslt) => {
				let retrievedSolutions: XrmCommon.IBusinessEntity[] = rslt;

				if (retrievedSolutions != null && retrievedSolutions.length > 0)
					thisSolution = retrievedSolutions[0];
				return thisSolution;
			});
			
		}

		retrieveUsers(): ng.IPromise<XrmCommon.BusinessEntity[]> {
			const self = this;
			if (self.userList.length === 0) {
				let fetchXml: string = [
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
					.then((rslt) => {
						self.userList = rslt;
						return self.userList;
					})
					.catch((error: any) => {
						console.log(error);
						return Q.reject("An error occurred while getting all users.");
					});

			} else {
				return Q.resolve(self.userList);
			}
		}
		
		//Demo
		//-Soap
		//--General
		soapWhoAmI(): ng.IPromise<string> {
			const self = this;
			let request: string =
				["<request i:type='b:WhoAmIRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
					"<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />",
					"<a:RequestId i:nil='true' />",
					"<a:RequestName>WhoAmI</a:RequestName>",
					"</request>"].join("");

			return self.ngXrmSoapSvc.execute(request)
				.then((rslt) => {
					let whoamiId: string = rslt.getElementsByTagName("a:Results")[0].childNodes[0].childNodes[1].text;
					return whoamiId;
				})
				.catch((error : any) => {
					console.log(error);
					return Q.reject("An error occurred while executing the Who Am I request.");
				});

			bootbox.alert("soapWhoAmI");
		}
		soapGetCurrentUserId(): ng.IPromise<string> {
			const self = this;
			return self.ngXrmSoapSvc.getCurrentUserId()
				.then((rslt: string) => {
					return rslt;
				})
				.catch((error: any) => {
					console.log(error);
					return Q.reject("An error occurred while executing the getCurrentUserId request.");
				});
		}
		soapGetCurrentUserRoles(): ng.IPromise<string[]> {
			const self = this;
			return self.ngXrmSoapSvc.getCurrentUserRoles()
				.then((rslt: string[]) => {
					return rslt;
				})
				.catch((error: any) => {
					console.log(error);
					return Q.reject("An error occurred while executing the getCurrentUserRoles request.");
				});
		}
		soapIsCurrentUserInRole(args: string[]): ng.IPromise<boolean> {
			const self = this;
			return self.ngXrmSoapSvc.isCurrentUserInRole(args)
				.then((rslt: boolean) => {
					return rslt;
				})
				.catch((error: any) => {
					console.log(error);
					return Q.reject("An error occurred while executing the isCurrentUserInRole request.");
				});
		}
		soapGetCurrentUserBusinessUnitId(): ng.IPromise<string> {
			const self = this;
			return self.ngXrmSoapSvc.getCurrentUserBusinessUnitId()
				.then((rslt: string) => {
					return rslt;
				})
				.catch((error: any) => {
					console.log(error);
					return Q.reject("An error occurred while executing the getCurrentUserBusinessUnitId request.");
				});
		}
		soapFetch(fetchXml: string, fetchAll: boolean, maxFetch?:number): ng.IPromise<XrmCommon.BusinessEntity[]> {
			const self = this;
			return self.ngXrmSoapSvc.fetch(fetchXml, fetchAll, maxFetch)
				.then((rslt: XrmCommon.BusinessEntity[]) => {
					return rslt;
				})
				.catch((error: any) => {
					console.log(error);
					return Q.reject("An error occurred while executing the fetch request.");
				});
		}
		soapQueryByAttribute(queryOptions: XrmCommon.QueryOptions): ng.IPromise<XrmCommon.BusinessEntity[]> {
			const self = this;
			return self.ngXrmSoapSvc.queryByAttribute(queryOptions)
				.then((rslt: XrmCommon.BusinessEntity[]) => {
					return rslt;
				})
				.catch((error: any) => {
					console.log(error);
					return Q.reject("An error occurred while executing the queryByAttribute request.");
				});
		}
		soapQueryAllByAttribute(queryOptions: XrmCommon.QueryOptions, maxRecords?: number): ng.IPromise<XrmCommon.BusinessEntity[]> {
			const self = this;
			return self.ngXrmSoapSvc.queryAllByAttribute(queryOptions, maxRecords)
				.then((rslt: XrmCommon.BusinessEntity[]) => {
					return rslt;
				})
				.catch((error: any) => {
					console.log(error);
					return Q.reject("An error occurred while executing the queryAllByAttribute request.");
				});
		}

		//--Record
		soapCreate(entity: XrmCommon.BusinessEntity): ng.IPromise<string> {
			const self = this;
			return self.ngXrmSoapSvc.createEntity(entity)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while creating the entity.");
				});
		}
		soapRetrieve(entityName: string, entityId: string, columnSet : string[]): ng.IPromise<XrmCommon.BusinessEntity> {
			const self = this;
			return self.ngXrmSoapSvc.retrieveEntity(entityName, entityId, columnSet)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while retrieving the entity.");
				});
		}
		soapRetrieveMultiple(query: string): ng.IPromise<XrmCommon.BusinessEntity[]> {
			const self = this;
			return self.ngXrmSoapSvc.retrieveMultiple(query)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while executing the RetrieveMultiple.");
				});
		}
		soapUpdate(entity: XrmCommon.BusinessEntity): ng.IPromise<string> {
			const self = this;
			return self.ngXrmSoapSvc.updateEntity(entity)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while updating the entity.");
				});
		}
		soapDelete(entityName:string, entityId:string): ng.IPromise<string> {
			const self = this;
			return self.ngXrmSoapSvc.deleteEntity(entityName, entityId)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while deleting the entity.");
				});
		}
		soapSetState(entityName: string, id: string, stateCode: number, statusCode: number): ng.IPromise<string> {
			const self = this;
			return self.ngXrmSoapSvc.setState(entityName, id, stateCode, statusCode)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while setting the state of the entity.");
				});
		}
		soapAssign(targetEntityName: string, targetId: string, assigneeEntityName: string, assigneeId: string): ng.IPromise<string> {
			const self = this;
			return self.ngXrmSoapSvc.assign(targetEntityName, targetId, assigneeEntityName, assigneeId)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while assigning the entity.");
				});
		}
		soapRetrievePrincipalAccess(accessOptions: XrmCommon.AccessOptions): ng.IPromise<string[]> {
			const self = this;
			return self.ngXrmSoapSvc.retrievePrincipalAccess(accessOptions)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred during the retrievePrincipalAccess request.");
				});
		}
		soapGrantAccess(accessOptions: XrmCommon.AccessOptions): ng.IPromise<string> {
			const self = this;
			return self.ngXrmSoapSvc.grantAccess(accessOptions)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred during the grantAccess request.");
				});
		}
		soapModifyAccess(accessOptions: XrmCommon.AccessOptions): ng.IPromise<string> {
			const self = this;
			return self.ngXrmSoapSvc.modifyAccess(accessOptions)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred during the modifyAccess request.");
				});
		}
		soapRevokeAccess(accessOptions: XrmCommon.AccessOptions): ng.IPromise<string> {
			const self = this;
			return self.ngXrmSoapSvc.revokeAccess(accessOptions)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred during the revokeAccess request.");
				});
		}
		
		soapAssociate(relationshipName: string, targetEntityName: string, targetId: string, relatedEntityName: string, relatedBusinessEntities: XrmCommon.BusinessEntity[]): ng.IPromise<string> {
			const self = this;
			return self.ngXrmSoapSvc.associate(relationshipName, targetEntityName, targetId, relatedEntityName, relatedBusinessEntities)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while creating the association.");
				});
		}
		soapDisassociate(relationshipName: string, targetEntityName: string, targetId: string, relatedEntityName: string, relatedBusinessEntities: XrmCommon.BusinessEntity[]): ng.IPromise<string> {
			const self = this;
			return self.ngXrmSoapSvc.disassociate(relationshipName, targetEntityName, targetId, relatedEntityName, relatedBusinessEntities)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurrred while deleting the association.");
				});
		}

		soapAddMemberTeamRequest(teamId: string, memberId: string): ng.IPromise<any> {
			const self = this;
			return self.ngXrmSoapSvc.addMemberTeamRequest(teamId, memberId)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurrred while adding a member to the team.");
				});
		}
		soapRemoveMemberTeamRequest(teamId: string, memberId: string): ng.IPromise<any> {
			const self = this;
			return self.ngXrmSoapSvc.removeMemberTeamRequest(teamId, memberId)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurrred while removing a member from the team.");
				});
		}

		//--Metadata
		soapRetrieveAllEntityMetadataNgXrmServiceToolkit(): ng.IPromise<XrmCommon.IMetadata[]> {
			const self = this;
			return self.ngXrmSoapSvc.retrieveAllEntitiesMetadata(["Entity"], true)
				.then((rslt: XrmCommon.IMetadata[]) => {
					return rslt;
				}).catch((error) => {
					console.log(error);
					return Q.reject("An error occurrred while retrieving all entity metadata.");
				});
		}

		soapRetrieveEntityMetadata(logicalName: string): ng.IPromise<XrmCommon.IEntityMetadata[]>{
			const self = this;
			return self.ngXrmSoapSvc.retrieveEntityMetadata(["Entity", "Attributes"], logicalName, true)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject(["An error occurrred while retrieving entity metadata for ", logicalName, "."].join(""));
				});
		}
		soapRetrieveAttributeMetadata(entityLogicalName: string, attributeLogicalName: string): ng.IPromise<any[]> {
			const self = this;
			return self.ngXrmSoapSvc.retrieveAttributeMetadata(entityLogicalName, attributeLogicalName, true)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject(["An error occurrred while retrieving entity metadata for ", entityLogicalName, " and attribute ", attributeLogicalName, "."].join(""));
				});
		}

		//-Rest
		//--General
		restRetrieveMultiple(type: string, options?: string): ng.IPromise<any[]> {
			const self = this;
			
			return self.ngXrmRestSvc.retrieveMultipleRecords(type, options)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while performing the RetrieveMultiple.");
				});
		}

		//--Record
		restCreate(type: string, object: any): ng.IPromise<any> {
			const self = this;
			return self.ngXrmRestSvc.createRecord(type, object)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while creating the entity.");
				});
		}
		restRetrieve(id: string, type: string, select: string[], expand: string[]): ng.IPromise<any> {
			const self = this;
			return self.ngXrmRestSvc.retrieveRecord(id, type, select, expand)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while retrieving the entity.");
				});
		}
		restUpdate(id: string, type: string, object: any): ng.IPromise<any> {
			const self = this;
			return self.ngXrmRestSvc.updateRecord(id, type, object)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while updating the entity.");
				});
		}
		restDelete(id: string, type: string): ng.IPromise<any> {
			const self = this;
			return self.ngXrmRestSvc.deleteRecord(id, type)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while deleting the entity.");
				});
		}

		restAssociate(entityid1: string, odataSetName1: string, entityid2: string, odataSetName2: string, relationship: string): ng.IPromise<any> {
			const self = this;
			return self.ngXrmRestSvc.associateRecord(entityid1, odataSetName1, entityid2, odataSetName2, relationship)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while creating the association.");
				});
		}
		restDisassociate(entityid1: string, odataSetName: string, entityid2: string, relationship: string): ng.IPromise<any> {
			const self = this;
			return self.ngXrmRestSvc.disassociateRecord(entityid1, odataSetName, entityid2, relationship)
				.then((rslt) => {
					return rslt;
				})
				.catch((error) => {
					console.log(error);
					return Q.reject("An error occurred while deleting the association.");
				});
		}
	}

	app.service(XrmService.id, XrmService);
} 