ngXrmServiceToolkit
===================

A conversion of parts (SOAP and REST) of the existing [XrmServiceToolkit](https://xrmservicetoolkit.codeplex.com/) for usage in an AngularJS application inside Dynamics CRM 2015.
The included demo (source code) contains an example of each of the available methods.
Everything is written in Typescript, but the corresponding javascript is obviously also available. 

##Dependencies

 1. q(.min).js
 2. [Q.d.ts]
 3. [Xrm-2015.d.ts]

##Usage

 1. Include the ngXrmServiceToolkit in your project.
 2. Add the ngXrm module to your angular application:
 
	```javascript
	angular.module('myModule',['ngXrm'])
	```
 3. Inject the SOAP or REST clients into your service:

	```javascript
	static $inject = ["ngXrmServiceToolkitSoap"];
	constructor(private ngXrmSoapSvc : ngXrm.XrmServiceToolkit.Soap.SoapClient) {}
	
	static $inject = ["ngXrmServiceToolkitRest"];
	constructor(private ngXrmRestSvc : ngXrm.XrmServiceToolkit.Rest.RestClient) {}
	```

##Available Methods SOAP

	createEntity: (bEntity: Common.BusinessEntity) => ng.IPromise<string>;
	updateEntity: (bEntity: Common.BusinessEntity) => ng.IPromise<string>;
	deleteEntity: (entityName: string, id: string) => ng.IPromise<string>;
	execute: (request: string) => ng.IPromise<any>;
	fetch: (fetchCore: string, fetchAll: boolean, maxFetch?: number) => ng.IPromise<Common.BusinessEntity[]>;
	retrieveEntity: (entityName: string, id: string, columnSet: string[]) => ng.IPromise<Common.BusinessEntity>;
	retrieveMultiple: (query: string) => ng.IPromise<Common.BusinessEntity[]>;
	queryByAttribute: (queryOptions: Common.QueryOptions) => ng.IPromise<Common.BusinessEntity[]>;
	queryAllByAttribute: (queryOptions: Common.QueryOptions, maxRecords? : number) => ng.IPromise<Common.BusinessEntity[]>;
	setState: (entityName: string, id: string, stateCode: number, statusCode: number) => ng.IPromise<string>;
	associate: (relationshipName: string, targetEntityName: string, targetId: string, relatedEntityName: string, relatedBusinessEntities: Common.BusinessEntity[]) => ng.IPromise<string>;
	disassociate: (relationshipName: string, targetEntityName: string, targetId: string, relatedEntityName: string, relatedBusinessEntities: Common.BusinessEntity[]) => ng.IPromise<string>;
	getCurrentUserId: () => ng.IPromise<string>;
	getCurrentUserBusinessUnitId: () => ng.IPromise<string>;
	getCurrentUserRoles: () => ng.IPromise<string[]>;
	isCurrentUserInRole: (args: string[]) => ng.IPromise<boolean>;
	assign: (targetEntityName: string, targetId: string, assigneeEntityName: string, assigneeId: string) => ng.IPromise<string>;
	grantAccess: (accessOptions: Common.AccessOptions) => ng.IPromise<string>;
	modifyAccess: (accessOptions: Common.AccessOptions) => ng.IPromise<string>;
	revokeAccess: (accessOptions: Common.AccessOptions) => ng.IPromise<string>;	
	retrievePrincipalAccess: (accessOptions: Common.AccessOptions) => ng.IPromise<string[]>;
	addMemberTeamRequest: (teamId: string, memberId: string) => ng.IPromise<any>;
	removeMemberTeamRequest: (teamId: string, memberId: string) => ng.IPromise<any>;
	retrieveAllEntitiesMetadata: (entityFilters: string[], retrieveIfPublished: boolean) => ng.IPromise<Common.IMetadata[]>;
	retrieveEntityMetadata: (entityFilters: string[], logicalName: string, retrieveIfPublished: boolean) => ng.IPromise<Common.IMetadata[]>;
	retrieveAttributeMetadata: (entityLogicalName: string, attributeLogicalName: string, retrieveIfPublished: boolean) => ng.IPromise<any[]>;

##Available Methods REST

	createRecord: (object: any, type: string) => ng.IPromise<any>;
	retrieveRecord: (id: string, type: string, select: string[], expand: string[]) => ng.IPromise<any>;
	updateRecord: (id: string, type: string, object: any) => ng.IPromise<any>;
	deleteRecord: (id: string, type: string) => ng.IPromise<any>;
	retrieveMultipleRecords: (type: string, options?: string) => ng.IPromise<any[]>;
	associateRecord: (entityid1: string, odataSetName1: string, entityid2: string, odataSetName2: string, relationship: string) => ng.IPromise<any>;
	disassociateRecord: (entityid1: string, odataSetName: string, entityid2: string, relationship: string) => ng.IPromise<any>;

##Demo

Have a look at the included demo application.
The sourcecode is available as is a managed Dynamics CRM 2015 solution (exported for version 7.1).
The demo solution targets the standard CRM entities account and contact and only uses standard fields.
