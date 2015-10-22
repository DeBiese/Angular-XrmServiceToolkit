module ngXrmServiceToolkit.Demo.ngApp.Controllers {
	"use strict";

	import XrmCommon = ngXrm.XrmServiceToolkit.Common;

	export class SelectUserModalController {
		static id: string = "selectUserModalController";

		crmUserList: XrmCommon.BusinessEntity[];
		crmUserId: string = '';

		constructor(userList : XrmCommon.BusinessEntity[]) {
			this.crmUserList = userList;
		}
	}

	app.controller(SelectUserModalController.id, SelectUserModalController);
} 