/// <reference path="../_app.ts" />

module ngXrmServiceToolkit.Demo.ngApp.Models {
	import Common = ngXrm.XrmServiceToolkit.Common;

	export interface ISolution {
		createdOn: Date;
		description: string;
		uniqueName: string;
		friendlyName: string;
		version: string;
	}

	export class Solution {
		createdOn: Date;
		description: string;
		uniqueName: string;
		friendlyName: string;
		version: string;

		constructor(solution?: ISolution) {
			if (solution != null) {
				this.createdOn = solution.createdOn;
				this.description = solution.description;
				this.uniqueName = solution.uniqueName;
				this.friendlyName = solution.friendlyName;
				this.version = solution.version;
			}
		}

		static Convert(businessEntity: Common.IBusinessEntity) : Solution {
			let result: Solution = new Solution();
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
		}
	}

} 