/**
* ngXrm.XrmServiceToolkit.Common helper module
*/
var ngXrm;
(function (ngXrm) {
    var XrmServiceToolkit;
    (function (XrmServiceToolkit) {
        var Common;
        (function (Common) {
            /*
             * CLASSES
             */
            var AccessOptions = (function () {
                function AccessOptions(accessOptions) {
                    if (accessOptions != null) {
                        this.targetEntityName = accessOptions.targetEntityName;
                        this.targetEntityId = accessOptions.targetEntityId;
                        this.principalEntityName = accessOptions.principalEntityName;
                        this.principalEntityId = accessOptions.principalEntityId;
                        this.accessRights = accessOptions.accessRights;
                    }
                }
                return AccessOptions;
            })();
            Common.AccessOptions = AccessOptions;
            var BusinessEntity = (function () {
                function BusinessEntity(businessEntity) {
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
                BusinessEntity.prototype.serialize = function () {
                    var xml = ["<b:value i:type='a:Entity'>"];
                    xml.push('<a:Attributes xmlns:b="http://schemas.datacontract.org/2004/07/System.Collections.Generic">');
                    var attributes = this.attributes;
                    for (var attributeName in attributes) {
                        if (attributes.hasOwnProperty(attributeName)) {
                            var attribute = attributes[attributeName];
                            xml.push("<a:KeyValuePairOfstringanyType>");
                            xml.push("<b:key>", attributeName, "</b:key>");
                            if (attribute === null || attribute.value === null) {
                                xml.push("<b:value i:nil='true' />");
                            }
                            else {
                                var sType = (!attribute.type)
                                    ? typeof attribute
                                    : Helper.crmXmlEncode(attribute.type);
                                var value = void 0;
                                var encodedValue = void 0;
                                var id = void 0;
                                var encodedId = void 0;
                                var logicalName = void 0;
                                var encodedLogicalName = void 0;
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
                                        var collections = Helper.isArray(value) ? value : [value];
                                        for (var i = 0, collectionLengh = collections.length; i < collectionLengh; i++) {
                                            var item = collections[i];
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
                                        var oType = (parseInt(encodedValue) === encodedValue) ? "c:int" : "c:decimal";
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
                };
                /**
                * Deserialize an XML node into a CRM Business Entity object. The XML node comes from CRM Web Service's response.
                * @param {object} resultNode The XML node returned from CRM Web Service's Fetch, Retrieve, RetrieveMultiple messages.
                */
                BusinessEntity.prototype.deserialize = function (resultNode) {
                    var obj = new Object();
                    var resultNodes = resultNode.childNodes;
                    for (var j = 0, lenj = resultNodes.length; j < lenj; j++) {
                        var sKey = void 0;
                        var parentNode = resultNodes[j];
                        switch (parentNode.nodeName) {
                            case "a:Attributes":
                                var attr = parentNode;
                                for (var k = 0, lenk = attr.childNodes.length; k < lenk; k++) {
                                    var tempParentNode = attr.childNodes[k];
                                    // Establish the Key for the Attribute
                                    var tempParentNodeChildNodes = tempParentNode.childNodes;
                                    sKey = Helper.getNodeText(tempParentNodeChildNodes[0]);
                                    var tempNode = tempParentNodeChildNodes[1];
                                    // Determine the Type of Attribute value we should expect
                                    var sType = tempNode.attributes.getNamedItem("i:type").value;
                                    // check for AliasedValue
                                    if (sType.replace('c:', '').replace('a:', '') === "AliasedValue") {
                                        // reset the type to the actual attribute type
                                        var subNode = tempNode.childNodes[2];
                                        sType = subNode.attributes.getNamedItem("i:type").value;
                                        //sKey = getNodeText(tempNode.childNodes[1]) + "." + getNodeText(tempNode.childNodes[0]);
                                        // reset the node to the AliasedValue value node
                                        tempNode = subNode;
                                    }
                                    var entRef = void 0;
                                    var entCv = void 0;
                                    switch (sType) {
                                        case "a:OptionSetValue":
                                            var entOsv = new XrmOptionSetValue();
                                            entOsv.type = sType.replace('a:', '');
                                            entOsv.value = parseInt(Helper.getNodeText(tempNode));
                                            obj[sKey] = entOsv;
                                            break;
                                        case "a:EntityReference":
                                            entRef = new XrmEntityReference();
                                            entRef.type = sType.replace('a:', '');
                                            var oChildNodes = tempNode.childNodes;
                                            entRef.id = Helper.getNodeText(oChildNodes[0]);
                                            entRef.logicalName = Helper.getNodeText(oChildNodes[1]);
                                            entRef.name = Helper.getNodeText(oChildNodes[2]);
                                            obj[sKey] = entRef;
                                            break;
                                        case "a:EntityCollection":
                                            entRef = new XrmEntityCollection();
                                            entRef.type = sType.replace('a:', '');
                                            //get all party items....
                                            var items = [];
                                            var partyNodes = tempNode.childNodes;
                                            for (var y = 0, leny = partyNodes[0].childNodes.length; y < leny; y++) {
                                                var itemNodes = tempParentNode.childNodes[1].childNodes[0].childNodes[y].childNodes[0].childNodes;
                                                for (var z = 0, lenz = itemNodes.length; z < lenz; z++) {
                                                    var itemNodeChildNodes = itemNodes[z].childNodes;
                                                    var nodeText = Helper.getNodeText(itemNodeChildNodes[0]);
                                                    if (nodeText === "partyid") {
                                                        var itemRef = new XrmEntityReference();
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
                                var foVal = parentNode;
                                for (var o = 0, leno = foVal.childNodes.length; o < leno; o++) {
                                    // Establish the Key, we are going to fill in the formatted value of the already found attribute
                                    var foNode = foVal.childNodes[o];
                                    sKey = Helper.getNodeText(foNode.childNodes[0]);
                                    this.attributes[sKey].formattedValue = Helper.getNodeText(foNode.childNodes[1]);
                                    if (isNaN(this.attributes[sKey].value) && this.attributes[sKey].type === "dateTime") {
                                        this.attributes[sKey].value = new Date(this.attributes[sKey].formattedValue);
                                    }
                                }
                                break;
                        }
                    }
                };
                return BusinessEntity;
            })();
            Common.BusinessEntity = BusinessEntity;
            var Helper = (function () {
                function Helper() {
                }
                Helper.alertMessage = function (message) {
                    (Xrm.Utility !== undefined && Xrm.Utility.alertDialog !== undefined) ? Xrm.Utility.alertDialog(message) : alert(message);
                };
                Helper.crmXmlDecode = function (s) {
                    if ('undefined' === typeof s || 'unknown' === typeof s || null === s)
                        return s;
                    if (typeof s != "string")
                        s = s.toString();
                    return s;
                };
                Helper.crmXmlEncode = function (s) {
                    if ('undefined' === typeof s || 'unknown' === typeof s || null === s)
                        return s;
                    else if (typeof s != "string")
                        s = s.toString();
                    return Helper.innerSurrogateAmpersandWorkaround(s);
                };
                Helper.dateReviver = function (key, value) {
                    ///<summary>
                    /// Private function to convert matching string values to Date objects.
                    ///</summary>
                    ///<param name="key" type="String">
                    /// The key used to identify the object property
                    ///</param>
                    ///<param name="value" type="String">
                    /// The string value representing a date
                    ///</param>
                    var a;
                    if (typeof value === 'string') {
                        a = /Date\(([-+]?\d+)\)/.exec(value);
                        if (a) {
                            return new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
                        }
                    }
                    return value;
                };
                Helper.encodeDate = function (dateTime) {
                    return dateTime.getFullYear() + "-" +
                        Helper.padNumber(dateTime.getMonth() + 1) + "-" +
                        Helper.padNumber(dateTime.getDate()) + "T" +
                        Helper.padNumber(dateTime.getHours()) + ":" +
                        Helper.padNumber(dateTime.getMinutes()) + ":" +
                        Helper.padNumber(dateTime.getSeconds());
                };
                Helper.encodeValue = function (value) {
                    // Handle GUIDs wrapped in braces
                    if (typeof value == typeof "" && value.slice(0, 1) === "{" && value.slice(-1) === "}") {
                        value = value.slice(1, -1);
                    }
                    return (typeof value === "object" && value.getTime)
                        ? Helper.encodeDate(value)
                        : Helper.crmXmlEncode(value);
                };
                Helper.getNodeName = function (node) {
                    if (typeof (node.baseName) != "undefined") {
                        return node.baseName;
                    }
                    else {
                        return node.localName;
                    }
                };
                Helper.getNodeText = function (node) {
                    if (typeof (node.text) != "undefined") {
                        return node.text;
                    }
                    else {
                        return node.textContent;
                    }
                };
                Helper.htmlEncode = function (s) {
                    if (s === null || s === "" || s === undefined)
                        return s;
                    var buffer = "";
                    var hEncode = "";
                    for (var count = 0, cnt = 0, sLength = s.length; cnt < sLength; cnt++) {
                        var c = s.charCodeAt(cnt);
                        if (c > 96 && c < 123 || c > 64 && c < 91 || c === 32 || c > 47 && c < 58 || c === 46 || c === 44 || c === 45 || c === 95)
                            buffer += String.fromCharCode(c);
                        else
                            buffer += "&#" + c + ";";
                        if (++count === 500) {
                            hEncode += buffer;
                            buffer = "";
                            count = 0;
                        }
                    }
                    if (buffer.length)
                        hEncode += buffer;
                    return hEncode;
                };
                Helper.innerSurrogateAmpersandWorkaround = function (s) {
                    var buffer = '';
                    var c0;
                    var cnt;
                    var cntlength;
                    for (cnt = 0, cntlength = s.length; cnt < cntlength; cnt++) {
                        c0 = s.charCodeAt(cnt);
                        if (c0 >= 55296 && c0 <= 57343)
                            if (cnt + 1 < s.length) {
                                var c1 = s.charCodeAt(cnt + 1);
                                if (c1 >= 56320 && c1 <= 57343) {
                                    buffer += ["CRMEntityReferenceOpen", ((c0 - 55296) * 1024 + (c1 & 1023) + 65536).toString(16), "CRMEntityReferenceClose"].join("");
                                    cnt++;
                                }
                                else
                                    buffer += String.fromCharCode(c0);
                            }
                            else
                                buffer += String.fromCharCode(c0);
                        else
                            buffer += String.fromCharCode(c0);
                    }
                    s = buffer;
                    buffer = "";
                    for (cnt = 0, cntlength = s.length; cnt < cntlength; cnt++) {
                        c0 = s.charCodeAt(cnt);
                        if (c0 >= 55296 && c0 <= 57343)
                            buffer += String.fromCharCode(65533);
                        else
                            buffer += String.fromCharCode(c0);
                    }
                    s = buffer;
                    s = Helper.htmlEncode(s);
                    s = s.replace(/CRMEntityReferenceOpen/g, "&#x");
                    s = s.replace(/CRMEntityReferenceClose/g, ";");
                    return s;
                };
                Helper.isArray = function (input) {
                    return input.constructor.toString().indexOf("Array") !== -1;
                };
                Helper.joinArray = function (prefix, array, suffix) {
                    var output = [];
                    for (var i = 0, ilength = array.length; i < ilength; i++) {
                        if (array[i] !== "" && array[i] != undefined) {
                            output.push(prefix, array[i], suffix);
                        }
                    }
                    return output.join("");
                };
                Helper.joinConditionPair = function (attributes, values) {
                    var output = [];
                    for (var i = 0, ilength = attributes.length; i < ilength; i++) {
                        if (attributes[i] !== "") {
                            var value1 = values[i];
                            if (typeof value1 == typeof []) {
                                output.push("<condition attribute='", attributes[i], "' operator='in' >");
                                for (var valueIndex in value1) {
                                    if (value1.hasOwnProperty(valueIndex)) {
                                        var value = Helper.encodeValue(value1[valueIndex]);
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
                };
                Helper.padNumber = function (s, len) {
                    if (len === void 0) { len = 2; }
                    s = '' + s;
                    while (s.length < len) {
                        s = "0" + s;
                    }
                    return s;
                };
                /*
                 * setClientUrl :
                 * Experimental. NO SUPPORT.
                 */
                Helper.setClientUrl = function (url) {
                    Helper.clientBaseUrl = url;
                };
                Helper.stringToDate = function (s) {
                    var b = s.split(/\D/);
                    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5]));
                };
                Helper.xrmContext = function () {
                    ///<summary>
                    /// Private function to the context object.
                    ///</summary>
                    ///<returns>Context</returns>
                    var oContext;
                    if (Helper.clientBaseUrl === '') {
                        var fnWindow = window;
                        if (typeof fnWindow.GetGlobalContext != "undefined") {
                            oContext = fnWindow.GetGlobalContext();
                        }
                        else if (typeof GetGlobalContext != "undefined") {
                            oContext = GetGlobalContext();
                        }
                        else {
                            var fnParentWindow = window.parent;
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
                    else {
                        oContext = new XrmContext();
                        oContext.getClientUrl = function () {
                            return Helper.clientBaseUrl;
                        };
                    }
                    return oContext;
                };
                ;
                Helper.clientBaseUrl = '';
                return Helper;
            })();
            Common.Helper = Helper;
            var KeyValuePair = (function () {
                function KeyValuePair() {
                }
                return KeyValuePair;
            })();
            Common.KeyValuePair = KeyValuePair;
            var QueryOptions = (function () {
                function QueryOptions(queryOptions) {
                    if (queryOptions != null) {
                        this.entityName = queryOptions.entityName;
                        this.attributes = queryOptions.attributes;
                        this.values = queryOptions.values;
                        this.columnSet = queryOptions.columnSet;
                        this.orderBy = queryOptions.orderBy;
                    }
                }
                return QueryOptions;
            })();
            Common.QueryOptions = QueryOptions;
            /*
             * XrmContext :
             * Experimental implementation of the Context interface
             * Usage is unsupported.
             * You are on your own.
             */
            var XrmContext = (function () {
                function XrmContext() {
                }
                /// Returns the base URL that was used to access the application This method is new in Microsoft Dynamics CRM 2011 Update Rollup 12 and the Microsoft Dynamics CRM December 2012 Service Update
                XrmContext.prototype.getClientUrl = function () {
                    return "Not implemented yet.";
                };
                ;
                ///  Returns a string representing the current Microsoft Office Outlook theme chosen by the user. 
                XrmContext.prototype.getCurrentTheme = function () {
                    return "Not implemented yet.";
                };
                ;
                ///Returns a bool representing whether autosave is enabled.
                XrmContext.prototype.getIsAutoSaveEnabled = function () {
                    return false;
                };
                ;
                /// Returns the LCID value that represents the Microsoft Dynamics CRM Language Pack that is the base language for the organization.
                XrmContext.prototype.getOrgLcid = function () {
                    return 1033;
                };
                ;
                /// Returns the unique text value of the organizations name. 
                XrmContext.prototype.getOrgUniqueName = function () {
                    return "Not implemented yet.";
                };
                ;
                /// Returns an array of key value pairs representing the query string arguments that were passed to the page.
                XrmContext.prototype.getQueryStringParameters = function () {
                    var queryStringParams = [];
                    return queryStringParams;
                };
                ;
                /// Returns the GUID value of the SystemUser.id value for the current user. 
                XrmContext.prototype.getUserId = function () {
                    return "Not implemented yet.";
                };
                ;
                /// Returns the LCID value that represents the Microsoft Dynamics CRM Language Pack that is the user selected as their preferred language.
                XrmContext.prototype.getUserLcid = function () {
                    return 1033;
                };
                ;
                /// Returns the full name of the current user
                XrmContext.prototype.getUserName = function () {
                    var userName = null;
                    return userName;
                };
                ;
                /// Returns an array of strings representing the GUID values of each of the security roles that the user is associated with.
                XrmContext.prototype.getUserRoles = function () {
                    var userRoles = [];
                    return userRoles;
                };
                ;
                /// Prepends the organization name to the specified path.
                XrmContext.prototype.prependOrgName = function (sPath) {
                    return "Not implemented yet.";
                };
                ;
                return XrmContext;
            })();
            Common.XrmContext = XrmContext;
            var XrmEntityCollection = (function () {
                function XrmEntityCollection(xrmEntityCollection) {
                    this.type = 'EntityCollection';
                    if (xrmEntityCollection != null)
                        this.value = xrmEntityCollection.value;
                }
                return XrmEntityCollection;
            })();
            Common.XrmEntityCollection = XrmEntityCollection;
            var XrmEntityReference = (function () {
                function XrmEntityReference(xrmEntityReference) {
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
                return XrmEntityReference;
            })();
            Common.XrmEntityReference = XrmEntityReference;
            var XrmOptionSetValue = (function () {
                function XrmOptionSetValue(xrmOptionSetValue) {
                    this.type = 'OptionSetValue';
                    if (xrmOptionSetValue != null) {
                        this.value = xrmOptionSetValue.value;
                        this.formattedValue = xrmOptionSetValue.formattedValue;
                        this.type = xrmOptionSetValue.type != null ? xrmOptionSetValue.type : 'OptionSetValue';
                    }
                }
                return XrmOptionSetValue;
            })();
            Common.XrmOptionSetValue = XrmOptionSetValue;
            var XrmValue = (function () {
                function XrmValue(xrmValue) {
                    if (xrmValue != null) {
                        this.type = xrmValue.type;
                        this.value = xrmValue.value;
                    }
                }
                return XrmValue;
            })();
            Common.XrmValue = XrmValue;
        })(Common = XrmServiceToolkit.Common || (XrmServiceToolkit.Common = {}));
    })(XrmServiceToolkit = ngXrm.XrmServiceToolkit || (ngXrm.XrmServiceToolkit = {}));
})(ngXrm || (ngXrm = {}));
/**
 * ngXrm.XrmServiceToolkit.Common.Rest
 * A common module for the  ngXrm.XrmServiceToolkit.Rest module.
 */
var ngXrm;
(function (ngXrm) {
    var XrmServiceToolkit;
    (function (XrmServiceToolkit) {
        var Common;
        (function (Common) {
            var Rest;
            (function (Rest) {
                var RestGet = (function () {
                    function RestGet(restGet) {
                        this.requestUrl = restGet.requestUrl;
                        this.httpConfig = restGet.httpConfig;
                    }
                    return RestGet;
                })();
                Rest.RestGet = RestGet;
                var RestPost = (function () {
                    function RestPost(restPost) {
                        this.requestUrl = restPost.requestUrl;
                        this.object = restPost.object;
                        this.httpConfig = restPost.httpConfig;
                    }
                    return RestPost;
                })();
                Rest.RestPost = RestPost;
            })(Rest = Common.Rest || (Common.Rest = {}));
        })(Common = XrmServiceToolkit.Common || (XrmServiceToolkit.Common = {}));
    })(XrmServiceToolkit = ngXrm.XrmServiceToolkit || (ngXrm.XrmServiceToolkit = {}));
})(ngXrm || (ngXrm = {}));
/**
* ngXrm.XrmServiceToolkit.Soap based on XrmServiceToolkit.Soap
*/
var ngXrm;
(function (ngXrm) {
    var XrmServiceToolkit;
    (function (XrmServiceToolkit) {
        var Soap;
        (function (Soap) {
            var Common = ngXrm.XrmServiceToolkit.Common;
            var SoapClient = (function () {
                function SoapClient($http) {
                    this.$http = $http;
                    // Added in 1.4.1 for metadata retrieval 
                    // Inspired From Microsoft SDK code to retrieve Metadata using JavaScript
                    // Copyright (C) Microsoft Corporation.  All rights reserved.
                    this.arrayElements = ["Attributes",
                        "ManyToManyRelationships",
                        "ManyToOneRelationships",
                        "OneToManyRelationships",
                        "Privileges",
                        "LocalizedLabels",
                        "Options",
                        "Targets"];
                }
                //***************
                // Helper Methods
                //***************
                SoapClient.prototype.__isMetadataArray = function (elementName) {
                    var self = this;
                    for (var i = 0, ilength = self.arrayElements.length; i < ilength; i++) {
                        if (elementName === self.arrayElements[i]) {
                            return true;
                        }
                    }
                    return false;
                };
                SoapClient.prototype.__isNodeNull = function (node) {
                    if (node == null) {
                        return true;
                    }
                    if ((node.attributes.getNamedItem("i:nil") != null) && (node.attributes.getNamedItem("i:nil").value === "true")) {
                        return true;
                    }
                    return false;
                };
                SoapClient.prototype.__nsResolver = function (prefix) {
                    var ns = {
                        "s": "http://schemas.xmlsoap.org/soap/envelope/",
                        "a": "http://schemas.microsoft.com/xrm/2011/Contracts",
                        "i": "http://www.w3.org/2001/XMLSchema-instance",
                        "b": "http://schemas.datacontract.org/2004/07/System.Collections.Generic",
                        "c": "http://schemas.microsoft.com/xrm/2011/Metadata",
                        "ser": "http://schemas.microsoft.com/xrm/2011/Contracts/Services"
                    };
                    return ns[prefix] || null;
                };
                SoapClient.prototype.__objectifyNode = function (node) {
                    var self = this;
                    //Check for null
                    if (node.attributes != null && node.attributes.length === 1) {
                        if (node.attributes.getNamedItem("i:nil") != null && node.attributes.getNamedItem("i:nil").nodeValue === "true") {
                            return null;
                        }
                    }
                    //Check if it is a value
                    if ((node.firstChild != null) && (node.firstChild.nodeType === 3)) {
                        var nodeName = Common.Helper.getNodeName(node);
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
                                if ((node.firstChild.nodeValue === "ApplicationRequired") ||
                                    (node.firstChild.nodeValue === "None") ||
                                    (node.firstChild.nodeValue === "Recommended") ||
                                    (node.firstChild.nodeValue === "SystemRequired")) {
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
                        var arrayValue = [];
                        for (var iii = 0, tempLength = node.childNodes.length; iii < tempLength; iii++) {
                            var objectTypeName = void 0;
                            if ((node.childNodes[iii].attributes != null) && (node.childNodes[iii].attributes.getNamedItem("i:type") != null)) {
                                objectTypeName = node.childNodes[iii].attributes.getNamedItem("i:type").nodeValue.split(":")[1];
                            }
                            else {
                                objectTypeName = Common.Helper.getNodeName(node.childNodes[iii]);
                            }
                            var b = self.__objectifyNode(node.childNodes[iii]);
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
                    var c = {};
                    if (node.attributes.getNamedItem("i:type") != null) {
                        c._type = node.attributes.getNamedItem("i:type").nodeValue.split(":")[1];
                    }
                    for (var i = 0, ilength = node.childNodes.length; i < ilength; i++) {
                        if (node.childNodes[i].nodeType === 3) {
                            c[Common.Helper.getNodeName(node.childNodes[i])] = node.childNodes[i].nodeValue;
                        }
                        else {
                            c[Common.Helper.getNodeName(node.childNodes[i])] = self.__objectifyNode(node.childNodes[i]);
                        }
                    }
                    return c;
                };
                SoapClient.prototype.__orgServicePath = function (xrmContext) {
                    ///<summary>
                    /// Private function to return the path to the organization service.
                    ///</summary>
                    ///<returns>String</returns>
                    var self = this;
                    return [xrmContext.getClientUrl(), "/XRMServices/2011/Organization.svc/web"].join("");
                };
                SoapClient.prototype.__selectNodes = function (node, xPathExpression) {
                    var self = this;
                    if (typeof (node.selectNodes) != "undefined") {
                        return node.selectNodes(xPathExpression);
                    }
                    else {
                        var output = [];
                        var xPathResults = node.evaluate(xPathExpression, node, self.__nsResolver, XPathResult.ANY_TYPE, null);
                        var result = xPathResults.iterateNext();
                        while (result) {
                            output.push(result);
                            result = xPathResults.iterateNext();
                        }
                        return output;
                    }
                };
                SoapClient.prototype.__selectSingleNode = function (node, xpathExpr) {
                    var self = this;
                    if (typeof (node.selectSingleNode) != "undefined") {
                        return node.selectSingleNode(xpathExpr);
                    }
                    else {
                        var xpe = new XPathEvaluator();
                        var results = xpe.evaluate(xpathExpr, node, { lookupNamespaceURI: self.__nsResolver }, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                        return results.singleNodeValue;
                    }
                };
                SoapClient.prototype.__selectSingleNodeText = function (node, xpathExpr) {
                    var self = this;
                    var x = self.__selectSingleNode(node, xpathExpr);
                    if (self.__isNodeNull(x)) {
                        return null;
                    }
                    if (typeof (x.text) != "undefined") {
                        return x.text;
                    }
                    else {
                        return x.textContent;
                    }
                };
                SoapClient.prototype.__setSelectionNamespaces = function (doc) {
                    var namespaces = [
                        "xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'",
                        "xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'",
                        "xmlns:i='http://www.w3.org/2001/XMLSchema-instance'",
                        "xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'",
                        "xmlns:c='http://schemas.microsoft.com/xrm/2011/Metadata'",
                        "xmlns:ser='http://schemas.microsoft.com/xrm/2011/Contracts/Services'"
                    ];
                    doc.setProperty("SelectionNamespaces", namespaces.join(" "));
                };
                SoapClient.prototype.__xmlParser = function (txt) {
                    ///<summary>
                    /// cross browser responseXml to return a XML object
                    ///</summary>
                    var xmlDoc = null;
                    var fnWindow = Window;
                    try {
                        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async = false;
                        xmlDoc.loadXML(txt);
                    }
                    catch (e) {
                        if (fnWindow.DOMParser) {
                            // ReSharper disable InconsistentNaming
                            var parser = new DOMParser();
                            // ReSharper restore InconsistentNaming
                            xmlDoc = parser.parseFromString(txt, "text/xml");
                        }
                        else {
                            bootbox.alert("Cannot convert the XML string to a cross-browser XML object.");
                        }
                    }
                    return xmlDoc;
                };
                SoapClient.prototype.__xmlToString = function (responseXml) {
                    var self = this;
                    var xmlString = '';
                    try {
                        if (responseXml != null) {
                            if (typeof XMLSerializer !== "undefined" && typeof responseXml.xml === "undefined") {
                                // ReSharper disable InconsistentNaming
                                xmlString = (new XMLSerializer()).serializeToString(responseXml);
                            }
                            else {
                                if (typeof responseXml.xml !== "undefined") {
                                    xmlString = responseXml.xml;
                                }
                                else if (typeof responseXml[0].xml !== "undefined") {
                                    xmlString = responseXml[0].xml;
                                }
                            }
                        }
                    }
                    catch (e) {
                        Common.Helper.alertMessage("Cannot convert the XML to a string.");
                    }
                    return xmlString;
                };
                //*******************
                // Actual Xrm Methods
                //*******************
                /**
                * doRequest :
                * Executes the soap request using $http
                */
                SoapClient.prototype._doRequest = function (soapBody, requestType) {
                    var self = this;
                    // Wrap the Soap Body in a soap:Envelope.
                    var soapXml = ["<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>",
                        "<soap:Body>",
                        "<", requestType, " xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>", soapBody, "</", requestType, ">",
                        "</soap:Body>",
                        "</soap:Envelope>"
                    ].join("");
                    var httpConfig = {
                        headers: {
                            'Accept': 'application/xml, text/xml, */*',
                            'Content-Type': 'text/xml; charset=utf-8',
                            'SOAPAction': "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/" + requestType
                        }
                    };
                    try {
                        return self.$http.post(self.__orgServicePath(Common.Helper.xrmContext()), soapXml, httpConfig)
                            .then(function (rslt) {
                            var result = self.__xmlParser(rslt.data);
                            try {
                                self.__setSelectionNamespaces(result);
                            }
                            catch (e) { }
                            return result;
                        })
                            .catch(function (error) {
                            return Q.reject(error);
                        });
                    }
                    catch (ex) {
                        return Q.reject(ex);
                    }
                };
                /**
                 *  createEntity :
                 * Sends a $http request to create a new record.
                 * Tested : Success
                 */
                SoapClient.prototype.createEntity = function (bEntity) {
                    ///<param name="be" type="Object">
                    /// A JavaScript object with properties corresponding to the Schema name of
                    /// entity attributes that are valid for create operations.
                    /// </param>
                    var self = this;
                    var request = bEntity.serialize();
                    var mBody = ["<request i:type='a:CreateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
                        "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
                        "<a:KeyValuePairOfstringanyType>",
                        "<b:key>Target</b:key>",
                        request,
                        "</a:KeyValuePairOfstringanyType>",
                        "</a:Parameters>",
                        "<a:RequestId i:nil='true' />",
                        "<a:RequestName>Create</a:RequestName>",
                        "</request>"].join("");
                    return self._doRequest(mBody, "Execute").then(function (rslt) {
                        var response = self.__selectSingleNodeText(rslt, "//b:value");
                        var result = Common.Helper.crmXmlDecode(response);
                        return result;
                    });
                };
                /**
                 * updateEntity :
                 * Sends $http request to update an existing record.
                 * Tested : Success
                 */
                SoapClient.prototype.updateEntity = function (bEntity) {
                    ///<param name="businessEntity" type="Object">
                    /// A JavaScript object with properties corresponding to the Schema name of
                    /// entity attributes that are valid for update operations.
                    /// </param>
                    var self = this;
                    var request = bEntity.serialize();
                    var mBody = ["<request i:type='a:UpdateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
                        "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
                        "<a:KeyValuePairOfstringanyType>",
                        "<b:key>Target</b:key>",
                        request,
                        "</a:KeyValuePairOfstringanyType>",
                        "</a:Parameters>",
                        "<a:RequestId i:nil='true' />",
                        "<a:RequestName>Update</a:RequestName>",
                        "</request>"].join("");
                    return self._doRequest(mBody, "Execute").then(function (rslt) {
                        var response = self.__selectSingleNodeText(rslt, "//a:Results");
                        var result = Common.Helper.crmXmlDecode(response);
                        return result;
                    });
                };
                /**
                 * deleteEntity :
                 * Sends $http request to delete a record.
                 * Tested : Success
                 */
                SoapClient.prototype.deleteEntity = function (entityName, id) {
                    ///<param name="entityName" type="String">
                    /// A JavaScript String corresponding to the Schema name of
                    /// entity that is used for delete operations.
                    /// </param>
                    ///<param name="id" type="String">
                    /// A JavaScript String corresponding to the GUID of
                    /// entity that is used for delete operations.
                    /// </param>
                    var self = this;
                    var request = [
                        "<request i:type='a:DeleteRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'><a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'><a:KeyValuePairOfstringanyType><b:key>Target</b:key><b:value i:type='a:EntityReference'><a:Id>",
                        id, "</a:Id><a:LogicalName>",
                        entityName, "</a:LogicalName><a:Name i:nil='true' /></b:value></a:KeyValuePairOfstringanyType></a:Parameters><a:RequestId i:nil='true' /><a:RequestName>Delete</a:RequestName></request>"
                    ].join("");
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        var response = self.__selectSingleNodeText(rslt, "//a:Results");
                        var result = Common.Helper.crmXmlDecode(response);
                        return result;
                    });
                };
                /**
                 * execute :
                 * Sends $http request to execute a soap request.
                 * Tested : Success
                 */
                SoapClient.prototype.execute = function (request) {
                    ///<param name="request" type="String">
                    /// A JavaScript string corresponding to the soap request
                    /// that are valid for execute operations.
                    /// </param>
                    var self = this;
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        return rslt;
                    });
                };
                /**
                 * fetchMore :
                 * Executes fetchXml for the next page of the results (returns 5000 records max).
                 * Tested : Untested
                 */
                SoapClient.prototype._doFetch = function (fetchCoreXml, pageNumber, pageCookie) {
                    var self = this;
                    var fetchXml = fetchCoreXml;
                    if (pageNumber > 1)
                        fetchXml =
                            [
                                "<fetch mapping='logical' page='" + pageNumber.toString() + "' count='5000' paging-cookie='" + pageCookie + "'>",
                                fetchCoreXml.replace(/\"/g, "'"),
                                "</fetch>"
                            ].join("");
                    var msgBody = [
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
                        .then(function (rslt) {
                        return rslt;
                    })
                        .catch(function (error) {
                        return Q.reject(error);
                    });
                };
                /**
                 * fetch :
                 * Sends $http request to do a fetch request.
                 * Tested : Success
                 */
                SoapClient.prototype.fetch = function (fetchCore, fetchAll, maxFetch) {
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
                    var self = this;
                    var defer = Q.defer();
                    var fetchXml = fetchCore;
                    var maxFetchRecords = maxFetch != null ? maxFetch : -1;
                    if (fetchCore.slice(0, 7) === "<entity") {
                        fetchXml =
                            [
                                "<fetch mapping='logical'>",
                                fetchCore.replace(/\"/g, "'"),
                                "</fetch>"
                            ].join("");
                    }
                    else {
                        var isAggregate = (fetchCore.indexOf("aggregate=") !== -1);
                        var isLimitedReturn = (fetchCore.indexOf("page='1'") !== -1 && fetchCore.indexOf("count='") !== -1);
                        var distinctPos = fetchCore.indexOf("distinct=");
                        var isDistinct = (distinctPos !== -1);
                        var valQuotes = fetchCore.substring(distinctPos + 9, distinctPos + 10);
                        var distinctValue = isDistinct
                            ? fetchCore.substring(fetchCore.indexOf("distinct=") + 10, fetchCore.indexOf(valQuotes, fetchCore.indexOf("distinct=") + 10))
                            : "false";
                        var xmlDoc = self.__xmlParser(fetchCore);
                        var fetchEntity = self.__selectSingleNode(xmlDoc, "//entity");
                        if (fetchEntity === null) {
                            Q.reject("XrmServiceToolkit.Fetch: No 'entity' node in the provided FetchXML.");
                        }
                        var fetchCoreDom = fetchEntity;
                        try {
                            fetchCore = self.__xmlToString(fetchCoreDom).replace(/\"/g, "'");
                        }
                        catch (error) {
                            if (fetchCoreDom !== undefined && fetchCoreDom.xml) {
                                fetchCore = fetchCoreDom.xml.replace(/\"/g, "'");
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
                    var pageNumber = 1;
                    var resultArray = [];
                    var recursiveFn = function (rslt) {
                        //TODO: test when rslt has no records
                        if (rslt != null) {
                            var fetchResult = self.__selectSingleNode(rslt, "//a:Entities");
                            var moreRecords = (self.__selectSingleNodeText(rslt, "//a:MoreRecords") === "true");
                            if (fetchResult != null) {
                                for (var ii = 0, olength = fetchResult.childNodes.length; ii < olength; ii++) {
                                    var entity = new Common.BusinessEntity();
                                    entity.deserialize(fetchResult.childNodes[ii]);
                                    resultArray.push(entity);
                                }
                                if (fetchAll && moreRecords && (maxFetchRecords === -1 || resultArray.length <= maxFetchRecords)) {
                                    var pageCookie = self.__selectSingleNodeText(rslt, "//a:PagingCookie").replace(/\"/g, '\'').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&quot;');
                                    pageNumber += 1;
                                    self._doFetch(fetchCore, pageNumber, pageCookie)
                                        .then(recursiveFn)
                                        .catch(function (error) {
                                        return defer.reject(error);
                                    });
                                }
                                else
                                    defer.resolve(resultArray);
                            }
                        }
                    };
                    self._doFetch(fetchXml, pageNumber, null)
                        .then(recursiveFn)
                        .catch(function (error) {
                        return defer.reject(error);
                    });
                    return defer.promise;
                };
                /**
                 * retrieveEntity :
                 * Sends $http request to retrieve a record.
                 * Tested : Success
                 */
                SoapClient.prototype.retrieveEntity = function (entityName, id, columnSet) {
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
                    var self = this;
                    var attributes = "";
                    var query = "";
                    if (columnSet != null) {
                        for (var i = 0, ilength = columnSet.length; i < ilength; i++) {
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
                    var msgBody = [
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
                    return self._doRequest(msgBody, "Execute").then(function (rslt) {
                        var retrieveResult = self.__selectSingleNode(rslt, "//b:value");
                        var entity = new Common.BusinessEntity();
                        entity.deserialize(retrieveResult);
                        return entity;
                    });
                };
                /**
                 *  retrieveMultiple :
                 * Sends $http request to do a retrieveMultiple request.
                 * Tested : Success
                 */
                SoapClient.prototype.retrieveMultiple = function (query) {
                    ///<param name="query" type="String">
                    /// A JavaScript String with properties corresponding to the retrievemultiple request
                    /// that are valid for retrievemultiple operations.
                    /// </param>
                    var self = this;
                    var request = [
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
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        var resultNodes = self.__selectSingleNode(rslt, "//a:Entities");
                        var retriveMultipleResults = [];
                        for (var i = 0, ilength = resultNodes.childNodes.length; i < ilength; i++) {
                            var entity = new Common.BusinessEntity();
                            entity.deserialize(resultNodes.childNodes[i]);
                            retriveMultipleResults[i] = entity;
                        }
                        return retriveMultipleResults;
                    });
                };
                SoapClient.prototype._doQueryByAttribute = function (queryOptions, queryAll, maxRecords) {
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
                    var self = this;
                    if (queryOptions.entityName === undefined || queryOptions.entityName === ''
                        || queryOptions.columnSet === undefined || queryOptions.columnSet.length === 0
                        || queryOptions.attributes === undefined || queryOptions.attributes.length === 0
                        || queryOptions.values === undefined || queryOptions.values.length === 0) {
                        return Q.reject("QueryOptions are invalid.");
                    }
                    if (queryOptions.attributes.length !== queryOptions.values.length)
                        return Q.reject("The number of values must match the number of attributes provided.");
                    var xml = [
                        "<entity name='", queryOptions.entityName, "'>",
                        Common.Helper.joinArray("<attribute name='", queryOptions.columnSet, "' />"),
                        Common.Helper.joinArray("<order attribute='", queryOptions.orderBy || [''], "' />"),
                        "<filter>",
                        Common.Helper.joinConditionPair(queryOptions.attributes, queryOptions.values),
                        "</filter>",
                        "</entity>"
                    ].join("");
                    return self.fetch(xml, queryAll, maxRecords);
                };
                /**
                 * queryByAttribute :
                 * Sends $http request to do a queryByAttribute request.
                 * Tested : Untested
                 */
                SoapClient.prototype.queryByAttribute = function (queryOptions) {
                    ///<param name="queryOptions" type="Object">
                    /// A JavaScript Object with properties corresponding to the queryByAttribute Criteria
                    /// that are valid for queryByAttribute operations.
                    /// queryOptions.entityName is a string represents the name of the entity
                    /// queryOptions.attributes is a array represents the attributes of the entity to query
                    /// queryOptions.values is a array represents the values of the attributes to query
                    /// queryOptions.columnSet is a array represents the attributes of the entity to return
                    /// queryOptions.orderBy is a array represents the order conditions of the results
                    /// </param>
                    var self = this;
                    return self._doQueryByAttribute(queryOptions, false);
                };
                /**
                 * queryAll :
                 * Sends $http request to do a queryAll request. This is to return all records (>5k+).
                 * Consider Performance impact when using this method.
                 * Tested : Success
                 */
                SoapClient.prototype.queryAllByAttribute = function (queryOptions, maxRecords) {
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
                    var self = this;
                    return self._doQueryByAttribute(queryOptions, true, maxRecords);
                };
                /**
                 * setState :
                 * Sends $htpp request to setState of a record.
                 * Tested : Success
                 */
                SoapClient.prototype.setState = function (entityName, id, stateCode, statusCode) {
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
                    var self = this;
                    var request = [
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
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        var responseText = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
                        var result = Common.Helper.crmXmlDecode(responseText);
                        return result;
                    });
                };
                /**
                 * associate :
                 * Sends $http request to associate records.
                 * Tested : Success
                 */
                SoapClient.prototype.associate = function (relationshipName, targetEntityName, targetId, relatedEntityName, relatedBusinessEntities) {
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
                    var self = this;
                    var relatedEntities = relatedBusinessEntities;
                    var output = [];
                    for (var i = 0, ilength = relatedEntities.length; i < ilength; i++) {
                        if (relatedEntities[i].id !== "") {
                            output.push("<a:EntityReference>", "<a:Id>", relatedEntities[i].id, "</a:Id>", "<a:LogicalName>", relatedEntityName, "</a:LogicalName>", "<a:Name i:nil='true' />", "</a:EntityReference>");
                        }
                    }
                    var relatedXml = output.join("");
                    var request = [
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
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        var responseText = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
                        var result = Common.Helper.crmXmlDecode(responseText);
                        return result;
                    });
                };
                /**
                 * disassociate :
                 * Sends $http request to disassociate records.
                 * Tested : Success
                 */
                SoapClient.prototype.disassociate = function (relationshipName, targetEntityName, targetId, relatedEntityName, relatedBusinessEntities) {
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
                    var self = this;
                    var relatedEntities = relatedBusinessEntities;
                    var output = [];
                    for (var i = 0, ilength = relatedEntities.length; i < ilength; i++) {
                        if (relatedEntities[i].id !== "") {
                            output.push("<a:EntityReference>", "<a:Id>", relatedEntities[i].id, "</a:Id>", "<a:LogicalName>", relatedEntityName, "</a:LogicalName>", "<a:Name i:nil='true' />", "</a:EntityReference>");
                        }
                    }
                    var relatedXml = output.join("");
                    var request = [
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
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        var responseText = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
                        var result = Common.Helper.crmXmlDecode(responseText);
                        return result;
                    });
                };
                /**
                 * getCurrentUserId :
                 * Sends $http request to retrieve the GUID of the current user.
                 * Tested : Success
                 */
                SoapClient.prototype.getCurrentUserId = function () {
                    ///<summary>
                    /// Sends synchronous request to retrieve the GUID of the current user.
                    ///</summary>
                    var self = this;
                    var request = [
                        "<request i:type='b:WhoAmIRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
                        "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />",
                        "<a:RequestId i:nil='true' />",
                        "<a:RequestName>WhoAmI</a:RequestName>",
                        "</request>"
                    ].join("");
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        return Common.Helper.getNodeText(self.__selectNodes(rslt, "//b:value")[0]);
                    });
                };
                /**
                 * getCurrentUserBusinessUnitId :
                 * Sends $http request to retrieve the GUID of the current user's business unit.
                 * Tested : Success
                 */
                SoapClient.prototype.getCurrentUserBusinessUnitId = function () {
                    var self = this;
                    var request = ["<request i:type='b:WhoAmIRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
                        "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />",
                        "<a:RequestId i:nil='true' />",
                        "<a:RequestName>WhoAmI</a:RequestName>",
                        "</request>"].join("");
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        return Common.Helper.getNodeText(self.__selectNodes(rslt, "//b:value")[1]);
                    });
                };
                /**
                 * getCurrentUserRoles :
                 * Sends $http request to retrieve the list of the current user's roles.
                 * Tested : Success
                 */
                SoapClient.prototype.getCurrentUserRoles = function () {
                    var self = this;
                    var xml = [
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
                    return self.fetch(xml, true).then(function (rslt) {
                        var roles = [];
                        if (rslt !== null && typeof rslt != 'undefined') {
                            for (var i = 0, ilength = rslt.length; i < ilength; i++) {
                                roles.push(rslt[i].attributes["name"].value.toString());
                            }
                        }
                        return roles;
                    });
                };
                /**
                 * isCurrentUserInRole :
                 * Sends $http request to check if the current user has certain roles.
                 * Passes name of role as arguments. For example, IsCurrentUserInRole('System Administrator')
                 * Returns true or false.
                 * Tested : Success
                 */
                SoapClient.prototype.isCurrentUserInRole = function (args) {
                    var self = this;
                    var result = false;
                    if (args == null || args == undefined)
                        args = [''];
                    return self.getCurrentUserRoles().then(function (rslt) {
                        if (rslt != null && rslt != undefined) {
                            for (var i = 0; i < rslt.length; i++) {
                                for (var j = 0; j < args.length; j++) {
                                    if (rslt[i] === args[j]) {
                                        result = true;
                                        break;
                                    }
                                }
                            }
                        }
                        return result;
                    });
                };
                /**
                 * assign :
                 * Sends $http request to assign an existing record to a user / a team.
                 * Tested : Success
                 */
                SoapClient.prototype.assign = function (targetEntityName, targetId, assigneeEntityName, assigneeId) {
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
                    var self = this;
                    var request = ["<request i:type='b:AssignRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
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
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        var responseText = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
                        var result = Common.Helper.crmXmlDecode(responseText);
                        return result;
                    });
                };
                /**
                 * grantAccess :
                 * Sends $http request to do a grantAccess request.
                 * The method grants a specified security principal (user or team) the provided AccessRights to the given record.
                 * Levels of Access Options are: AppendAccess, AppendToAccess, AssignAccess, CreateAccess, DeleteAccess, None, ReadAccess, ShareAccess, and WriteAccess
                 * NOTE: Read the CRM SDK documentation for more information on the GrantAccessRequest.
                 * Tested : Success
                 */
                SoapClient.prototype.grantAccess = function (accessOptions) {
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
                    var self = this;
                    var accessRightString = [];
                    for (var i = 0, ilength = accessOptions.accessRights.length; i < ilength; i++) {
                        accessRightString.push(Common.Helper.encodeValue(accessOptions.accessRights[i]) + " ");
                    }
                    var request = ["<request i:type='b:GrantAccessRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
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
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        var responseText = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
                        var result = Common.Helper.crmXmlDecode(responseText);
                        return result;
                    });
                };
                /**
                 * modifyAccess :
                 * Sends $http request to do a modifyAccess request.
                 * The method modifies the AccessRights of the given record for a specified security principal (user or team)
                 * Levels of Access Options are: AppendAccess, AppendToAccess, AssignAccess, CreateAccess, DeleteAccess, None, ReadAccess, ShareAccess, and WriteAccess
                 * NOTE: Read the CRM SDK documentation for more information on the GrantAccessRequest.
                 * Tested : Success
                 */
                SoapClient.prototype.modifyAccess = function (accessOptions) {
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
                    var self = this;
                    var accessRightString = [];
                    for (var i = 0, ilength = accessOptions.accessRights.length; i < ilength; i++) {
                        accessRightString.push(Common.Helper.encodeValue(accessOptions.accessRights[i]) + " ");
                    }
                    var request = ["<request i:type='b:ModifyAccessRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
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
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        var responseText = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
                        var result = Common.Helper.crmXmlDecode(responseText);
                        return result;
                    });
                };
                /**
                 * revokeAccess :
                 * Sends $http request to do a revokeAccess request.
                 * The method modifies the AccessRights of the given record for a specified security principal (user or team)
                 * NOTE: Read the CRM SDK documentation for more information on the GrantAccessRequest.
                 * Tested : Success
                 */
                SoapClient.prototype.revokeAccess = function (accessOptions) {
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
                    var self = this;
                    var request = ["<request i:type='b:RevokeAccessRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
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
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        var responseText = self.__selectSingleNodeText(rslt, "//ser:ExecuteResult");
                        var result = Common.Helper.crmXmlDecode(responseText);
                        return result;
                    });
                };
                /**
                 * retrievePrincipalAccess :
                 * Sends $http request to do a retrievePrincipalAccess request.
                 * The method retrieves the access rights of a specified security principal (user or team)
                 * to the specified record.
                 * Tested : Success
                 */
                SoapClient.prototype.retrievePrincipalAccess = function (accessOptions) {
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
                    var self = this;
                    var request = ["<request i:type='b:RetrievePrincipalAccessRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
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
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        var result = self.__selectSingleNodeText(rslt, "//b:value");
                        return result.split(' ');
                    });
                };
                /*
                 * addMemberTeamRequest :
                 * Request to add a member to an existing team
                 * Tested : Success
                 */
                SoapClient.prototype.addMemberTeamRequest = function (teamId, memberId) {
                    var self = this;
                    var request = [
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
                        .then(function (rslt) {
                        return rslt;
                    });
                };
                /*
                 * removeMemberTeamRequest :
                 * Request to add a member to an existing team
                 * Tested : Success
                 */
                SoapClient.prototype.removeMemberTeamRequest = function (teamId, memberId) {
                    var self = this;
                    var request = [
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
                        .then(function (rslt) {
                        return rslt;
                    });
                };
                /**
                * retrieveAllEntitiesMetadata :
                * Request to retrieve all entities metadata in the system
                * Tested : Success
                */
                SoapClient.prototype.retrieveAllEntitiesMetadata = function (entityFilters, retrieveIfPublished) {
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
                    var self = this;
                    var result = [];
                    var entityFiltersString = "";
                    for (var iii = 0, templength = entityFilters.length; iii < templength; iii++) {
                        entityFiltersString += Common.Helper.encodeValue(entityFilters[iii]) + " ";
                    }
                    var request = [
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
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        var response = self.__selectNodes(rslt, "//c:EntityMetadata");
                        for (var i = 0, ilength = response.length; i < ilength; i++) {
                            var a = self.__objectifyNode(response[i]);
                            a._type = "EntityMetadata";
                            result.push(a);
                        }
                        return result;
                    });
                };
                /**
                 * retrieveEntityMetadata :
                 * Sends an $http RetreiveEntityMetadata Request to retrieve a particular entity metadata in the system.
                 * Tested : Success
                 */
                SoapClient.prototype.retrieveEntityMetadata = function (entityFilters, logicalName, retrieveIfPublished) {
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
                    var self = this;
                    var entityFiltersString = [];
                    for (var iii = 0, templength = entityFilters.length; iii < templength; iii++) {
                        entityFiltersString.push(Common.Helper.encodeValue(entityFilters[iii]) + " ");
                    }
                    var request = [
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
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        var response = self.__selectNodes(rslt, "//b:value");
                        var results = [];
                        for (var i = 0, ilength = response.length; i < ilength; i++) {
                            var a = self.__objectifyNode(response[i]);
                            a._type = "EntityMetadata";
                            results.push(a);
                        }
                        return results;
                    });
                };
                /**
                 * retrieveAttributeMetadata :
                 * Sends an $http RetrieveAttributeMetadata Request to retrieve a particular entity's attribute metadata in the system
                 * Tested : Untested
                 */
                SoapClient.prototype.retrieveAttributeMetadata = function (entityLogicalName, attributeLogicalName, retrieveIfPublished) {
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
                    var self = this;
                    var request = [
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
                    return self._doRequest(request, "Execute").then(function (rslt) {
                        var response = self.__selectNodes(rslt, "//b:value");
                        var results = [];
                        for (var i = 0, ilength = response.length; i < ilength; i++) {
                            var a = self.__objectifyNode(response[i]);
                            results.push(a);
                        }
                        return results;
                    });
                };
                SoapClient.SoapClientFactory = function ($http) {
                    return new SoapClient($http);
                };
                SoapClient.id = "ngXrm.XrmServiceToolkit.Soap.SoapClient";
                SoapClient.$inject = ["$http"];
                return SoapClient;
            })();
            Soap.SoapClient = SoapClient;
        })(Soap = XrmServiceToolkit.Soap || (XrmServiceToolkit.Soap = {}));
    })(XrmServiceToolkit = ngXrm.XrmServiceToolkit || (ngXrm.XrmServiceToolkit = {}));
})(ngXrm || (ngXrm = {}));
/**
* ngXrm.XrmServiceToolkit.Rest based on XrmServiceToolkit.Rest
* NOTE:
*		The rest endpoint uses the entity and attribute schema names and they are case sensitive.
*/
var ngXrm;
(function (ngXrm) {
    var XrmServiceToolkit;
    (function (XrmServiceToolkit) {
        var Rest;
        (function (Rest) {
            var Common = ngXrm.XrmServiceToolkit.Common;
            var CommonRest = ngXrm.XrmServiceToolkit.Common.Rest;
            var RestClient = (function () {
                function RestClient($http) {
                    this.$http = $http;
                }
                RestClient.prototype.__getODataPath = function (xrmContext) {
                    var self = this;
                    return [xrmContext.getClientUrl(), "/XRMServices/2011/OrganizationData.svc/"].join("");
                };
                RestClient.prototype.__parameterCheckBoolean = function (parameter, message) {
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
                };
                RestClient.prototype.__parameterCheckRequired = function (parameter, message) {
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
                };
                RestClient.prototype.__parameterCheckString = function (parameter, message) {
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
                };
                RestClient.prototype._restGet = function (getConfig) {
                    var self = this;
                    var httpConfig = {
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
                        .then(function (rslt) {
                        var result = null;
                        if (rslt.status === 200)
                            result = rslt.data.d;
                        return result;
                    })
                        .catch(function (error) {
                        return Q.reject(error);
                    });
                };
                RestClient.prototype._restPost = function (postConfig) {
                    var self = this;
                    var httpConfig = {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8'
                        }
                    };
                    //Overwrite httpConfig if provided
                    if (postConfig.httpConfig != null)
                        httpConfig = postConfig.httpConfig;
                    return self.$http.post(postConfig.requestUrl, postConfig.object != null ? JSON.stringify(postConfig.object) : null, httpConfig)
                        .then(function (rslt) {
                        var result = null;
                        //200 = OK
                        //201 = Created
                        //204 = No Content (MERGE/DELETE)
                        if (rslt.status === 200 || rslt.status === 201)
                            result = rslt.data.d;
                        else if (rslt.status === 204)
                            result = "Ok";
                        return result;
                    })
                        .catch(function (error) {
                        return Q.reject(error);
                    });
                };
                /**
                 * createRecord :
                 * Sends $http request to create a new record.
                 * Tested : Success
                 */
                RestClient.prototype.createRecord = function (type, object) {
                    var self = this;
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
                    var requestUrl = [self.__getODataPath(Common.Helper.xrmContext()), type, "Set"].join("");
                    return self._restPost(new CommonRest.RestPost({ requestUrl: requestUrl, object: object })).then(function (rslt) {
                        var result = rslt;
                        return result;
                    });
                };
                /**
                 * retrieveRecord :
                 * Sends $http request to retrieve a record.
                 * Tested : Success
                 */
                RestClient.prototype.retrieveRecord = function (id, type, select, expand) {
                    var self = this;
                    try {
                        ///<param name="id" type="String">
                        /// A String representing the GUID value for the record to retrieve.
                        ///</param>
                        self.__parameterCheckString(id, "ngXrm.XrmServiceToolkit.Rest.RestClient.retrieveRecord requires the id parameter is a string.");
                        ///<param name="type" type="string">
                        /// A String representing the name of the entity
                        ///</param>
                        self.__parameterCheckString(type, "ngXrm.XrmServiceToolkit.Rest.RestClient.retrieveRecord requires the type parameter is a string.");
                    }
                    catch (error) {
                        return Q.reject(error);
                    }
                    var systemQueryOptions = "";
                    var expandMax = [];
                    //Max amount of expand entities is 6.
                    if (expand != null) {
                        for (var i = 0; i < expand.length; i++) {
                            expandMax.push(expand[i]);
                            if (i == 5)
                                break;
                        }
                    }
                    if (select != null || expand != null) {
                        systemQueryOptions = "?";
                        if (select != null) {
                            var selectString = ["$select=", select.join(",")].join("");
                            if (expandMax.length > 0) {
                                selectString = [selectString, expandMax.join(",")].join(",");
                            }
                            systemQueryOptions = [systemQueryOptions, selectString].join("");
                        }
                        if (expandMax.length > 0) {
                            systemQueryOptions = [systemQueryOptions, "&$expand=", expandMax.join(",")].join("");
                        }
                    }
                    var requestUrl = [self.__getODataPath(Common.Helper.xrmContext()), type, "Set(guid'", id, "')", systemQueryOptions].join("");
                    return self._restGet(new CommonRest.RestGet({ requestUrl: requestUrl })).then(function (rslt) {
                        var result = rslt;
                        return result;
                    });
                };
                /**
                 * updateRecord :
                 * Sends $http request to update a record.
                 * Tested : Success
                 */
                RestClient.prototype.updateRecord = function (id, type, object) {
                    var self = this;
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
                    var requestUrl = [self.__getODataPath(Common.Helper.xrmContext()), type, "Set(guid'", id, "')"].join("");
                    var httpConfig = {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8',
                            'X-HTTP-Method': 'MERGE'
                        }
                    };
                    return self._restPost(new CommonRest.RestPost({ requestUrl: requestUrl, object: object, httpConfig: httpConfig })).then(function (rslt) {
                        var result = rslt;
                        return result;
                    });
                };
                /**
                 * deleteRecord :
                 * Sends $http request to delete a record.
                 * Tested : Success
                 */
                RestClient.prototype.deleteRecord = function (id, type) {
                    var self = this;
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
                    var requestUrl = [self.__getODataPath(Common.Helper.xrmContext()), type, "Set(guid'", id, "')"].join("");
                    var httpConfig = {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8',
                            'X-HTTP-Method': 'DELETE'
                        }
                    };
                    return self._restPost(new CommonRest.RestPost({ requestUrl: requestUrl, httpConfig: httpConfig })).then(function (rslt) {
                        var result = rslt;
                        return result;
                    });
                };
                RestClient.prototype._doRetrieveMultipleRecords = function (type, options) {
                    if (options === void 0) { options = null; }
                    var self = this;
                    var optionsString = '';
                    if (options != null) {
                        if (options.charAt(0) !== "?") {
                            optionsString = ["?", options].join("");
                        }
                        else {
                            optionsString = options;
                        }
                    }
                    var requestUrl = [self.__getODataPath(Common.Helper.xrmContext()), type, "Set", optionsString].join("");
                    return self._restGet(new CommonRest.RestGet({ requestUrl: requestUrl }))
                        .then(function (rslt) {
                        return rslt;
                    })
                        .catch(function (error) {
                        return Q.reject(error);
                    });
                };
                /*
                 * retrieveMultipleRecords :
                 * Sends $http request to retrieve records.
                 * Tested : Success
                 */
                RestClient.prototype.retrieveMultipleRecords = function (type, options) {
                    if (options === void 0) { options = null; }
                    var self = this;
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
                    var defer = Q.defer();
                    var resultArray = [];
                    var recursiveFn = function (rslt) {
                        //TODO: test rslt when no records found
                        if (rslt != null) {
                            resultArray.push.apply(resultArray, rslt.results);
                            if (rslt.__next != null) {
                                var queryOptions = rslt.__next.substring([self.__getODataPath(Common.Helper.xrmContext()), type, "Set"].join("").length);
                                self._doRetrieveMultipleRecords(type, queryOptions)
                                    .then(recursiveFn)
                                    .catch(function (error) {
                                    return defer.reject(error);
                                });
                            }
                            else
                                defer.resolve(resultArray);
                        }
                    };
                    self._doRetrieveMultipleRecords(type, options)
                        .then(recursiveFn)
                        .catch(function (error) {
                        return defer.reject(error);
                    });
                    return defer.promise;
                };
                /*
                 * associateRecord :
                 * Sends $http request to associate a record.
                 * Tested : Success
                 */
                RestClient.prototype.associateRecord = function (entityid1, odataSetName1, entityid2, odataSetName2, relationship) {
                    var self = this;
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
                    var entityReference = {};
                    entityReference.uri = [self.__getODataPath(Common.Helper.xrmContext()), odataSetName2, "Set(guid'", entityid2, "')"].join("");
                    var requestUrl = [self.__getODataPath(Common.Helper.xrmContext()), odataSetName1, "Set(guid'", entityid1, "')/$links/", relationship].join("");
                    return self._restPost(new CommonRest.RestPost({ requestUrl: requestUrl, object: entityReference })).then(function (rslt) {
                        var result = rslt != null && rslt.data != null ? rslt.data.d : null;
                        return result;
                    });
                };
                /*
                 * disassociateRecord :
                 * Sends $http request to disassociate a record.
                 * Tested : Success
                 */
                RestClient.prototype.disassociateRecord = function (entityid1, odataSetName, entityid2, relationship) {
                    var self = this;
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
                    var requestUrl = [self.__getODataPath(Common.Helper.xrmContext()), odataSetName, "Set(guid'", entityid1, "')/$links/", relationship, "(guid'", entityid2, "')"].join("");
                    var httpConfig = {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8',
                            'X-HTTP-Method': 'DELETE'
                        }
                    };
                    return self._restPost(new CommonRest.RestPost({ requestUrl: requestUrl, httpConfig: httpConfig })).then(function (rslt) {
                        var result = rslt != null && rslt.data != null ? rslt.data.d : null;
                        return result;
                    });
                };
                RestClient.RestClientFactory = function ($http) {
                    return new RestClient($http);
                };
                RestClient.id = "ngXrm.XrmServiceToolkit.Rest.RestClient";
                RestClient.$inject = ["$http"];
                return RestClient;
            })();
            Rest.RestClient = RestClient;
        })(Rest = XrmServiceToolkit.Rest || (XrmServiceToolkit.Rest = {}));
    })(XrmServiceToolkit = ngXrm.XrmServiceToolkit || (ngXrm.XrmServiceToolkit = {}));
})(ngXrm || (ngXrm = {}));
angular.module('ngXrm', [])
    .factory("ngXrmServiceToolkitSoap", ['$http', ngXrm.XrmServiceToolkit.Soap.SoapClient.SoapClientFactory])
    .factory("ngXrmServiceToolkitRest", ['$http', ngXrm.XrmServiceToolkit.Rest.RestClient.RestClientFactory]);
//# sourceMappingURL=ngXrmServiceToolkit.js.map