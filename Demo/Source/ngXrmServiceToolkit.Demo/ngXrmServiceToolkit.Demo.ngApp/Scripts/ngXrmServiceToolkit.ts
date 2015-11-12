/**
 * MSCRM 2015 Web Service Toolkit for angular.
 * All code is based on the XrmServiceToolkit found on CodePlex (http://xrmservicetoolkit.codeplex.com).
 * @author RubenB
 * 
 * THIS CODE AND INFORMATION IS PROVIDED 'AS IS' WITHOUT WARRANTY OF ANY KIND, 
 * EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES 
 * OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Credits:
 *	The idea was to have an angular ready version of the very usefull XrmServiceToolkit.
 *	Only the Rest and Soap parts of the original have been converted.
 * 
 * Supported CRM Versions:
 * - CRM 2015 Update 1
 * - Untested in previous versions
 * 
 * Dependencies:
 * q(.min).js
 * [Q.d.ts]
 * [Xrm-2015.d.ts]
 * 
 * Usage:
 *	Add the script file (ngXrmServiceToolkit.ts(.js)) to your website.
 *	Add the ngXrm module to your angular module:
 *		angular.module('myModule', ['ngXrm']);
 * 
 *	Inject it in an angular service:
 *		
 *		TYPESCRIPT:
 *		-----------
 *		static $inject = ["ngXrmServiceToolkitSoap"];
 *		constructor(private ngXrmSoapSvc : ngXrm.XrmServiceToolkit.Soap.SoapClient) {}
 *	OR
 *		static $inject = ["ngXrmServiceToolkitRest"];
 *		constructor(private ngXrmRestSvc : ngXrm.XrmServiceToolkit.Rest.RestClient) {}
 * 
 *		JAVASCRIPT:
 *		-----------
 *		angular.module('myModule').factory('myService', ['ngXrmServiceToolkitSoap', function(ngXrmSoapSvc){}]);
 *	OR
 *		angular.module('myModule').factory('myService', ['ngXrmServiceToolkitRest', function(ngXrmRestSvc){}]);
 */
module ngXrm.XrmServiceToolkit {

}


/**
* ngXrm.XrmServiceToolkit.Common helper module
*/
module ngXrm.XrmServiceToolkit.Common{
	/*
	 * INTERFACES
	 */
	export interface IAccessOptions {
		//represents the name of the target entity
		targetEntityName: string;
		//represents the GUID of the target entity
		targetEntityId: string;
		//represents the name of the principal entity
		principalEntityName: string;
		//represents the GUID of the principal entity
		principalEntityId: string;
		//represents the access conditions of the results
		accessRights?: string[];
	}

	export interface IAttribute {
		type?: string;
		value: any;
		id?: string;
		logicalName?: string;
		name?: string;
		formattedValue?: string;
	}

	export interface IBusinessEntity {
		id?: string;
		logicalName: string;
		attributes?: { [index: string]: any; };	
		serialize?: () => string;
		deserialize?: (resultNode: Node) => void;
	}	

	//export interface IBusinessEntity {
	//	id?: string;
	//	logicalName: string;
	//	attributes: any;
	//}	

	export interface IDisplayName {
		UserLocalizedLabel: IUserLocalizedLabel;
	}

	export interface IEntityReference extends IAttribute {
		Id: string;
		Name: string;
		LogicalName: string;
	}

	export interface IOptionSet {
		DisplayName: IDisplayName;
		IsGlobal: boolean;
		Name: string;
		Options: IOptionMetadata;
	}

	export interface IQueryOpions {
		//represents the name of the entity
		entityName: string;
		//represents the attributes of the entity to query
		attributes: string[];
		//represents the values of the attributes to query
		values: any[];
		//represents the attributes of the entity to return
		columnSet: string[];
		//represents the order conditions of the results
		orderBy?: string[]
	}

	export interface IRequiredLevel {
		CanBeChanged: boolean;
		Value: string;
	}

	export interface IUserLocalizedLabel {
		Label: string;
		LanguageCode: number;
	}

	export interface IXrmEntityCollection {
		value: any[];
		type?: string;
	}

	export interface IXrmEntityReference {
		id: string;
		logicalName: string;
		name: string;
		type?: string;
	}

	export interface IXrmOptionSetValue {
		value: number;
		formattedValue?: string;
		type?: string;
	}

	export interface IXrmValue {
		type: string;
		value: any;
	}


	export interface IMetadata {
		_type: string;
		MetadataId: string;
		ObjectTypeCode: number;
		LogicalName: string;
		DisplayName: IDisplayName;
	}

	export interface IAttributeMetadata extends IMetadata {
		AttributeType: string;
		ColumnNumber: number;
		EntityLogicalName: string;
		RequiredLevel: IRequiredLevel;
	}

	export interface IEntityMetadata extends IMetadata {
		Attributes: IAttributeMetadata[];
	}	

	export interface IOptionMetadata {
		Label: IDisplayName;
		Value: number;
	}

	export interface IPicklistAttributeMetadata extends IAttributeMetadata {
		OptionSet: IOptionSet;
	}	

	export interface IStatusOptionMetadata extends IOptionMetadata {
		State: string;
		TransitionData: any;
	}		

	/*
	 * CLASSES
	 */

	export class AccessOptions {
		//represents the name of the target entity
		targetEntityName: string;
		//represents the GUID of the target entity
		targetEntityId: string;
		//represents the name of the principal entity
		principalEntityName: string;
		//represents the GUID of the principal entity
		principalEntityId: string;
		//represents the access conditions of the results
		accessRights: string[];

		constructor(accessOptions?: IAccessOptions) {
			if (accessOptions != null) {
				this.targetEntityName = accessOptions.targetEntityName;
				this.targetEntityId = accessOptions.targetEntityId;
				this.principalEntityName = accessOptions.principalEntityName;
				this.principalEntityId = accessOptions.principalEntityId;
				this.accessRights = accessOptions.accessRights;
			}
		}
	}
	
	export class BusinessEntity {
		///<summary>
		/// A object represents a business entity for CRM 2011.
		///</summary>
		///<param name="logicalName" type="String">
		/// A String represents the name of the entity.
		/// For example, "contact" means the business entity will be a contact entity
		/// </param>
		///<param name="id" type="String">
		/// A String represents the id of the entity. If not passed, it will be auto populated as a empty guid string
		/// </param>
		id: string;
		logicalName: string;
		attributes: { [index: string]: any; };

		constructor(businessEntity?: IBusinessEntity) {
			if (businessEntity != null) {
				this.id = businessEntity.id != null ? businessEntity.id : '00000000-0000-0000-0000-000000000000';
				this.logicalName = businessEntity.logicalName;
				this.attributes = (businessEntity.attributes != null && businessEntity.attributes != undefined) ? businessEntity.attributes : {};
			}
			else {
				this.id = '00000000-0000-0000-0000-000000000000';
				this.attributes = {};
			}
		}

		/**
		* Serialize a CRM Business Entity object to XML string in order to be passed to CRM Web Services.
		* @return {String} The serialized XML string of CRM entity.
		*/
		serialize(): string {
			let xml : string[] = ["<b:value i:type='a:Entity'>"];
			xml.push('<a:Attributes xmlns:b="http://schemas.datacontract.org/2004/07/System.Collections.Generic">');
			let attributes = this.attributes;
			for (let attributeName in attributes) {
				if (attributes.hasOwnProperty(attributeName)) {
					let attribute = attributes[attributeName];

					xml.push("<a:KeyValuePairOfstringanyType>");
					xml.push("<b:key>", attributeName, "</b:key>");

					if (attribute === null || attribute.value === null) {
						xml.push("<b:value i:nil='true' />");
					} else {
						let sType = (!attribute.type)
							? typeof attribute
							: Helper.crmXmlEncode(attribute.type);
						let value;
						let encodedValue;
						let id;
						let encodedId;
						let logicalName;
						let encodedLogicalName;
						switch (sType) {
							case "OptionSetValue":
								value = (attribute.hasOwnProperty("value")) ? attribute["value"] : attribute;
								encodedValue = Helper.encodeValue(value);
								xml.push("<b:value i:type='a:OptionSetValue'>");
								xml.push("<a:Value>", encodedValue, "</a:Value>", "</b:value>");
								break;

							case "EntityCollection":
								xml.push("<b:value i:type='a:EntityCollection'>");
								xml.push("<a:Entities>");
								value = (attribute.hasOwnProperty("value")) ? attribute["value"] : attribute;
								let collections = Helper.isArray(value) ? value : [value];

								for (let i = 0, collectionLengh = collections.length; i < collectionLengh; i++) {
									let item = collections[i];
									id = (item.hasOwnProperty("id")) ? item["id"] : item;
									encodedId = Helper.encodeValue(id);
									logicalName = (item.hasOwnProperty("logicalName")) ? item["logicalName"] : item;
									encodedLogicalName = Helper.encodeValue(logicalName);
									xml.push("<a:Entity>");
									xml.push("<a:Attributes>");
									xml.push("<a:KeyValuePairOfstringanyType>");
									xml.push("<b:key>partyid</b:key>");
									xml.push("<b:value i:type='a:EntityReference'>");
									xml.push("<a:Id>", encodedId, "</a:Id>");
									xml.push("<a:LogicalName>", encodedLogicalName, "</a:LogicalName>");
									xml.push("<a:Name i:nil='true' />");
									xml.push("</b:value>");
									xml.push("</a:KeyValuePairOfstringanyType>");
									xml.push("</a:Attributes>");
									xml.push("<a:EntityState i:nil='true' />");
									xml.push("<a:FormattedValues />");
									xml.push("<a:Id>00000000-0000-0000-0000-000000000000</a:Id>");
									xml.push("<a:LogicalName>activityparty</a:LogicalName>");
									xml.push("<a:RelatedEntities />");
									xml.push("</a:Entity>");
								}
								xml.push("</a:Entities>");
								xml.push("<a:EntityName i:nil='true' />");
								xml.push("<a:MinActiveRowVersion i:nil='true' />");
								xml.push("<a:MoreRecords>false</a:MoreRecords>");
								xml.push("<a:PagingCookie i:nil='true' />");
								xml.push("<a:TotalRecordCount>0</a:TotalRecordCount>");
								xml.push("<a:TotalRecordCountLimitExceeded>false</a:TotalRecordCountLimitExceeded>");
								xml.push("</b:value>");
								break;

							case "EntityReference":
								id = (attribute.hasOwnProperty("id")) ? attribute["id"] : attribute;
								encodedId = Helper.encodeValue(id);
								logicalName = (attribute.hasOwnProperty("logicalName")) ? attribute["logicalName"] : attribute;
								encodedLogicalName = Helper.encodeValue(logicalName);
								xml.push("<b:value i:type='a:EntityReference'>");
								xml.push("<a:Id>", encodedId, "</a:Id>");
								xml.push("<a:LogicalName>", encodedLogicalName, "</a:LogicalName>");
								xml.push("<a:Name i:nil='true' />", "</b:value>");
								break;

							case "Money":
								value = (attribute.hasOwnProperty("value")) ? attribute["value"] : attribute;
								encodedValue = Helper.encodeValue(value);
								xml.push("<b:value i:type='a:Money'>");
								xml.push("<a:Value>", encodedValue, "</a:Value>", "</b:value>");
								break;

							case "guid":
								value = (attribute.hasOwnProperty("value")) ? attribute["value"] : attribute;
								encodedValue = Helper.encodeValue(value);
								xml.push("<b:value i:type='c:guid' xmlns:c='http://schemas.microsoft.com/2003/10/Serialization/'>");
								xml.push(encodedValue, "</b:value>");
								break;

							case "number":
								value = (attribute.hasOwnProperty("value")) ? attribute["value"] : attribute;
								encodedValue = Helper.encodeValue(value);
								let oType = (parseInt(encodedValue) === encodedValue) ? "c:int" : "c:decimal";
								xml.push("<b:value i:type='", oType, "' xmlns:c='http://www.w3.org/2001/XMLSchema'>");
								xml.push(encodedValue, '</b:value>');
								break;

							default:
								value = (attribute.hasOwnProperty("value")) ? attribute["value"] : attribute;
								encodedValue = Helper.encodeValue(value);
								sType = (typeof value === "object" && value.getTime) ? "dateTime" : sType;
								xml.push("<b:value i:type='c:", sType, "' xmlns:c='http://www.w3.org/2001/XMLSchema'>", encodedValue, "</b:value>");
								break;
						}
					}
					xml.push("</a:KeyValuePairOfstringanyType>");
				}
			}

			xml.push("</a:Attributes><a:EntityState i:nil='true' />");
			xml.push("<a:FormattedValues xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />");
			xml.push("<a:Id>", Helper.encodeValue(this.id), "</a:Id>");
			xml.push("<a:LogicalName>", this.logicalName, "</a:LogicalName>");
			xml.push("<a:RelatedEntities xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />");
			xml.push("</b:value>");
			return xml.join("");
		}

		/**
		* Deserialize an XML node into a CRM Business Entity object. The XML node comes from CRM Web Service's response.
		* @param {object} resultNode The XML node returned from CRM Web Service's Fetch, Retrieve, RetrieveMultiple messages.
		*/
		deserialize(resultNode: Node): void {
			let obj: any = new Object();
			let resultNodes: NodeList = resultNode.childNodes;

			for (let j = 0, lenj = resultNodes.length; j < lenj; j++) {
				let sKey: string;
				let parentNode: Node = resultNodes[j];
				switch (parentNode.nodeName) {
					case "a:Attributes":
						let attr = parentNode;
						for (let k = 0, lenk = attr.childNodes.length; k < lenk; k++) {
							let tempParentNode = attr.childNodes[k];
							// Establish the Key for the Attribute
							let tempParentNodeChildNodes = tempParentNode.childNodes;
							sKey = Helper.getNodeText(tempParentNodeChildNodes[0]);

							let tempNode = tempParentNodeChildNodes[1];
							// Determine the Type of Attribute value we should expect
							let sType = tempNode.attributes.getNamedItem("i:type").value;

							// check for AliasedValue
							if (sType.replace('c:', '').replace('a:', '') === "AliasedValue") {
								// reset the type to the actual attribute type
								let subNode = tempNode.childNodes[2];
								sType = subNode.attributes.getNamedItem("i:type").value;

								//sKey = getNodeText(tempNode.childNodes[1]) + "." + getNodeText(tempNode.childNodes[0]);
								// reset the node to the AliasedValue value node
								tempNode = subNode;
							}

							let entRef;
							let entCv;
							switch (sType) {
								case "a:OptionSetValue":
									let entOsv = new XrmOptionSetValue();
									entOsv.type = sType.replace('a:', '');
									entOsv.value = parseInt(Helper.getNodeText(tempNode));
									obj[sKey] = entOsv;
									break;

								case "a:EntityReference":
									entRef = new XrmEntityReference();
									entRef.type = sType.replace('a:', '');
									let oChildNodes = tempNode.childNodes;
									entRef.id = Helper.getNodeText(oChildNodes[0]);
									entRef.logicalName = Helper.getNodeText(oChildNodes[1]);
									entRef.name = Helper.getNodeText(oChildNodes[2]);
									obj[sKey] = entRef;
									break;

								case "a:EntityCollection":
									entRef = new XrmEntityCollection();
									entRef.type = sType.replace('a:', '');

									//get all party items....
									let items = [];
									let partyNodes = tempNode.childNodes;
									for (let y = 0, leny = partyNodes[0].childNodes.length; y < leny; y++) {
										let itemNodes = tempParentNode.childNodes[1].childNodes[0].childNodes[y].childNodes[0].childNodes;
										for (let z = 0, lenz = itemNodes.length; z < lenz; z++) {
											let itemNodeChildNodes = itemNodes[z].childNodes;
											let nodeText = Helper.getNodeText(itemNodeChildNodes[0]);
											if (nodeText === "partyid") {
												let itemRef = new XrmEntityReference();
												itemRef.id = Helper.getNodeText(itemNodeChildNodes[1].childNodes[0]);
												itemRef.logicalName = Helper.getNodeText(itemNodeChildNodes[1].childNodes[1]);
												itemRef.name = Helper.getNodeText(itemNodeChildNodes[1].childNodes[2]);
												items[y] = itemRef;
											}
										}
									}
									entRef.value = items;
									obj[sKey] = entRef;
									break;

								case "a:Money":
									entCv = new XrmValue();
									entCv.type = sType.replace('a:', '');
									entCv.value = parseFloat(Helper.getNodeText(tempNode));
									obj[sKey] = entCv;
									break;

								default:
									entCv = new XrmValue();
									entCv.type = sType.replace('c:', '').replace('a:', '');
									if (entCv.type === "int") {
										entCv.value = parseInt(Helper.getNodeText(tempNode));
									}
									else if (entCv.type === "decimal" || entCv.type === "double") {
										entCv.value = parseFloat(Helper.getNodeText(tempNode));
									}
									else if (entCv.type === "dateTime") {
										entCv.value = Helper.stringToDate(Helper.getNodeText(tempNode));
									}
									else if (entCv.type === "boolean") {
										entCv.value = (Helper.getNodeText(tempNode) === 'false') ? false : true;
									}
									else {
										entCv.value = Helper.getNodeText(tempNode);
									}
									obj[sKey] = entCv;
									break;
							}
						}
						this.attributes = obj;
						break;

					case "a:Id":
						this.id = Helper.getNodeText(parentNode);
						break;

					case "a:LogicalName":
						this.logicalName = Helper.getNodeText(parentNode);
						break;

					case "a:FormattedValues":
						let foVal: Node = parentNode;

						for (let o = 0, leno = foVal.childNodes.length; o < leno; o++) {
							// Establish the Key, we are going to fill in the formatted value of the already found attribute
							let foNode: Node = foVal.childNodes[o];
							sKey = Helper.getNodeText(foNode.childNodes[0]);
							this.attributes[sKey].formattedValue = Helper.getNodeText(foNode.childNodes[1]);
							if (isNaN(this.attributes[sKey].value) && this.attributes[sKey].type === "dateTime") {
								this.attributes[sKey].value = new Date(this.attributes[sKey].formattedValue);
							}
						}
						break;
				}
			}
		}
	}

	export class Helper {
		private static clientBaseUrl: string = '';

		static alertMessage(message: string): void {
			(Xrm.Utility !== undefined && Xrm.Utility.alertDialog !== undefined) ? Xrm.Utility.alertDialog(message) : alert(message);
		}

		static crmXmlDecode(s: any): string {
			if ('undefined' === typeof s || 'unknown' === typeof s || null === s) return s;
			if (typeof s != "string") s = s.toString();
			return s;
		}

		static crmXmlEncode(s: any): string {
			if ('undefined' === typeof s || 'unknown' === typeof s || null === s) return s;
			else if (typeof s != "string") s = s.toString();
			return Helper.innerSurrogateAmpersandWorkaround(s);
		}

		static dateReviver(key: any, value: any): any {
			///<summary>
			/// Private function to convert matching string values to Date objects.
			///</summary>
			///<param name="key" type="String">
			/// The key used to identify the object property
			///</param>
			///<param name="value" type="String">
			/// The string value representing a date
			///</param>
			let a;
			if (typeof value === 'string') {
				a = /Date\(([-+]?\d+)\)/.exec(value);
				if (a) {
					return new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
				}
			}
			return value;
		}

		static encodeDate(dateTime: Date): string {
			return dateTime.getFullYear() + "-" +
				Helper.padNumber(dateTime.getMonth() + 1) + "-" +
				Helper.padNumber(dateTime.getDate()) + "T" +
				Helper.padNumber(dateTime.getHours()) + ":" +
				Helper.padNumber(dateTime.getMinutes()) + ":" +
				Helper.padNumber(dateTime.getSeconds());
		}

		static encodeValue(value: any): string {
			// Handle GUIDs wrapped in braces
			if (typeof value == typeof "" && value.slice(0, 1) === "{" && value.slice(-1) === "}") {
				value = value.slice(1, -1);
			}

			return (typeof value === "object" && value.getTime)
				? Helper.encodeDate(value)
				: Helper.crmXmlEncode(value);
		}

		static getNodeName(node: Node): string {
			if (typeof ((<any>node).baseName) != "undefined") {
				return (<any>node).baseName;
			}
			else {
				return node.localName;
			}
		}

		static getNodeText(node: any): string {
			if (typeof (node.text) != "undefined") {
				return node.text;
			}
			else {
				return node.textContent;
			}
		}

		static htmlEncode(s: string): string {
			if (s === null || s === "" || s === undefined) return s;
			let buffer: string = "";
			let hEncode: string = "";
			for (let count: number = 0, cnt: number = 0, sLength: number = s.length; cnt < sLength; cnt++) {
				let c = s.charCodeAt(cnt);
				if (c > 96 && c < 123 || c > 64 && c < 91 || c === 32 || c > 47 && c < 58 || c === 46 || c === 44 || c === 45 || c === 95)
					buffer += String.fromCharCode(c);
				else buffer += "&#" + c + ";";
				if (++count === 500) {
					hEncode += buffer; buffer = ""; count = 0;
				}
			}
			if (buffer.length) hEncode += buffer;
			return hEncode;
		}

		static innerSurrogateAmpersandWorkaround(s: string): string {
			let buffer: string = '';
			let c0: number;
			let cnt: number;
			let cntlength: number;
			for (cnt = 0, cntlength = s.length; cnt < cntlength; cnt++) {
				c0 = s.charCodeAt(cnt);
				if (c0 >= 55296 && c0 <= 57343)
					if (cnt + 1 < s.length) {
						let c1 = s.charCodeAt(cnt + 1);
						if (c1 >= 56320 && c1 <= 57343) {
							buffer += ["CRMEntityReferenceOpen", ((c0 - 55296) * 1024 + (c1 & 1023) + 65536).toString(16), "CRMEntityReferenceClose"].join("");
							cnt++;
						}
						else
							buffer += String.fromCharCode(c0);
					}
					else buffer += String.fromCharCode(c0);
				else buffer += String.fromCharCode(c0);
			}
			s = buffer;
			buffer = "";
			for (cnt = 0, cntlength = s.length; cnt < cntlength; cnt++) {
				c0 = s.charCodeAt(cnt);
				if (c0 >= 55296 && c0 <= 57343)
					buffer += String.fromCharCode(65533);
				else buffer += String.fromCharCode(c0);
			}
			s = buffer;
			s = Helper.htmlEncode(s);
			s = s.replace(/CRMEntityReferenceOpen/g, "&#x");
			s = s.replace(/CRMEntityReferenceClose/g, ";");
			return s;
		}

		static isArray(input: any): boolean {
			return input.constructor.toString().indexOf("Array") !== -1;
		}

		static joinArray(prefix: any, array: any[], suffix: any): string {
			let output: any[] = [];
			for (let i = 0, ilength = array.length; i < ilength; i++) {
				if (array[i] !== "" && array[i] != undefined) {
					output.push(prefix, array[i], suffix);
				}
			}
			return output.join("");
		}

		static joinConditionPair(attributes: any[], values: any[]): string {
			let output = [];
			for (let i = 0, ilength = attributes.length; i < ilength; i++) {
				if (attributes[i] !== "") {
					let value1 = values[i];
					if (typeof value1 == typeof []) {
						output.push("<condition attribute='", attributes[i], "' operator='in' >");

						for (let valueIndex in value1) {
							if (value1.hasOwnProperty(valueIndex)) {
								let value = Helper.encodeValue(value1[valueIndex]);
								output.push("<value>" + value + "</value>");
							}
						}

						output.push("</condition>");
					}
					else if (typeof value1 == typeof "") {
						output.push("<condition attribute='", attributes[i], "' operator='eq' value='", Helper.encodeValue(value1), "' />");
					}
				}
			}
			return output.join("");
		}

		static padNumber(s: any, len: number = 2): string {
			s = '' + s;
			while (s.length < len) {
				s = "0" + s;
			}
			return s;
		}

		/*
		 * setClientUrl :
		 * Experimental. NO SUPPORT.
		 */
		static setClientUrl(url: string) {
			Helper.clientBaseUrl = url;
		}

		static stringToDate(s: string): Date {
			let b: any = s.split(/\D/);
			return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5]));
		}

		static xrmContext(): Context {
			///<summary>
			/// Private function to the context object.
			///</summary>
			///<returns>Context</returns>
			
			let oContext: Context;

			if (Helper.clientBaseUrl === '') {
				let fnWindow: any = window;

				if (typeof fnWindow.GetGlobalContext != "undefined") {
					oContext = fnWindow.GetGlobalContext();
				}
				else if (typeof GetGlobalContext != "undefined") {
					oContext = GetGlobalContext();
				}
				else {
					let fnParentWindow: any = window.parent;
					if (typeof Xrm != "undefined") {
						oContext = Xrm.Page.context;
					}
					else if (typeof fnParentWindow.Xrm != "undefined") {
						oContext = fnParentWindow.Xrm.Page.context;
					}
					else {
						throw new Error("Context is not available.");
					}
				}
			}
			/*
			 * Experimental. NO SUPPORT.
			 */
			else {
				oContext = new XrmContext();
				oContext.getClientUrl = function () {
					return Helper.clientBaseUrl;
				}
			}

			return oContext;
		};
	}

	export class KeyValuePair {
		key: string;
		value: string;
	}

	export class QueryOptions {
		//represents the name of the entity
		entityName: string;
		//represents the attributes of the entity to query
		attributes: string[];
		//represents the values of the attributes to query
		values: any[];
		//represents the attributes of the entity to return
		columnSet: string[];
		//represents the order conditions of the results
		orderBy: string[];

		constructor(queryOptions?: IQueryOpions) {
			if (queryOptions != null) {
				this.entityName = queryOptions.entityName;
				this.attributes = queryOptions.attributes;
				this.values = queryOptions.values;
				this.columnSet = queryOptions.columnSet;
				this.orderBy = queryOptions.orderBy;
			}
		}
	}

	/*
	 * XrmContext :
	 * Experimental implementation of the Context interface
	 * Usage is unsupported. 
	 * You are on your own.
	 */
	export class XrmContext implements Context {
		client: Client;
		/// Returns the base URL that was used to access the application This method is new in Microsoft Dynamics CRM 2011 Update Rollup 12 and the Microsoft Dynamics CRM December 2012 Service Update
		getClientUrl(): string {
			return "Not implemented yet.";
		}; 
		///  Returns a string representing the current Microsoft Office Outlook theme chosen by the user. 
		getCurrentTheme(): string {
			return "Not implemented yet.";
		}; 
		///Returns a bool representing whether autosave is enabled.
		getIsAutoSaveEnabled(): boolean {
			return false;
		}; 
		/// Returns the LCID value that represents the Microsoft Dynamics CRM Language Pack that is the base language for the organization.
		getOrgLcid(): Number {
			return 1033;
		}; 
		/// Returns the unique text value of the organizations name. 
		getOrgUniqueName(): string {
			return "Not implemented yet.";
		}; 
		/// Returns an array of key value pairs representing the query string arguments that were passed to the page.
		getQueryStringParameters(): any[] {
			let queryStringParams: any[] = [];
			return queryStringParams;
		}; 
		/// Returns the GUID value of the SystemUser.id value for the current user. 
		getUserId(): string {
			return "Not implemented yet.";
		}; 
		/// Returns the LCID value that represents the Microsoft Dynamics CRM Language Pack that is the user selected as their preferred language.
		getUserLcid(): Number {
			return 1033;
		}; 
		/// Returns the full name of the current user
		getUserName(): String {
			let userName: String = null;
			return userName;
		}; 
		/// Returns an array of strings representing the GUID values of each of the security roles that the user is associated with.
		getUserRoles(): any[] {
			let userRoles: any[] = [];
			return userRoles;
		}; 
		/// Prepends the organization name to the specified path.
		prependOrgName(sPath: string): string {
			return "Not implemented yet.";
		};
		saveMode: Number;
	}
	
	export class XrmEntityCollection {
		value: any[];
		type: string = 'EntityCollection';

		constructor(xrmEntityCollection?: IXrmEntityCollection) {
			if (xrmEntityCollection != null)
				this.value = xrmEntityCollection.value;
		}
	}	

	export class XrmEntityReference {
		id: string;
		logicalName: string;
		name: string;
		type: string;

		constructor(xrmEntityReference?: IXrmEntityReference) {
			if (xrmEntityReference != null) {
				this.id = xrmEntityReference.id;
				this.logicalName = xrmEntityReference.logicalName;
				this.name = xrmEntityReference.name;
				this.type = xrmEntityReference.type != null ? xrmEntityReference.type : 'EntityReference';
			}
			else {
				this.type = 'EntityReference';
			}
		}
	}

	export class XrmOptionSetValue {
		value: number;
		formattedValue: string;
		type: string = 'OptionSetValue';

		constructor(xrmOptionSetValue?: IXrmOptionSetValue) {
			if (xrmOptionSetValue != null) {
				this.value = xrmOptionSetValue.value;
				this.formattedValue = xrmOptionSetValue.formattedValue;
				this.type = xrmOptionSetValue.type != null ? xrmOptionSetValue.type : 'OptionSetValue';
			}
		}
	}

	export class XrmValue {
		type: string;
		value: any;

		constructor(xrmValue?: IXrmValue) {
			if (xrmValue != null) {
				this.type = xrmValue.type;
				this.value = xrmValue.value;
			}
		}
	}
}

/**
 * ngXrm.XrmServiceToolkit.Common.Soap
 * A common module for the ngXrm.XrmServiceToolkit.Soap module.
 */
module ngXrm.XrmServiceToolkit.Common.Soap {
	import Common = ngXrm.XrmServiceToolkit.Common;

	
}

/**
 * ngXrm.XrmServiceToolkit.Common.Rest
 * A common module for the  ngXrm.XrmServiceToolkit.Rest module.
 */
module ngXrm.XrmServiceToolkit.Common.Rest {
	export interface IRestGet {
		requestUrl: string;
		httpConfig?: any;
	}

	export class RestGet {
		requestUrl: string;
		object: any;
		httpConfig: any;

		constructor(restGet: IRestGet) {
			this.requestUrl = restGet.requestUrl;
			this.httpConfig = restGet.httpConfig;
		}
	}

	export interface IRestPost{
		requestUrl: string;
		object?: any;
		httpConfig?: any;
	}

	export class RestPost {
		requestUrl: string;
		object: any;
		httpConfig: any;

		constructor(restPost: IRestPost) {
			this.requestUrl = restPost.requestUrl;
			this.object = restPost.object;
			this.httpConfig = restPost.httpConfig;
		}
	}
}

/**
* ngXrm.XrmServiceToolkit.Soap based on XrmServiceToolkit.Soap
*/
module ngXrm.XrmServiceToolkit.Soap {
	import Common = ngXrm.XrmServiceToolkit.Common;
	import CommonSoap = ngXrm.XrmServiceToolkit.Common.Soap;

	export interface ISoapClient {
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
	}

	export class SoapClient implements ISoapClient {
		static id: string = "ngXrm.XrmServiceToolkit.Soap.SoapClient";
		static $inject: string[] = ["$http"];

		// Added in 1.4.1 for metadata retrieval 
		// Inspired From Microsoft SDK code to retrieve Metadata using JavaScript
		// Copyright (C) Microsoft Corporation.  All rights reserved.
		arrayElements = ["Attributes",
			"ManyToManyRelationships",
			"ManyToOneRelationships",
			"OneToManyRelationships",
			"Privileges",
			"LocalizedLabels",
			"Options",
			"Targets"];

		constructor(private $http: ng.IHttpService) {

		}

		//***************
		// Helper Methods
		//***************

		__isMetadataArray(elementName: string): boolean {
			const self = this;
			for (let i = 0, ilength = self.arrayElements.length; i < ilength; i++) {
				if (elementName === self.arrayElements[i]) {
					return true;
				}
			}
			return false;
		}

		__isNodeNull(node: Node): boolean {
			if (node == null)
			{ return true; }
			if ((node.attributes.getNamedItem("i:nil") != null) && (node.attributes.getNamedItem("i:nil").value === "true"))
			{ return true; }
			return false;
		}

		__nsResolver(prefix: string): string {
			let ns = {
				"s": "http://schemas.xmlsoap.org/soap/envelope/",
				"a": "http://schemas.microsoft.com/xrm/2011/Contracts",
				"i": "http://www.w3.org/2001/XMLSchema-instance",
				"b": "http://schemas.datacontract.org/2004/07/System.Collections.Generic",
				"c": "http://schemas.microsoft.com/xrm/2011/Metadata",
				"ser": "http://schemas.microsoft.com/xrm/2011/Contracts/Services"
			};
			return ns[prefix] || null;
		}

		__objectifyNode(node: Node): any {
			const self = this;
			//Check for null
			if (node.attributes != null && node.attributes.length === 1) {
				if (node.attributes.getNamedItem("i:nil") != null && node.attributes.getNamedItem("i:nil").nodeValue === "true") {
					return null;
				}
			}

			//Check if it is a value
			if ((node.firstChild != null) && (node.firstChild.nodeType === 3)) {
				let nodeName: string = Common.Helper.getNodeName(node);

				switch (nodeName) {
					//Integer Values        
					case "ActivityTypeMask":
					case "ObjectTypeCode":
					case "ColumnNumber":
					case "DefaultFormValue":
					case "MaxValue":
					case "MinValue":
					case "MaxLength":
					case "Order":
					case "Precision":
					case "PrecisionSource":
					case "LanguageCode":
						return parseInt(node.firstChild.nodeValue, 10);
					// Boolean values
					case "AutoRouteToOwnerQueue":
					case "CanBeChanged":
					case "CanTriggerWorkflow":
					case "IsActivity":
					case "IsActivityParty":
					case "IsAvailableOffline":
					case "IsChildEntity":
					case "IsCustomEntity":
					case "IsCustomOptionSet":
					case "IsDocumentManagementEnabled":
					case "IsEnabledForCharts":
					case "IsGlobal":
					case "IsImportable":
					case "IsIntersect":
					case "IsManaged":
					case "IsReadingPaneEnabled":
					case "IsValidForAdvancedFind":
					case "CanBeSecuredForCreate":
					case "CanBeSecuredForRead":
					case "CanBeSecuredForUpdate":
					case "IsCustomAttribute":
					case "IsPrimaryId":
					case "IsPrimaryName":
					case "IsSecured":
					case "IsValidForCreate":
					case "IsValidForRead":
					case "IsValidForUpdate":
					case "IsCustomRelationship":
					case "CanBeBasic":
					case "CanBeDeep":
					case "CanBeGlobal":
					case "CanBeLocal":
						return (node.firstChild.nodeValue === "true") ? true : false;
					//OptionMetadata.Value and BooleanManagedProperty.Value and AttributeRequiredLevelManagedProperty.Value
					case "Value":
						//BooleanManagedProperty.Value
						if ((node.firstChild.nodeValue === "true") || (node.firstChild.nodeValue === "false")) {
							return (node.firstChild.nodeValue === "true") ? true : false;
						}
						//AttributeRequiredLevelManagedProperty.Value
						if (
							(node.firstChild.nodeValue === "ApplicationRequired") ||
							(node.firstChild.nodeValue === "None") ||
							(node.firstChild.nodeValue === "Recommended") ||
							(node.firstChild.nodeValue === "SystemRequired")
							) {
							return node.firstChild.nodeValue;
						}
						else {
							//OptionMetadata.Value
							return parseInt(node.firstChild.nodeValue, 10);
						}
						// ReSharper disable JsUnreachableCode
						break;
					// ReSharper restore JsUnreachableCode   
					//String values        
					default:
						return node.firstChild.nodeValue;
				}

			}

			//Check if it is a known array
			if (self.__isMetadataArray(Common.Helper.getNodeName(node))) {
				let arrayValue = [];
				for (let iii = 0, tempLength = node.childNodes.length; iii < tempLength; iii++) {
					let objectTypeName;
					if ((node.childNodes[iii].attributes != null) && (node.childNodes[iii].attributes.getNamedItem("i:type") != null)) {
						objectTypeName = node.childNodes[iii].attributes.getNamedItem("i:type").nodeValue.split(":")[1];
					}
					else {

						objectTypeName = Common.Helper.getNodeName(node.childNodes[iii]);
					}

					let b = self.__objectifyNode(node.childNodes[iii]);
					b._type = objectTypeName;
					arrayValue.push(b);

				}

				return arrayValue;
			}

			//Null entity description labels are returned as <label/> - not using i:nil = true;
			if (node.childNodes.length === 0) {
				return null;
			}

			//Otherwise return an object
			let c: any = {};
			if (node.attributes.getNamedItem("i:type") != null) {
				c._type = node.attributes.getNamedItem("i:type").nodeValue.split(":")[1];
			}
			for (let i = 0, ilength = node.childNodes.length; i < ilength; i++) {
				if (node.childNodes[i].nodeType === 3) {
					c[Common.Helper.getNodeName(node.childNodes[i])] = node.childNodes[i].nodeValue;
				}
				else {
					c[Common.Helper.getNodeName(node.childNodes[i])] = self.__objectifyNode(node.childNodes[i]);
				}

			}
			return c;
		}

		__orgServicePath(xrmContext: Context): string {
			///<summary>
			/// Private function to return the path to the organization service.
			///</summary>
			///<returns>String</returns>
			const self = this;
			return [xrmContext.getClientUrl(), "/XRMServices/2011/Organization.svc/web"].join("");
		}

		__selectNodes(node: any, xPathExpression: string): any[] {
			const self = this;
			if (typeof (node.selectNodes) != "undefined") {
				return node.selectNodes(xPathExpression);
			}
			else {
				let output = [];
				let xPathResults = node.evaluate(xPathExpression, node, self.__nsResolver, XPathResult.ANY_TYPE, null);
				let result = xPathResults.iterateNext();
				while (result) {
					output.push(result);
					result = xPathResults.iterateNext();
				}
				return output;
			}
		}

		__selectSingleNode(node: any, xpathExpr: string): Node {
			const self = this;
			if (typeof (node.selectSingleNode) != "undefined") {
				return node.selectSingleNode(xpathExpr);
			}
			else {
				let xpe = new XPathEvaluator();
				let results = xpe.evaluate(xpathExpr, node, { lookupNamespaceURI: self.__nsResolver }, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
				return results.singleNodeValue;
			}
		}

		__selectSingleNodeText(node: any, xpathExpr: string): string {
			const self = this;
			let x: Node = self.__selectSingleNode(node, xpathExpr);
			if (self.__isNodeNull(x))
			{ return null; }
			if (typeof ((<any>x).text) != "undefined") {
				return (<any>x).text;
			}
			else {
				return x.textContent;
			}
		}

		__setSelectionNamespaces(doc: any): void {
			let namespaces = [
				"xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'",
				"xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'",
				"xmlns:i='http://www.w3.org/2001/XMLSchema-instance'",
				"xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'",
				"xmlns:c='http://schemas.microsoft.com/xrm/2011/Metadata'",
				"xmlns:ser='http://schemas.microsoft.com/xrm/2011/Contracts/Services'"
			];
			doc.setProperty("SelectionNamespaces", namespaces.join(" "));
		}

		__xmlParser(txt: string): any {
			///<summary>
			/// cross browser responseXml to return a XML object
			///</summary>
			let xmlDoc: any = null;
			let fnWindow: any = Window;
			try {
				xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = false;
				xmlDoc.loadXML(txt);
			} catch (e) {
				if (fnWindow.DOMParser) {
					// ReSharper disable InconsistentNaming
					let parser = new DOMParser();
					// ReSharper restore InconsistentNaming
					xmlDoc = parser.parseFromString(txt, "text/xml");
				} else {
					Common.Helper.alertMessage("Cannot convert the XML string to a cross-browser XML object.");
				}
			}

			return xmlDoc;
		}

		__xmlToString(responseXml: any): string {
			const self = this;
			let xmlString: string = '';
			try {
				if (responseXml != null) {
					if (typeof XMLSerializer !== "undefined" && typeof responseXml.xml === "undefined") {
						// ReSharper disable InconsistentNaming
						xmlString = (new XMLSerializer()).serializeToString(responseXml);
						// ReSharper restore InconsistentNaming
					} else {
						if (typeof responseXml.xml !== "undefined") {
							xmlString = responseXml.xml;
						}
						else if (typeof responseXml[0].xml !== "undefined") {
							xmlString = responseXml[0].xml;
						}

					}
				}
			} catch (e) {
				Common.Helper.alertMessage("Cannot convert the XML to a string.");
			}
			return xmlString;
		}

		//*******************
		// Actual Xrm Methods
		//*******************

		/**
		* doRequest : 
		* Executes the soap request using $http
		*/
		private _doRequest(soapBody: string, requestType: string): ng.IPromise<any> {
			const self = this;
			// Wrap the Soap Body in a soap:Envelope.
			let soapXml =
				["<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>",
					"<soap:Body>",
					"<", requestType, " xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>", soapBody, "</", requestType, ">",
					"</soap:Body>",
					"</soap:Envelope>"
				].join("");

			let httpConfig: any = {
				headers: {
					'Accept': 'application/xml, text/xml, */*',
					'Content-Type': 'text/xml; charset=utf-8',
					'SOAPAction': "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/" + requestType
				}
			};

			try {

				return self.$http.post(self.__orgServicePath(Common.Helper.xrmContext()), soapXml, httpConfig)
					.then(
						(rslt: any) => {
							let result: any = self.__xmlParser(rslt.data);
							try { self.__setSelectionNamespaces(result); } catch (e) { }
							return result;
						}
						//,
						//(reason: any) => {

						//}
					)
					.catch((error: any) => {
						return Q.reject(error);
					})
					;
			} catch (ex) {
				return Q.reject(ex);
			}		
		}		

		/**
		 *  createEntity : 
		 * Sends a $http request to create a new record.
		 * Tested : Success
		 */
		createEntity(bEntity: Common.BusinessEntity): ng.IPromise<string> {
			///<param name="be" type="Object">
			/// A JavaScript object with properties corresponding to the Schema name of
			/// entity attributes that are valid for create operations.
			/// </param>
			const self = this;
			let request: string = bEntity.serialize();

			let mBody: string =
				["<request i:type='a:CreateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
					"<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
					"<a:KeyValuePairOfstringanyType>",
					"<b:key>Target</b:key>",
					request,
					"</a:KeyValuePairOfstringanyType>",
					"</a:Parameters>",
					"<a:RequestId i:nil='true' />",
					"<a:RequestName>Create</a:RequestName>",
					"</request>"].join("");

			return self._doRequest(mBody, "Execute").then((rslt) => {
				let response = self.__selectSingleNodeText(rslt, "//b:value");
				let result = Common.Helper.crmXmlDecode(response);

				return result;
			});
		}

		/**
		 * updateEntity : 
		 * Sends $http request to update an existing record.
		 * Tested : Success
		 */
		updateEntity(bEntity: Common.BusinessEntity): ng.IPromise<string> {
			///<param name="businessEntity" type="Object">
			/// A JavaScript object with properties corresponding to the Schema name of
			/// entity attributes that are valid for update operations.
			/// </param>
			const self = this;
			let request: string = bEntity.serialize();

			let mBody: string =
				["<request i:type='a:UpdateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
					"<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
					"<a:KeyValuePairOfstringanyType>",
					"<b:key>Target</b:key>",
					request,
					"</a:KeyValuePairOfstringanyType>",
					"</a:Parameters>",
					"<a:RequestId i:nil='true' />",
					"<a:RequestName>Update</a:RequestName>",
					"</request>"].join("");

			return self._doRequest(mBody, "Execute").then((rslt) => {
				let response : string = self.__selectSingleNodeText(rslt, "//a:Results");
				let result : string = Common.Helper.crmXmlDecode(response);

				return result;
			});
		}

		/**
		 * deleteEntity : 
		 * Sends $http request to delete a record.
		 * Tested : Success
		 */
		deleteEntity(entityName: string, id: string): ng.IPromise<string> {
			///<param name="entityName" type="String">
			/// A JavaScript String corresponding to the Schema name of
			/// entity that is used for delete operations.
			/// </param>
			///<param name="id" type="String">
			/// A JavaScript String corresponding to the GUID of
			/// entity that is used for delete operations.
			/// </param>
			const self = this;
			let request: string =
				[
					"<request i:type='a:DeleteRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'><a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'><a:KeyValuePairOfstringanyType><b:key>Target</b:key><b:value i:type='a:EntityReference'><a:Id>",
					id, "</a:Id><a:LogicalName>",
					entityName, "</a:LogicalName><a:Name i:nil='true' /></b:value></a:KeyValuePairOfstringanyType></a:Parameters><a:RequestId i:nil='true' /><a:RequestName>Delete</a:RequestName></request>"
				].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				let response = self.__selectSingleNodeText(rslt, "//a:Results");
				let result = Common.Helper.crmXmlDecode(response);

				return result;

			});
		}

		/**
		 * execute : 
		 * Sends $http request to execute a soap request.
		 * Tested : Success
		 */
		execute(request: string): ng.IPromise<any> {
			///<param name="request" type="String">
			/// A JavaScript string corresponding to the soap request
			/// that are valid for execute operations.
			/// </param>
			const self = this;

			return self._doRequest(request, "Execute").then((rslt) => {
				return rslt;
			});
		}

		/**
		 * fetchMore : 
		 * Executes fetchXml for the next page of the results (returns 5000 records max).
		 * Tested : Untested
		 */
		private _doFetch(fetchCoreXml: string, pageNumber: number, pageCookie: string): ng.IPromise<Common.BusinessEntity[]> {
			const self = this;

			let fetchXml: string = fetchCoreXml;
			
			if (pageNumber > 1)
				fetchXml =
					[
						"<fetch mapping='logical' page='" + pageNumber.toString() + "' count='5000' paging-cookie='" + pageCookie + "'>",
						fetchCoreXml.replace(/\"/g, "'"),
						"</fetch>"
					].join("");

			let msgBody: string = [
				"<request i:type='a:RetrieveMultipleRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
				"<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>Query</b:key>",
				"<b:value i:type='a:FetchExpression'>",
				"<a:Query>", Common.Helper.crmXmlEncode(fetchXml), "</a:Query>",
				"</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil='true'/>",
				"<a:RequestName>RetrieveMultiple</a:RequestName>",
				"</request>"
			].join("");


			return self._doRequest(msgBody, "Execute")
				.then((rslt) => {
					return rslt;
				})
				.catch((error: any) => {
					return Q.reject(error);
				});
		}

		/**
		 * fetch : 
		 * Sends $http request to do a fetch request.
		 * Tested : Success
		 */
		fetch(fetchCore: string, fetchAll: boolean, maxFetch?: number): ng.IPromise<Common.BusinessEntity[]> {
			///<param name="fetchCore" type="String">
			/// A JavaScript String containing serialized XML using the FetchXML schema.
			/// For efficiency, start with the "entity" node.
			/// </param>
			///<param name="fetchAll" type="boolean">
			/// A boolean indicating if we want to retrieve all records for the provided fetchXml.
			/// When false, maximum 5000 records are returned. You can set a lower maximum yourself in your fetchXml.
			///</param>
			///<param name="maxFetch" type="number">
			/// When fetchAll is true, but you are not sure of the total amount of records you have for the fetchXml,
			/// you can set a maximum number of returned records.
			/// Pick a value that's a multiple of 5000. If not, the fetch method will round to the NEXT 5000.
			///</param>
			const self = this;
			let defer: Q.Deferred<Common.BusinessEntity[]> = Q.defer<Common.BusinessEntity[]>();			

			let fetchXml: string = fetchCore;
			let maxFetchRecords: number = maxFetch != null ? maxFetch : -1;

			if (fetchCore.slice(0, 7) === "<entity") {
				fetchXml =
				[
					"<fetch mapping='logical'>",
					fetchCore.replace(/\"/g, "'"),
					"</fetch>"
				].join("");
			} else {
				let isAggregate: boolean = (fetchCore.indexOf("aggregate=") !== -1);
				let isLimitedReturn: boolean = (fetchCore.indexOf("page='1'") !== -1 && fetchCore.indexOf("count='") !== -1);

				let distinctPos: number = fetchCore.indexOf("distinct=");
				let isDistinct: boolean = (distinctPos !== -1);
				let valQuotes: string = fetchCore.substring(distinctPos + 9, distinctPos + 10);
				let distinctValue: string = isDistinct
					? fetchCore.substring(fetchCore.indexOf("distinct=") + 10, fetchCore.indexOf(valQuotes, fetchCore.indexOf("distinct=") + 10))
					: "false";
				let xmlDoc: string = self.__xmlParser(fetchCore);
				let fetchEntity: Node = self.__selectSingleNode(xmlDoc, "//entity");
				if (fetchEntity === null) {
					Q.reject("XrmServiceToolkit.Fetch: No 'entity' node in the provided FetchXML.");
				}
				let fetchCoreDom: Node = fetchEntity;
				try {
					fetchCore = self.__xmlToString(fetchCoreDom).replace(/\"/g, "'");
				}
				catch (error) {
					if (fetchCoreDom !== undefined && (<any>fetchCoreDom).xml) {
						fetchCore = (<any>fetchCoreDom).xml.replace(/\"/g, "'");
					}
					else {
						Q.reject("XrmServiceToolkit.Fetch: This client does not provide the necessary XML features to continue.");
					}
				}

				if (!isAggregate && !isLimitedReturn) {
					fetchXml =
					[
						"<fetch mapping='logical' distinct='" + (isDistinct ? distinctValue : "false") + "' >",
						fetchCore,
						"</fetch>"
					].join("");
				}
			}
			let pageNumber: number = 1;
			let resultArray: Common.BusinessEntity[] = [];
			let recursiveFn = function (rslt: any) {
				//TODO: test when rslt has no records
				if (rslt != null) {
					let fetchResult: Node = self.__selectSingleNode(rslt, "//a:Entities");
					let moreRecords: boolean = (self.__selectSingleNodeText(rslt, "//a:MoreRecords") === "true");

					if (fetchResult != null) {
						for (let ii = 0, olength = fetchResult.childNodes.length; ii < olength; ii++) {
							let entity: Common.BusinessEntity = new Common.BusinessEntity();

							entity.deserialize(fetchResult.childNodes[ii]);
							resultArray.push(entity);
						}

						if (fetchAll && moreRecords && (maxFetchRecords === -1 || resultArray.length <= maxFetchRecords)) {
							let pageCookie = self.__selectSingleNodeText(rslt, "//a:PagingCookie").replace(/\"/g, '\'').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&quot;');
							pageNumber += 1;
							self._doFetch(fetchCore, pageNumber, pageCookie)
								.then(recursiveFn)
								.catch((error: any) => {
									return defer.reject(error);
								});
						}
						else
							defer.resolve(resultArray);
					}
				}		
			}

			self._doFetch(fetchXml, pageNumber, null)
				.then(recursiveFn)
				.catch((error: any) => {
					return defer.reject(error);
				});

			return defer.promise;
		}

		/**
		 * retrieveEntity : 
		 * Sends $http request to retrieve a record.
		 * Tested : Success
		 */
		retrieveEntity(entityName: string, id: string, columnSet: string[]): ng.IPromise<Common.BusinessEntity> {
			///<param name="entityName" type="String">
			/// A JavaScript String corresponding to the Schema name of
			/// entity that is used for retrieve operations.
			/// </param>
			///<param name="id" type="String">
			/// A JavaScript String corresponding to the GUID of
			/// entity that is used for retrieve operations.
			/// </param>
			///<param name="columnSet" type="Array">
			/// A JavaScript Array corresponding to the attributes of
			/// entity that is used for retrieve operations.
			/// </param>
			const self = this;
			let attributes: string = "";
			let query: string = "";
			if (columnSet != null) {
				for (let i = 0, ilength = columnSet.length; i < ilength; i++) {
					attributes += "<c:string>" + columnSet[i] + "</c:string>";
				}
				query = "<a:AllColumns>false</a:AllColumns>" +
				"<a:Columns xmlns:c='http://schemas.microsoft.com/2003/10/Serialization/Arrays'>" +
				attributes +
				"</a:Columns>";
			}
			else {
				query = "<a:AllColumns>true</a:AllColumns><a:Columns xmlns:b='http://schemas.microsoft.com/2003/10/Serialization/Arrays' />";
			}

			let msgBody: string =
				[
					"<request i:type='a:RetrieveRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
					"<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
					"<a:KeyValuePairOfstringanyType>",
					"<b:key>Target</b:key>",
					"<b:value i:type='a:EntityReference'>",
					"<a:Id>", Common.Helper.encodeValue(id), "</a:Id>",
					"<a:LogicalName>", entityName, "</a:LogicalName>",
					"<a:Name i:nil='true' />",
					"</b:value>",
					"</a:KeyValuePairOfstringanyType>",
					"<a:KeyValuePairOfstringanyType>",
					"<b:key>ColumnSet</b:key>",
					"<b:value i:type='a:ColumnSet'>",
					query,
					"</b:value>",
					"</a:KeyValuePairOfstringanyType>",
					"</a:Parameters>",
					"<a:RequestId i:nil='true' />",
					"<a:RequestName>Retrieve</a:RequestName>",
					"</request>"
				].join("");

			return self._doRequest(msgBody, "Execute").then((rslt) => {
				let retrieveResult: Node = self.__selectSingleNode(rslt, "//b:value");
				let entity: Common.BusinessEntity = new Common.BusinessEntity();
				entity.deserialize(retrieveResult);

				return entity;
			});
		}

		/**
		 *  retrieveMultiple : 
		 * Sends $http request to do a retrieveMultiple request.
		 * Tested : Success
		 */
		retrieveMultiple(query: string): ng.IPromise<Common.BusinessEntity[]> {
			///<param name="query" type="String">
			/// A JavaScript String with properties corresponding to the retrievemultiple request
			/// that are valid for retrievemultiple operations.
			/// </param>
			const self = this;
			let request: string = [
				"<request i:type='a:RetrieveMultipleRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
				"<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>Query</b:key>",
				"<b:value i:type='a:QueryExpression'>",
				query,
				"</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil='true'/>",
				"<a:RequestName>RetrieveMultiple</a:RequestName>",
				"</request>"
			].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				let resultNodes: Node = self.__selectSingleNode(rslt, "//a:Entities");
				let retriveMultipleResults: Common.BusinessEntity[] = [];

				for (let i = 0, ilength = resultNodes.childNodes.length; i < ilength; i++) {
					let entity: Common.BusinessEntity = new Common.BusinessEntity();

					entity.deserialize(resultNodes.childNodes[i]);
					retriveMultipleResults[i] = entity;
				}

				return retriveMultipleResults;
			});
		}

		private _doQueryByAttribute(queryOptions: Common.QueryOptions, queryAll: boolean, maxRecords?: number): ng.IPromise<Common.BusinessEntity[]> {
			///<param name="queryOptions" type="Object">
			/// A JavaScript Object with properties corresponding to the queryByAttribute Criteria
			/// that are valid for queryByAttribute operations.
			/// queryOptions.entityName is a string represents the name of the entity
			/// queryOptions.attributes is a array represents the attributes of the entity to query
			/// queryOptions.values is a array represents the values of the attributes to query
			/// queryOptions.columnSet is a array represents the attributes of the entity to return
			/// queryOptions.orderBy is a array represents the order conditions of the results
			/// </param>
			///<param name="queryAll" type="boolean">
			/// True : This is to return all records (>5k+).
			///</param>
			///<param name="maxRecords" type="number">
			/// When queryAll equals True but you don't want to return too much,
			/// this options set a maximum number to return.
			///</param>
			const self = this;

			if (queryOptions.entityName === undefined || queryOptions.entityName === ''
				|| queryOptions.columnSet === undefined || queryOptions.columnSet.length === 0
				|| queryOptions.attributes === undefined || queryOptions.attributes.length === 0
				|| queryOptions.values === undefined || queryOptions.values.length === 0) {
				return Q.reject("QueryOptions are invalid.");
			}

			if (queryOptions.attributes.length !== queryOptions.values.length)
				return Q.reject("The number of values must match the number of attributes provided.");

			let xml: string =
				[
					"<entity name='", queryOptions.entityName, "'>",
					Common.Helper.joinArray("<attribute name='", queryOptions.columnSet, "' />"),
					Common.Helper.joinArray("<order attribute='", queryOptions.orderBy || [''], "' />"),
					"<filter>",
					Common.Helper.joinConditionPair(queryOptions.attributes, queryOptions.values),
					"</filter>",
					"</entity>"
				].join("");

			return self.fetch(xml, queryAll, maxRecords);
		}

		/**
		 * queryByAttribute : 
		 * Sends $http request to do a queryByAttribute request.
		 * Tested : Untested
		 */
		queryByAttribute(queryOptions: Common.QueryOptions): ng.IPromise<Common.BusinessEntity[]> {
			///<param name="queryOptions" type="Object">
			/// A JavaScript Object with properties corresponding to the queryByAttribute Criteria
			/// that are valid for queryByAttribute operations.
			/// queryOptions.entityName is a string represents the name of the entity
			/// queryOptions.attributes is a array represents the attributes of the entity to query
			/// queryOptions.values is a array represents the values of the attributes to query
			/// queryOptions.columnSet is a array represents the attributes of the entity to return
			/// queryOptions.orderBy is a array represents the order conditions of the results
			/// </param>
			const self = this;

			return self._doQueryByAttribute(queryOptions, false);
		}

		/**
		 * queryAll : 
		 * Sends $http request to do a queryAll request. This is to return all records (>5k+).
		 * Consider Performance impact when using this method.
		 * Tested : Success
		 */
		queryAllByAttribute(queryOptions: Common.QueryOptions, maxRecords?: number): ng.IPromise<Common.BusinessEntity[]> {
			///<param name="queryOptions" type="Object">
			/// A JavaScript Object with properties corresponding to the queryByAttribute Criteria
			/// that are valid for queryByAttribute operations.
			/// queryOptions.entityName is a string represents the name of the entity
			/// queryOptions.attributes is a array represents the attributes of the entity to query
			/// queryOptions.values is a array represents the values of the attributes to query
			/// queryOptions.columnSet is a array represents the attributes of the entity to return
			/// queryOptions.orderBy is a array represents the order conditions of the results
			/// </param>
			///<param name="maxRecords" type="number">
			/// When queryAll equals True but you don't want to return too much,
			/// this options set a maximum number to return.
			///</param>
			const self = this;

			return self._doQueryByAttribute(queryOptions, true, maxRecords);
		}

		/**
		 * setState :
		 * Sends $htpp request to setState of a record.
		 * Tested : Success
		 */
		setState(entityName: string, id: string, stateCode: number, statusCode: number): ng.IPromise<string> {
			///<param name="entityName" type="String">
			/// A JavaScript String corresponding to the Schema name of
			/// entity that is used for setState operations.
			/// </param>
			///<param name="id" type="String">
			/// A JavaScript String corresponding to the GUID of
			/// entity that is used for setState operations.
			/// </param>
			///<param name="stateCode" type="Int">
			/// A JavaScript Integer corresponding to the value of
			/// entity state that is used for setState operations.
			/// </param>
			///<param name="statusCode" type="Int">
			/// A JavaScript Integer corresponding to the value of
			/// entity status that is used for setState operations.
			/// </param>
			const self = this;
			let request: string = [
				"<request i:type='b:SetStateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
				"<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>EntityMoniker</c:key>",
				"<c:value i:type='a:EntityReference'>",
				"<a:Id>", Common.Helper.encodeValue(id), "</a:Id>",
				"<a:LogicalName>", entityName, "</a:LogicalName>",
				"<a:Name i:nil='true' />",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>State</c:key>",
				"<c:value i:type='a:OptionSetValue'>",
				"<a:Value>", stateCode.toString(), "</a:Value>",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>Status</c:key>",
				"<c:value i:type='a:OptionSetValue'>",
				"<a:Value>", statusCode.toString(), "</a:Value>",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil='true' />",
				"<a:RequestName>SetState</a:RequestName>",
				"</request>"
			].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				let responseText: string = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
				let result: string = Common.Helper.crmXmlDecode(responseText);
				return result;

			});
		}

		/**
		 * associate :
		 * Sends $http request to associate records.
		 * Tested : Success
		 */
		associate(relationshipName: string, targetEntityName: string, targetId: string, relatedEntityName: string, relatedBusinessEntities: Common.BusinessEntity[]): ng.IPromise<string> {
			///<param name="relationshipName" type="String">
			/// A JavaScript String corresponding to the relationship name
			/// that is used for associate operations.
			/// </param>
			///<param name="targetEntityName" type="String">
			/// A JavaScript String corresponding to the schema name of the target entity
			/// that is used for associate operations.
			/// </param>
			///<param name="targetId" type="String">
			/// A JavaScript String corresponding to the GUID of the target entity
			/// that is used for associate operations.
			/// </param>
			///<param name="relatedEntityName" type="String">
			/// A JavaScript String corresponding to the schema name of the related entity
			/// that is used for associate operations.
			/// </param>
			///<param name="relationshipBusinessEntities" type="Array">
			/// A JavaScript Array corresponding to the collection of the related entities as BusinessEntity
			/// that is used for associate operations.
			/// </param>
			const self = this;
			let relatedEntities: Common.BusinessEntity[] = relatedBusinessEntities;

			let output: any[] = [];
			for (let i = 0, ilength = relatedEntities.length; i < ilength; i++) {
				if (relatedEntities[i].id !== "") {
					output.push("<a:EntityReference>",
						"<a:Id>", relatedEntities[i].id, "</a:Id>",
						"<a:LogicalName>", relatedEntityName, "</a:LogicalName>",
						"<a:Name i:nil='true' />",
						"</a:EntityReference>");
				}
			}

			let relatedXml: string = output.join("");

			let request: string = [
				"<request i:type='a:AssociateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
				"<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>Target</b:key>",
				"<b:value i:type='a:EntityReference'>",
				"<a:Id>", Common.Helper.encodeValue(targetId), "</a:Id>",
				"<a:LogicalName>", targetEntityName, "</a:LogicalName>",
				"<a:Name i:nil='true' />",
				"</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>Relationship</b:key>",
				"<b:value i:type='a:Relationship'>",
				"<a:PrimaryEntityRole>Referenced</a:PrimaryEntityRole>",
				"<a:SchemaName>", relationshipName, "</a:SchemaName>",
				"</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>RelatedEntities</b:key>",
				"<b:value i:type='a:EntityReferenceCollection'>",
				relatedXml,
				"</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil='true' />",
				"<a:RequestName>Associate</a:RequestName>",
				"</request>"
			].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				let responseText: string = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
				let result: string = Common.Helper.crmXmlDecode(responseText);
				return result;
			});
		}

		/**
		 * disassociate :
		 * Sends $http request to disassociate records.
		 * Tested : Success
		 */
		disassociate(relationshipName: string, targetEntityName: string, targetId: string, relatedEntityName: string, relatedBusinessEntities: Common.BusinessEntity[]): ng.IPromise<string> {
			///<param name="relationshipName" type="String">
			/// A JavaScript String corresponding to the relationship name
			/// that is used for disassociate operations.
			/// </param>
			///<param name="targetEntityName" type="String">
			/// A JavaScript String corresponding to the schema name of the target entity
			/// that is used for disassociate operations.
			/// </param>
			///<param name="targetId" type="String">
			/// A JavaScript String corresponding to the GUID of the target entity
			/// that is used for disassociate operations.
			/// </param>
			///<param name="relatedEntityName" type="String">
			/// A JavaScript String corresponding to the schema name of the related entity
			/// that is used for disassociate operations.
			/// </param>
			///<param name="relationshipBusinessEntities" type="Array">
			/// A JavaScript Array corresponding to the collection of the related entities as BusinessEntity
			/// that is used for disassociate operations.
			/// </param>
			const self = this;
			let relatedEntities: Common.BusinessEntity[] = relatedBusinessEntities;

			let output: any[] = [];
			for (let i = 0, ilength = relatedEntities.length; i < ilength; i++) {
				if (relatedEntities[i].id !== "") {
					output.push("<a:EntityReference>",
						"<a:Id>", relatedEntities[i].id, "</a:Id>",
						"<a:LogicalName>", relatedEntityName, "</a:LogicalName>",
						"<a:Name i:nil='true' />",
						"</a:EntityReference>");
				}
			}

			let relatedXml: string = output.join("");

			let request: string = [
				"<request i:type='a:DisassociateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
				"<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>Target</b:key>",
				"<b:value i:type='a:EntityReference'>",
				"<a:Id>", Common.Helper.encodeValue(targetId), "</a:Id>",
				"<a:LogicalName>", targetEntityName, "</a:LogicalName>",
				"<a:Name i:nil='true' />",
				"</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>Relationship</b:key>",
				"<b:value i:type='a:Relationship'>",
				"<a:PrimaryEntityRole i:nil='true' />",
				"<a:SchemaName>", relationshipName, "</a:SchemaName>",
				"</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>RelatedEntities</b:key>",
				"<b:value i:type='a:EntityReferenceCollection'>",
				relatedXml,
				"</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil='true' />",
				"<a:RequestName>Disassociate</a:RequestName>",
				"</request>"
			].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				let responseText: string = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
				let result: string = Common.Helper.crmXmlDecode(responseText);
				return result;
			});
		}

		/**
		 * getCurrentUserId :
		 * Sends $http request to retrieve the GUID of the current user.
		 * Tested : Success
		 */
		getCurrentUserId(): ng.IPromise<string> {
			///<summary>
			/// Sends synchronous request to retrieve the GUID of the current user.
			///</summary>
			const self = this;
			let request: string = [
				"<request i:type='b:WhoAmIRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
				"<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />",
				"<a:RequestId i:nil='true' />",
				"<a:RequestName>WhoAmI</a:RequestName>",
				"</request>"
			].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				return Common.Helper.getNodeText(self.__selectNodes(rslt, "//b:value")[0]);
			});
		}

		/**
		 * getCurrentUserBusinessUnitId : 
		 * Sends $http request to retrieve the GUID of the current user's business unit.
		 * Tested : Success
		 */
		getCurrentUserBusinessUnitId(): ng.IPromise<string> {
			const self = this;
			let request: string = ["<request i:type='b:WhoAmIRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
				"<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />",
				"<a:RequestId i:nil='true' />",
				"<a:RequestName>WhoAmI</a:RequestName>",
				"</request>"].join("");
			return self._doRequest(request, "Execute").then((rslt) => {
				return Common.Helper.getNodeText(self.__selectNodes(rslt, "//b:value")[1]);
			});
		}

		/**
		 * getCurrentUserRoles :
		 * Sends $http request to retrieve the list of the current user's roles.
		 * Tested : Success
		 */
		getCurrentUserRoles(): ng.IPromise<string[]> {
			const self = this;
			let xml: string =
				[
					"<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>",
					"<entity name='role'>",
					"<attribute name='name' />",
					"<attribute name='businessunitid' />",
					"<attribute name='roleid' />",
					"<order attribute='name' descending='false' />" +
					"<link-entity name='systemuserroles' from='roleid' to='roleid' visible='false' intersect='true'>",
					"<link-entity name='systemuser' from='systemuserid' to='systemuserid' alias='aa'>",
					"<filter type='and'>",
					"<condition attribute='systemuserid' operator='eq-userid' />",
					"</filter>",
					"</link-entity>",
					"</link-entity>",
					"</entity>",
					"</fetch>"
				].join("");

			return self.fetch(xml, true).then((rslt) => {
				let roles: string[] = [];
				if (rslt !== null && typeof rslt != 'undefined') {
					for (let i = 0, ilength = rslt.length; i < ilength; i++) {
						roles.push(rslt[i].attributes["name"].value.toString());
					}
				}
				return roles;
			});
		}

		/**
		 * isCurrentUserInRole :
		 * Sends $http request to check if the current user has certain roles.
		 * Passes name of role as arguments. For example, IsCurrentUserInRole('System Administrator')
		 * Returns true or false.
		 * Tested : Success
		 */
		isCurrentUserInRole(args: string[]): ng.IPromise<boolean> {
			const self = this;
			let result: boolean = false;
			if (args == null || args == undefined)
				args = [''];
			return self.getCurrentUserRoles().then((rslt) => {
				if (rslt != null && rslt != undefined) {
					for (let i = 0; i < rslt.length; i++) {
						for (let j = 0; j < args.length; j++) {
							if (rslt[i] === args[j]) {
								result = true;
								break;
							}
						}
					}
				}
				return result;
			});
		}

		/**
		 * assign : 
		 * Sends $http request to assign an existing record to a user / a team.
		 * Tested : Success
		 */
		assign(targetEntityName: string, targetId: string, assigneeEntityName: string, assigneeId: string): ng.IPromise<string> {
			///<param name="targetEntityName" type="String">
			/// A JavaScript String corresponding to the schema name of the target entity
			/// that is used for assign operations.
			/// </param>
			///<param name="targetId" type="String">
			/// A JavaScript String corresponding to the GUID of the target entity
			/// that is used for assign operations.
			/// </param>
			///<param name="assigneeEntityName" type="String">
			/// A JavaScript String corresponding to the schema name of the assignee entity
			/// that is used for assign operations.
			/// </param>
			///<param name="assigneeId" type="String">
			/// A JavaScript String corresponding to the GUID of the assignee entity
			/// that is used for assign operations.
			/// </param>
			const self = this;
			let request: string = ["<request i:type='b:AssignRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
				"<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>Target</c:key>",
				"<c:value i:type='a:EntityReference'>",
				"<a:Id>", Common.Helper.encodeValue(targetId), "</a:Id>",
				"<a:LogicalName>", targetEntityName, "</a:LogicalName>",
				"<a:Name i:nil='true' />",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>Assignee</c:key>",
				"<c:value i:type='a:EntityReference'>",
				"<a:Id>", Common.Helper.encodeValue(assigneeId), "</a:Id>",
				"<a:LogicalName>", assigneeEntityName, "</a:LogicalName>",
				"<a:Name i:nil='true' />",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil='true' />",
				"<a:RequestName>Assign</a:RequestName>",
				"</request>"].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				let responseText: string = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
				let result: string = Common.Helper.crmXmlDecode(responseText);
				return result;
			});
		}

		/**
		 * grantAccess :
		 * Sends $http request to do a grantAccess request.
		 * The method grants a specified security principal (user or team) the provided AccessRights to the given record.
		 * Levels of Access Options are: AppendAccess, AppendToAccess, AssignAccess, CreateAccess, DeleteAccess, None, ReadAccess, ShareAccess, and WriteAccess
		 * NOTE: Read the CRM SDK documentation for more information on the GrantAccessRequest.
		 * Tested : Success
		 */
		grantAccess(accessOptions: Common.AccessOptions): ng.IPromise<string> {
			///<param name="accessOptions" type="Object">
			/// A JavaScript Object with properties corresponding to the grantAccess Criteria
			/// that are valid for grantAccess operations.
			/// accessOptions.targetEntityName is a string represents the name of the target entity
			/// accessOptions.targetEntityId is a string represents the GUID of the target entity
			/// accessOptions.principalEntityName is a string represents the name of the principal entity
			/// accessOptions.principalEntityId is a string represents the GUID of the principal entity
			/// accessOptions.accessRights is a array represents the access conditions of the results
			/// </param>

			if (accessOptions.targetEntityName === undefined || accessOptions.targetEntityName === ''
				|| accessOptions.targetEntityId === undefined || accessOptions.targetEntityId === ''
				|| accessOptions.principalEntityName === undefined || accessOptions.principalEntityName === ''
				|| accessOptions.principalEntityId === undefined || accessOptions.principalEntityId === ''
				|| accessOptions.accessRights === undefined || accessOptions.accessRights.length === 0) {
				throw new Error("AccessOptions are invalid for grantAccess.");
			}

			const self = this;
			let accessRightString: string[] = [];
			for (let i = 0, ilength = accessOptions.accessRights.length; i < ilength; i++) {
				accessRightString.push(Common.Helper.encodeValue(accessOptions.accessRights[i]) + " ");
			}

			let request: string = ["<request i:type='b:GrantAccessRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
				"<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>Target</c:key>",
				"<c:value i:type='a:EntityReference'>",
				"<a:Id>", Common.Helper.encodeValue(accessOptions.targetEntityId), "</a:Id>",
				"<a:LogicalName>", accessOptions.targetEntityName, "</a:LogicalName>",
				"<a:Name i:nil='true' />",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>PrincipalAccess</c:key>",
				"<c:value i:type='b:PrincipalAccess'>",
				"<b:AccessMask>", accessRightString.join(""), "</b:AccessMask>",
				"<b:Principal>",
				"<a:Id>", Common.Helper.encodeValue(accessOptions.principalEntityId), "</a:Id>",
				"<a:LogicalName>", accessOptions.principalEntityName, "</a:LogicalName>",
				"<a:Name i:nil='true' />",
				"</b:Principal>",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil='true' />",
				"<a:RequestName>GrantAccess</a:RequestName>",
				"</request>"].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				let responseText: string = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
				let result: string = Common.Helper.crmXmlDecode(responseText);
				return result;
			});
		}

		/**
		 * modifyAccess :
		 * Sends $http request to do a modifyAccess request.
		 * The method modifies the AccessRights of the given record for a specified security principal (user or team)
		 * Levels of Access Options are: AppendAccess, AppendToAccess, AssignAccess, CreateAccess, DeleteAccess, None, ReadAccess, ShareAccess, and WriteAccess
		 * NOTE: Read the CRM SDK documentation for more information on the GrantAccessRequest.
		 * Tested : Success
		 */
		modifyAccess(accessOptions: Common.AccessOptions): ng.IPromise<string> {
			///<param name="accessOptions" type="Object">
			/// A JavaScript Object with properties corresponding to the modifyAccess Criteria
			/// that are valid for modifyAccess operations.
			/// accessOptions.targetEntityName is a string represents the name of the target entity
			/// accessOptions.targetEntityId is a string represents the GUID of the target entity
			/// accessOptions.principalEntityName is a string represents the name of the principal entity
			/// accessOptions.principalEntityId is a string represents the GUID of the principal entity
			/// accessOptions.accessRights is a array represents the access conditions of the results
			/// </param>

			if (accessOptions.targetEntityName === undefined || accessOptions.targetEntityName === ''
				|| accessOptions.targetEntityId === undefined || accessOptions.targetEntityId === ''
				|| accessOptions.principalEntityName === undefined || accessOptions.principalEntityName === ''
				|| accessOptions.principalEntityId === undefined || accessOptions.principalEntityId === ''
				|| accessOptions.accessRights === undefined || accessOptions.accessRights.length === 0) {
				throw new Error("AccessOptions are invalid for modifyAccess.");
			}

			const self = this;
			let accessRightString: string[] = [];
			for (let i = 0, ilength = accessOptions.accessRights.length; i < ilength; i++) {
				accessRightString.push(Common.Helper.encodeValue(accessOptions.accessRights[i]) + " ");
			}

			let request: string = ["<request i:type='b:ModifyAccessRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
				"<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>Target</c:key>",
				"<c:value i:type='a:EntityReference'>",
				"<a:Id>", Common.Helper.encodeValue(accessOptions.targetEntityId), "</a:Id>",
				"<a:LogicalName>", accessOptions.targetEntityName, "</a:LogicalName>",
				"<a:Name i:nil='true' />",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>PrincipalAccess</c:key>",
				"<c:value i:type='b:PrincipalAccess'>",
				"<b:AccessMask>", accessRightString.join(""), "</b:AccessMask>",
				"<b:Principal>",
				"<a:Id>", Common.Helper.encodeValue(accessOptions.principalEntityId), "</a:Id>",
				"<a:LogicalName>", accessOptions.principalEntityName, "</a:LogicalName>",
				"<a:Name i:nil='true' />",
				"</b:Principal>",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil='true' />",
				"<a:RequestName>ModifyAccess</a:RequestName>",
				"</request>"].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				let responseText: string = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
				let result: string = Common.Helper.crmXmlDecode(responseText);
				return result;
			});
		}

		/**
		 * revokeAccess :
		 * Sends $http request to do a revokeAccess request.
		 * The method modifies the AccessRights of the given record for a specified security principal (user or team)
		 * NOTE: Read the CRM SDK documentation for more information on the GrantAccessRequest.
		 * Tested : Success
		 */
		revokeAccess(accessOptions: Common.AccessOptions): ng.IPromise<string> {
			///<param name="accessOptions" type="Object">
			/// A JavaScript Object with properties corresponding to the revokeAccess Criteria
			/// that are valid for revokeAccess operations.
			/// accessOptions.targetEntityName is a string represents the name of the target entity
			/// accessOptions.targetEntityId is a string represents the GUID of the target entity
			/// accessOptions.revokeeEntityName is a string represents the name of the revokee entity
			/// accessOptions.revokeeEntityId is a string represents the GUID of the revokee entity
			/// </param>
			///<param name="callback" type="Function">
			/// A Function used for asynchronous request. If not defined, it sends a synchronous request.
			/// </param>

			if (accessOptions.targetEntityName === undefined || accessOptions.targetEntityName === ''
				|| accessOptions.targetEntityId === undefined || accessOptions.targetEntityId === ''
				|| accessOptions.principalEntityName === undefined || accessOptions.principalEntityName === ''
				|| accessOptions.principalEntityId === undefined || accessOptions.principalEntityId === '') {
				throw new Error("AccessOptions are invalid for revokeAccess.");
			}

			const self = this;

			let request: string = ["<request i:type='b:RevokeAccessRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
				"<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>Target</c:key>",
				"<c:value i:type='a:EntityReference'>",
				"<a:Id>", Common.Helper.encodeValue(accessOptions.targetEntityId), "</a:Id>",
				"<a:LogicalName>", accessOptions.targetEntityName, "</a:LogicalName>",
				"<a:Name i:nil='true' />",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>Revokee</c:key>",
				"<c:value i:type='a:EntityReference'>",
				"<a:Id>", Common.Helper.encodeValue(accessOptions.principalEntityId), "</a:Id>",
				"<a:LogicalName>", accessOptions.principalEntityName, "</a:LogicalName>",
				"<a:Name i:nil='true' />",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil='true' />",
				"<a:RequestName>RevokeAccess</a:RequestName>",
				"</request>"].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				let responseText: string = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
				let result: string = Common.Helper.crmXmlDecode(responseText);
				return result;
			});
		}

		/**
		 * retrievePrincipalAccess :
		 * Sends $http request to do a retrievePrincipalAccess request.
		 * The method retrieves the access rights of a specified security principal (user or team)
		 * to the specified record. 
		 * Tested : Success
		 */
		retrievePrincipalAccess(accessOptions: Common.AccessOptions): ng.IPromise<string[]> {
			///<param name="accessOptions" type="Object">
			/// A JavaScript Object with properties corresponding to the retrievePrincipalAccess Criteria
			/// that are valid for retrievePrincipalAccess operations.
			/// accessOptions.targetEntityName is a string represents the name of the target entity
			/// accessOptions.targetEntityId is a string represents the GUID of the target entity
			/// accessOptions.principalEntityName is a string represents the name of the principal entity
			/// accessOptions.principalEntityId is a string represents the GUID of the principal entity
			/// </param>

			if (accessOptions.targetEntityName === undefined || accessOptions.targetEntityName === ''
				|| accessOptions.targetEntityId === undefined || accessOptions.targetEntityId === ''
				|| accessOptions.principalEntityName === undefined || accessOptions.principalEntityName === ''
				|| accessOptions.principalEntityId === undefined || accessOptions.principalEntityId === '') {
				return Q.reject("AccessOptions are invalid for retrievePrincipalAccess.");
			}

			const self = this;

			let request: string = ["<request i:type='b:RetrievePrincipalAccessRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
				"<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>Target</c:key>",
				"<c:value i:type='a:EntityReference'>",
				"<a:Id>", Common.Helper.encodeValue(accessOptions.targetEntityId), "</a:Id>",
				"<a:LogicalName>", accessOptions.targetEntityName, "</a:LogicalName>",
				"<a:Name i:nil='true' />",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>Principal</c:key>",
				"<c:value i:type='a:EntityReference'>",
				"<a:Id>", Common.Helper.encodeValue(accessOptions.principalEntityId), "</a:Id>",
				"<a:LogicalName>", accessOptions.principalEntityName, "</a:LogicalName>",
				"<a:Name i:nil='true' />",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil='true' />",
				"<a:RequestName>RetrievePrincipalAccess</a:RequestName>",
				"</request>"].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				let result: string = self.__selectSingleNodeText(rslt, "//b:value");
				return result.split(' ');
			});
		}

		/*
		 * addMemberTeamRequest : 
		 * Request to add a member to an existing team
		 * Tested : Success
		 */
		addMemberTeamRequest(teamId: string, memberId: string): ng.IPromise<any> {
			const self = this;

			let request: string = [
				"<request i:type=\"b:AddMembersTeamRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">",
				"<a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>TeamId</c:key>",
				"<c:value i:type=\"d:guid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/\">",
				teamId,
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>MemberIds</c:key>",
				"<c:value i:type=\"d:ArrayOfguid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">",
				"<d:guid>",
				memberId,
				"</d:guid>",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil=\"true\" />",
				"<a:RequestName>AddMembersTeam</a:RequestName>",
				"</request>"
			].join("");

			return self._doRequest(request, "Execute")
				.then((rslt) => {
					return rslt;
				});
		}

		/*
		 * removeMemberTeamRequest : 
		 * Request to add a member to an existing team
		 * Tested : Success		 
		 */
		removeMemberTeamRequest(teamId: string, memberId: string): ng.IPromise<any> {
			const self = this;

			let request: string = [
				"<request i:type=\"b:RemoveMembersTeamRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">",
				"<a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>TeamId</c:key>",
				"<c:value i:type=\"d:guid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/\">",
				teamId,
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<c:key>MemberIds</c:key>",
				"<c:value i:type=\"d:ArrayOfguid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">",
				"<d:guid>",
				memberId,
				"</d:guid>",
				"</c:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil=\"true\" />",
				"<a:RequestName>RemoveMembersTeam</a:RequestName>",
				"</request>"
			].join("");

			return self._doRequest(request, "Execute")
				.then((rslt) => {
					return rslt;
				});
		}

		/**
		* retrieveAllEntitiesMetadata : 
		* Request to retrieve all entities metadata in the system
		* Tested : Success
		*/
		retrieveAllEntitiesMetadata(entityFilters: string[], retrieveIfPublished: boolean): ng.IPromise<Common.IMetadata[]> {
			///<summary>
			/// Sends an synchronous/asynchronous RetrieveAllEntitieMetadata Request to retrieve all entities metadata in the system
			///</summary>
			///<returns>Entity Metadata Collection</returns>
			///<param name="entityFilters" type="Array">
			/// The filter array available to filter which data is retrieved. Case Sensitive filters [Entity,Attributes,Privileges,Relationships]
			/// Include only those elements of the entity you want to retrieve in the array. Retrieving all parts of all entities may take significant time.
			///</param>
			///<param name="retrieveIfPublished" type="Boolean">
			/// Sets whether to retrieve the metadata that has not been published.
			///</param>
			///<param name="callBack" type="Function">
			/// The function that will be passed through and be called by a successful response.
			/// This function also used as an indicator if the function is synchronous/asynchronous
			///</param>

			const self = this;

			let result: Common.IMetadata[] = [];
			let entityFiltersString: string = "";
			for (let iii = 0, templength = entityFilters.length; iii < templength; iii++) {
				entityFiltersString += Common.Helper.encodeValue(entityFilters[iii]) + " ";
			}

			let request: string = [
				"<request i:type=\"a:RetrieveAllEntitiesRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">",
				"<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>EntityFilters</b:key>",
				"<b:value i:type=\"c:EntityFilters\" xmlns:c=\"http://schemas.microsoft.com/xrm/2011/Metadata\">" + Common.Helper.encodeValue(entityFiltersString) + "</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>RetrieveAsIfPublished</b:key>",
				"<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + Common.Helper.encodeValue(retrieveIfPublished.toString()) + "</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil=\"true\" />",
				"<a:RequestName>RetrieveAllEntities</a:RequestName>",
				"</request>"].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				let response = self.__selectNodes(rslt, "//c:EntityMetadata");
				for (let i = 0, ilength = response.length; i < ilength; i++) {
					let a: Common.IMetadata = self.__objectifyNode(response[i]);
					a._type = "EntityMetadata";
					result.push(a);
				}

				return result;
			});
		}

		/**
		 * retrieveEntityMetadata :
		 * Sends an $http RetreiveEntityMetadata Request to retrieve a particular entity metadata in the system.
		 * Tested : Success
		 */
		retrieveEntityMetadata(entityFilters: string[], logicalName: string, retrieveIfPublished: boolean): ng.IPromise<Common.IMetadata[]> {
			///<returns>Entity Metadata</returns>
			///<param name="entityFilters" type="String">
			/// The filter string available to filter which data is retrieved. Case Sensitive filters [Entity,Attributes,Privileges,Relationships]
			/// Include only those elements of the entity you want to retrieve in the array. Retrieving all parts of all entities may take significant time.
			///</param>
			///<param name="logicalName" type="String">
			/// The string of the entity logical name
			///</param>
			///<param name="retrieveIfPublished" type="Boolean">
			/// Sets whether to retrieve the metadata that has not been published.
			///</param>
			const self = this;
			let entityFiltersString: string[] = [];
			for (let iii = 0, templength = entityFilters.length; iii < templength; iii++) {
				entityFiltersString.push(Common.Helper.encodeValue(entityFilters[iii]) + " ");
			}

			let request: string = [
				"<request i:type=\"a:RetrieveEntityRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">",
				"<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>EntityFilters</b:key>",
				"<b:value i:type=\"c:EntityFilters\" xmlns:c=\"http://schemas.microsoft.com/xrm/2011/Metadata\">", Common.Helper.encodeValue(entityFiltersString.join("")), "</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>MetadataId</b:key>",
				"<b:value i:type=\"c:guid\"  xmlns:c=\"http://schemas.microsoft.com/2003/10/Serialization/\">", Common.Helper.encodeValue("00000000-0000-0000-0000-000000000000"), "</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>RetrieveAsIfPublished</b:key>",
				"<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">", Common.Helper.encodeValue(retrieveIfPublished.toString()), "</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>LogicalName</b:key>",
				"<b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">", Common.Helper.encodeValue(logicalName), "</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil=\"true\" />",
				"<a:RequestName>RetrieveEntity</a:RequestName>",
				"</request>"].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				let response: any[] = self.__selectNodes(rslt, "//b:value");

				let results: Common.IMetadata[] = [];
				for (let i = 0, ilength = response.length; i < ilength; i++) {
					let a = self.__objectifyNode(response[i]);
					a._type = "EntityMetadata";
					results.push(a);
				}

				return results;
			});
		}

		/**
		 * retrieveAttributeMetadata :
		 * Sends an $http RetrieveAttributeMetadata Request to retrieve a particular entity's attribute metadata in the system
		 * Tested : Untested
		 */
		retrieveAttributeMetadata(entityLogicalName: string, attributeLogicalName: string, retrieveIfPublished: boolean): ng.IPromise<any[]> {
			///<returns>Entity Metadata</returns>
			///<param name="entityLogicalName" type="String">
			/// The string of the entity logical name
			///</param>
			///<param name="attributeLogicalName" type="String">
			/// The string of the entity's attribute logical name
			///</param>
			///<param name="retrieveIfPublished" type="Boolean">
			/// Sets whether to retrieve the metadata that has not been published.
			///</param>
			const self = this;
			let request: string = [
				"<request i:type=\"a:RetrieveAttributeRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">",
				"<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>EntityLogicalName</b:key>",
				"<b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">", Common.Helper.encodeValue(entityLogicalName), "</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>MetadataId</b:key>",
				"<b:value i:type=\"ser:guid\"  xmlns:ser=\"http://schemas.microsoft.com/2003/10/Serialization/\">", Common.Helper.encodeValue("00000000-0000-0000-0000-000000000000"), "</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>RetrieveAsIfPublished</b:key>",
				"<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">", Common.Helper.encodeValue(retrieveIfPublished.toString()), "</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"<a:KeyValuePairOfstringanyType>",
				"<b:key>LogicalName</b:key>",
				"<b:value i:type=\"c:string\"   xmlns:c=\"http://www.w3.org/2001/XMLSchema\">", Common.Helper.encodeValue(attributeLogicalName), "</b:value>",
				"</a:KeyValuePairOfstringanyType>",
				"</a:Parameters>",
				"<a:RequestId i:nil=\"true\" />",
				"<a:RequestName>RetrieveAttribute</a:RequestName>",
				"</request>"].join("");

			return self._doRequest(request, "Execute").then((rslt) => {
				let response: any[] = self.__selectNodes(rslt, "//b:value");
				let results: any[] = [];
				for (let i = 0, ilength = response.length; i < ilength; i++) {
					let a = self.__objectifyNode(response[i]);
					results.push(a);
				}

				return results;
			});
		}

		public static SoapClientFactory($http: ng.IHttpService): ngXrm.XrmServiceToolkit.Soap.SoapClient {
			return new SoapClient($http);
		}
	}
}

/**
* ngXrm.XrmServiceToolkit.Rest based on XrmServiceToolkit.Rest
* NOTE: 
*		The rest endpoint uses the entity and attribute schema names and they are case sensitive.
*/
module ngXrm.XrmServiceToolkit.Rest {
	import Common = ngXrm.XrmServiceToolkit.Common;
	import CommonRest = ngXrm.XrmServiceToolkit.Common.Rest;

	export interface IRestClient {
		createRecord: (object: any, type: string) => ng.IPromise<any>;
		retrieveRecord: (id: string, type: string, select: string[], expand: string[]) => ng.IPromise<any>;
		updateRecord: (id: string, type: string, object: any) => ng.IPromise<any>;
		deleteRecord: (id: string, type: string) => ng.IPromise<any>;
		retrieveMultipleRecords: (type: string, options?: string) => ng.IPromise<any[]>;
		associateRecord: (entityid1: string, odataSetName1: string, entityid2: string, odataSetName2: string, relationship: string) => ng.IPromise<any>;
		disassociateRecord: (entityid1: string, odataSetName: string, entityid2: string, relationship: string) => ng.IPromise<any>;
	}

	export class RestClient implements IRestClient {
		static id: string = "ngXrm.XrmServiceToolkit.Rest.RestClient";
		static $inject: string[] = ["$http"];

		constructor(private $http: ng.IHttpService) {

		}

		__getODataPath(xrmContext: Context): string {
			const self = this;
			return [xrmContext.getClientUrl(), "/XRMServices/2011/OrganizationData.svc/"].join("");
		}

		__parameterCheckBoolean(parameter: any, message: string): void {
			///<summary>
			/// Private function used to check whether required parameters are null or undefined
			///</summary>
			///<param name="parameter" type="String">
			/// The string parameter to check;
			///</param>
			///<param name="message" type="String">
			/// The error message text to include when the error is thrown.
			///</param>
			if (typeof parameter != "boolean") {
				throw new Error(message);
			}
		}

		__parameterCheckRequired(parameter: any, message: string): void {
			///<summary>
			/// Private function used to check whether required parameters are null or undefined
			///</summary>
			///<param name="parameter" type="Object">
			/// The parameter to check;
			///</param>
			///<param name="message" type="String">
			/// The error message text to include when the error is thrown.
			///</param>
			if ((typeof parameter === "undefined") || parameter === null) {
				throw new Error(message);
			}
		}

		__parameterCheckString(parameter: any, message: string): void {
			///<summary>
			/// Private function used to check whether required parameters are null or undefined
			///</summary>
			///<param name="parameter" type="String">
			/// The string parameter to check;
			///</param>
			///<param name="message" type="String">
			/// The error message text to include when the error is thrown.
			///</param>
			if (typeof parameter != "string") {
				throw new Error(message);
			}
		}

		private _restGet(getConfig: CommonRest.IRestGet): ng.IPromise<any> {
			const self = this;
			let httpConfig: any = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				}
			};
			//Overwrite httpConfig if provided
			if (getConfig.httpConfig != null)
				httpConfig = getConfig.httpConfig;

			//	THEN : 
			//		rslt.status = 200 > success
			//		rslt.status != 200 > error
			//	THEN - SUCCESS:
			//		return rslt.data.d or data.d
			return self.$http.get(getConfig.requestUrl, httpConfig)
				.then((rslt: any) => {
					let result: any = null;
					if (rslt.status === 200)
						result = rslt.data.d;
					return result;
				})
				.catch((error) => {
					return Q.reject(error);
				})
				;
		}

		private _restPost(postConfig: CommonRest.IRestPost): ng.IPromise<any> {
			const self = this;
			let httpConfig: any = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				}
			};
			//Overwrite httpConfig if provided
			if (postConfig.httpConfig != null)
				httpConfig = postConfig.httpConfig;

			return self.$http.post(postConfig.requestUrl, postConfig.object != null ? JSON.stringify(postConfig.object) : null, httpConfig)
				.then((rslt: any) => {
					let result: any = null;
					//200 = OK
					//201 = Created
					//204 = No Content (MERGE/DELETE)
					if (rslt.status === 200 || rslt.status === 201)
						result = rslt.data.d;
					else if (rslt.status === 204)
						result = "Ok";
					return result;
				})
				.catch((error) => {
					return Q.reject(error);
				})
				;
		}

		/**
		 * createRecord :
		 * Sends $http request to create a new record.
		 * Tested : Success
		 */
		createRecord(type: string, object: any): ng.IPromise<any> {
			const self = this;
			
			try {
				///<param name="object" type="Object">
				/// A JavaScript object with properties corresponding to the Schema name of
				/// entity attributes that are valid for create operations.
				///</param>
				self.__parameterCheckRequired(object, "ngXrm.XrmServiceToolkit.Rest.RestClient.createRecord requires the object parameter.");
				///<param name="type" type="string">
				/// A String representing the name of the entity
				///</param>
				self.__parameterCheckString(type, "ngXrm.XrmServiceToolkit.Rest.RestClient.createRecord requires the type parameter is a string.");
			}
			catch (error) {
				return Q.reject(error);
			}

			let requestUrl: string = [self.__getODataPath(Common.Helper.xrmContext()), type, "Set"].join("");

			return self._restPost(new CommonRest.RestPost({ requestUrl: requestUrl, object: object })).then((rslt: any) => {
				let result: any = rslt;
				return result;
			});
		}

		/**
		 * retrieveRecord :
		 * Sends $http request to retrieve a record.
		 * Tested : Success
		 */
		retrieveRecord(id: string, type: string, select: string[], expand: string[]): ng.IPromise<any> {
			const self = this;			

			try {
				///<param name="id" type="String">
				/// A String representing the GUID value for the record to retrieve.
				///</param>
				self.__parameterCheckString(id, "ngXrm.XrmServiceToolkit.Rest.RestClient.retrieveRecord requires the id parameter is a string.");
				///<param name="type" type="string">
				/// A String representing the name of the entity
				///</param>
				self.__parameterCheckString(type, "ngXrm.XrmServiceToolkit.Rest.RestClient.retrieveRecord requires the type parameter is a string.");
				///<param name="select" type="String">
				/// A String representing the $select OData System Query Option to control which
				/// attributes will be returned. This is a comma separated list of Attribute names that are valid for retrieve.
				/// If null all properties for the record will be returned
				///</param>
				//if (select != null)
				//	self.__parameterCheckString(select, "ngXrm.XrmServiceToolkit.Rest.RestClient.retrieveRecord requires the select parameter is a string.");
				///<param name="expand" type="String">
				/// A String representing the $expand OData System Query Option value to control which
				/// related records are also returned. This is a comma separated list of of up to 6 entity relationship names
				/// If null no expanded related records will be returned.
				///</param>
				//if (expand != null)
				//	self.__parameterCheckString(expand, "ngXrm.XrmServiceToolkit.Rest.RestClient.retrieveRecord requires the expand parameter is a string.");
			}
			catch (error) {
				return Q.reject(error);
			}

			let systemQueryOptions: string = "";
			let expandMax: string[] = [];

			//Max amount of expand entities is 6.
			if (expand != null) {
				for (let i: number = 0; i < expand.length; i++) {
					expandMax.push(expand[i]);
					if (i == 5)
						break;
				}
			}

			if (select != null || expand != null) {
				systemQueryOptions = "?";
				if (select != null) {
					let selectString: string = ["$select=", select.join(",")].join("");
					if (expandMax.length > 0) {
						selectString = [selectString, expandMax.join(",")].join(",");
					}
					systemQueryOptions = [systemQueryOptions, selectString].join("");
				}
				if (expandMax.length > 0) {
					systemQueryOptions = [systemQueryOptions, "&$expand=", expandMax.join(",")].join("");
				}
			}

			let requestUrl: string = [self.__getODataPath(Common.Helper.xrmContext()), type, "Set(guid'", id, "')", systemQueryOptions].join("");

			return self._restGet(new CommonRest.RestGet({ requestUrl: requestUrl })).then((rslt) => {
				let result: any = rslt;
				return result;
			});
		}

		/**
		 * updateRecord :
		 * Sends $http request to update a record.
		 * Tested : Success
		 */
		updateRecord(id: string, type: string, object: any): ng.IPromise<any> {
			const self = this;			

			try {
				///<param name="id" type="String">
				/// A String representing the GUID value for the record to update.
				///</param>
				self.__parameterCheckString(id, "ngXrm.XrmServiceToolkit.Rest.RestClient.updateRecord requires the id parameter.");
				///<param name="object" type="Object">
				/// A JavaScript object with properties corresponding to the Schema name of
				/// entity attributes that are valid for create operations.
				///</param>
				self.__parameterCheckRequired(object, "ngXrm.XrmServiceToolkit.Rest.RestClient.updateRecord requires the object parameter.");
				///<param name="type" type="string">
				/// A String representing the name of the entity
				///</param>
				self.__parameterCheckString(type, "ngXrm.XrmServiceToolkit.Rest.RestClient.updateRecord requires the type parameter.");
			}
			catch (error) {
				return Q.reject(error);
			}

			let requestUrl: string = [self.__getODataPath(Common.Helper.xrmContext()), type, "Set(guid'", id, "')"].join("");
			let httpConfig: any = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8',
					'X-HTTP-Method': 'MERGE'
				}
			};

			return self._restPost(new CommonRest.RestPost({ requestUrl: requestUrl, object: object, httpConfig: httpConfig })).then((rslt: any) => {
				let result: any = rslt;
				return result;
			});
		}

		/**
		 * deleteRecord :
		 * Sends $http request to delete a record.
		 * Tested : Success
		 */
		deleteRecord(id: string, type: string): ng.IPromise<any> {
			const self = this;			

			try {
				///<param name="id" type="String">
				/// A String representing the GUID value for the record to delete.
				///</param>
				self.__parameterCheckString(id, "ngXrm.XrmServiceToolkit.Rest.RestClient.deleteRecord requires the id parameter.");
				///<param name="type" type="string">
				/// A String representing the name of the entity
				///</param>
				self.__parameterCheckString(type, "ngXrm.XrmServiceToolkit.Rest.RestClient.deleteRecord requires the type parameter.");
			}
			catch (error) {
				return Q.reject(error);
			}

			let requestUrl: string = [self.__getODataPath(Common.Helper.xrmContext()), type, "Set(guid'", id, "')"].join("");

			let httpConfig: any = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8',
					'X-HTTP-Method': 'DELETE'
				}
			};

			return self._restPost(new CommonRest.RestPost({ requestUrl: requestUrl, httpConfig: httpConfig })).then((rslt) => {
				let result: any = rslt;
				return result;
			});
		}

		private _doRetrieveMultipleRecords(type: string, options: string = null): ng.IPromise<any> {
			const self = this;

			let optionsString: string = '';
			if (options != null) {
				if (options.charAt(0) !== "?") {
					optionsString = ["?", options].join("");
				}
				else {
					optionsString = options;
				}
			}

			let requestUrl: string = [self.__getODataPath(Common.Helper.xrmContext()), type, "Set", optionsString].join("");

			return self._restGet(new CommonRest.RestGet({ requestUrl: requestUrl }))
				.then((rslt) => {
					return rslt;
				})
				.catch((error: any) => {
					return Q.reject(error);
				});
		}

		/*
		 * retrieveMultipleRecords : 
		 * Sends $http request to retrieve records.
		 * Tested : Success
		 */
		retrieveMultipleRecords(type: string, options: string = null): ng.IPromise<any[]> {
			const self = this;			

			try {
				///<param name="type" type="String">
				/// The Schema Name of the Entity type record to retrieve.
				/// For an Account record, use "Account"
				///</param>
				self.__parameterCheckString(type, "ngXrm.XrmServiceToolkit.Rest.RestClient.retrieveMultipleRecords requires the type parameter is a string.");
				///<param name="options" type="String">
				/// A String representing the OData System Query Options to control the data returned
				/// https://msdn.microsoft.com/en-us/library/gg309461.aspx?f=255&MSPPError=-2147217396
				///</param>
				if (options != null)
					self.__parameterCheckString(options, "ngXrm.XrmServiceToolkit.Rest.RestClient.retrieveMultipleRecords requires the options parameter is a string.");
			}
			catch (error) {
				return Q.reject(error);
			}

			let defer: Q.Deferred<any[]> = Q.defer<any[]>();

			let resultArray: any[] = [];
			let recursiveFn = function (rslt: any) {
				//TODO: test rslt when no records found
				if (rslt != null) {
					resultArray.push.apply(resultArray, rslt.results);
					if (rslt.__next != null) {
						let queryOptions: string = rslt.__next.substring([self.__getODataPath(Common.Helper.xrmContext()), type, "Set"].join("").length);
						self._doRetrieveMultipleRecords(type, queryOptions)
							.then(recursiveFn)
							.catch((error: any) => {
								return defer.reject(error);
							});
					}
					else
						defer.resolve(resultArray);
				}
			}

			self._doRetrieveMultipleRecords(type, options)
				.then(recursiveFn)
				.catch((error: any) => {
					return defer.reject(error);
				});

			return defer.promise;
		}

		/*
		 * associateRecord :
		 * Sends $http request to associate a record.
		 * Tested : Success
		 */
		associateRecord(entityid1: string, odataSetName1: string, entityid2: string, odataSetName2: string, relationship: string): ng.IPromise<any> {
			const self = this;
			
			try {
				///<param name="entityid1" type="string">
				/// A String representing the GUID value for the record to associate.
				///</param>
				self.__parameterCheckRequired(entityid1, "ngXrm.XrmServiceToolkit.Rest.RestClient.associateRecord requires the entityid1 parameter.");
				///<param name="odataSetName1" type="string">
				/// A String representing the odataset name for entityid1
				///</param>
				self.__parameterCheckRequired(odataSetName1, "ngXrm.XrmServiceToolkit.Rest.RestClient.associateRecord requires the odataSetName1 parameter.");
				///<param name="entityid2" type="string">
				/// A String representing the GUID value for the record to be associated.
				///</param>
				self.__parameterCheckRequired(entityid2, "ngXrm.XrmServiceToolkit.Rest.RestClient.associateRecord requires the entityid2 parameter.");
				///<param name="odataSetName2" type="string">
				/// A String representing the odataset name for entityid2
				///</param>
				self.__parameterCheckRequired(odataSetName2, "ngXrm.XrmServiceToolkit.Rest.RestClient.associateRecord requires the odataSetName2 parameter.");
				///<param name="relationship" type="string">
				/// A String representing the name of the relationship for association
				///</param>
				self.__parameterCheckRequired(relationship, "ngXrm.XrmServiceToolkit.Rest.RestClient.associateRecord requires the relationship parameter.");
			}
			catch (error) {
				return Q.reject(error);
			}

			let entityReference: any = {};
			entityReference.uri = [self.__getODataPath(Common.Helper.xrmContext()), odataSetName2, "Set(guid'", entityid2, "')"].join("");

			let requestUrl: string = [self.__getODataPath(Common.Helper.xrmContext()), odataSetName1, "Set(guid'", entityid1, "')/$links/", relationship].join("");

			return self._restPost(new CommonRest.RestPost({ requestUrl: requestUrl, object: entityReference })).then((rslt) => {
				let result: any = rslt != null && rslt.data != null ? rslt.data.d : null;
				return result;
			});
		}

		/*
		 * disassociateRecord : 
		 * Sends $http request to disassociate a record.
		 * Tested : Success
		 */
		disassociateRecord(entityid1: string, odataSetName: string, entityid2: string, relationship: string): ng.IPromise<any> {
			const self = this;			

			try {
				///<param name="entityid1" type="string">
				/// A String representing the GUID value for the record to disassociate.
				///</param>
				self.__parameterCheckRequired(entityid1, "ngXrm.XrmServiceToolkit.Rest.RestClient.disassociateRecord requires the entityid1 parameter.");
				///<param name="odataSetName" type="string">
				/// A String representing the odataset name for entityid1
				///</param>
				self.__parameterCheckRequired(odataSetName, "ngXrm.XrmServiceToolkit.Rest.RestClient.disassociateRecord requires the odataSetName parameter.");
				///<param name="entityid2" type="string">
				/// A String representing the GUID value for the record to be disassociated.
				///</param>
				self.__parameterCheckRequired(entityid2, "ngXrm.XrmServiceToolkit.Rest.RestClient.disassociateRecord requires the entityid2 parameter.");
				///<param name="relationship" type="string">
				/// A String representing the name of the relationship for disassociation
				///</param>
				self.__parameterCheckRequired(relationship, "ngXrm.XrmServiceToolkit.Rest.RestClient.disassociateRecord requires the relationship parameter.");
			}
			catch (error) {
				return Q.reject(error);
			}

			let requestUrl: string = [self.__getODataPath(Common.Helper.xrmContext()), odataSetName, "Set(guid'", entityid1, "')/$links/", relationship, "(guid'", entityid2, "')"].join("");
			let httpConfig: any = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8',
					'X-HTTP-Method': 'DELETE'
				}
			};

			return self._restPost(new CommonRest.RestPost({ requestUrl: requestUrl, httpConfig: httpConfig })).then((rslt) => {
				let result: any = rslt != null && rslt.data != null ? rslt.data.d : null;
				return result;
			});
		}

		public static RestClientFactory($http: ng.IHttpService): ngXrm.XrmServiceToolkit.Rest.RestClient {
			return new RestClient($http);
		}
	}
}

angular.module('ngXrm', [])
	.factory("ngXrmServiceToolkitSoap", ['$http', ngXrm.XrmServiceToolkit.Soap.SoapClient.SoapClientFactory])
	.factory("ngXrmServiceToolkitRest", ['$http', ngXrm.XrmServiceToolkit.Rest.RestClient.RestClientFactory]);