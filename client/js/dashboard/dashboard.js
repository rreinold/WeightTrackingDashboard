var DEFAULT_ID_COL_WIDTH = "75px";
var DEFAULT_EMAIL_COL_WIDTH = "200px";
var DEFAULT_SUPPORT_URL_COL_WIDTH = "180px";

var WARN_TIME_WINDOW = 14;

actionDueConstants.GRID_KEY = "Action Due In (Days)";

var startupMainDashboard = function() {
	getTagSchemas();
};

// START UI Event

// Upon completing API calls, load the data grid for the first list item
var selectDefaultTag = function(){
	changeTagType();
}

// Get Tag selection and update grid with that type
var changeTagType = function(){
	var selectedSchema = $('#tagTypeSelector').val();
	updateTagGrid(selectedSchema);
};

// END UI Events


// START logic helpers

// Load tag types into dropdown
// Uses the loaded schema for creating new Tag objects
var getTagSchemas = function(refreshTagSchemas){
	if (tagSchemas == null || refreshTagSchemas) {
		fetchTagSchemas(function() {
			$.each(tagSchemas, function (i, item) {
			    $('#tagTypeSelector').append($('<option>', { 
			        value: item.type,
			        text : item.type 
    			}));
			});
			getTags();
			var asc = false;
			fetchTagHistory(asc, processActionsDue);
		});
	}
};


var getTags = function(refreshTags) {
	// if (tags == null || refreshTags){
		fetchTags(selectDefaultTag);
	// }
}

// Fill in grid with Tags from the selected schema
var updateTagGrid = function (selectedSchema){
	for (var i = 0 ; i < tagSchemas.length; i++){
		if (tagSchemas[i].type == selectedSchema){
			selectedSchema = tagSchemas[i];
			break;
		}
	}
	// Create jsGrid, load data and fields into it
	$("#tagGrid").jsGrid({
	    width: "100%",
	    height: "80%",

	    sorting: true,
	    paging: true,
	 	noDataContent: "No tags found.",

	    data: structureTagDataForGrid(selectedSchema),
	 	fields: buildTagDataFields(selectedSchema)
	    
	});

	if(hasAlerts(selectedSchema)){
		// Sort by "Action Due"
		sortByField(actionDueConstants.GRID_KEY, selectedSchema);
	}
	else{
		// You can add alternative sorting here for other schemas
		 sortByField("#tagGrid" , "Location"  )
	}
}

// Action Due in field, which is derived from database data, need to
// be created manually on the client side.
var addActionDueField = function(fields, schema){
		fields.push({ name: actionDueConstants.GRID_KEY, type:"number", width:"110px"});
}

// Deconstruct the JSON schema into individual column fields
var buildTagDataFields = function(schema){
	var fields= [];
	// Manually add ID field
    fields.push({ name: "Id", type: "text", width:DEFAULT_ID_COL_WIDTH});
    // Add "Action Due" field, if applicable
    if(hasAlerts(schema)){
	    addActionDueField(fields, schema);
    }

    // Add Contact Columns
    parseSubSchema(fields, schema.contactschema);
    // Add Detail Columns
    parseSubSchema(fields, schema.detailsschema);
    // Manually add hasAlerts columns
    fields.push({name:"hasAlerts",type: "checkbox", title: "Has Alerts",});
    // Add Alert Schema fields
    parseSubSchema(fields, schema.alertschema);

	return fields;
}

// Deconstruct the JSON database row into a grid row
var structureTagDataForGrid = function(schema){
	// Represents all the data in the grid
	var data = [];
	// Holder for each tag as we iterate
	var tag = {};
	// Loop thru each tag in the Tag Collection
	for (var i = 0 ; i <tags.length; i++) {
		// Current row
		var entry = {};
		
		tag = tags[i].data;
		// If the tag belongs to the selected schema..
		if (tag.type == schema.type){
			// Load the Tag's ID field
			entry.Id=tag.tagid;
			// Load Details, such as Device, Manufacturer, Location, Support URL
			var details = JSON.parse(tag.details);
			var keys = Object.keys(details);
			for (var j=0; j < keys.length; j++){
				entry[keys[j]]= details[keys[j]];
			} 
			// Load contact info, such as name, phone, email
			var contact = JSON.parse(tag.contact);
			var keys = Object.keys(contact);
			for (var j=0; j < keys.length; j++){
				entry[keys[j]]= contact[keys[j]];
			}
			// Load alert fields, such as frequency, daysbefore
			// If applicable
			entry.hasAlerts = tag.alerts;
			if(entry.hasAlerts){
				entry[actionDueConstants.GRID_KEY] = getActionDueValue(tag);
				var alertRules = JSON.parse(tag.alertrules);
				if(entry[actionDueConstants.GRID_KEY] < alertRules.DaysBefore){
					entry.alert = true;
				}
				else if(entry[actionDueConstants.GRID_KEY] < WARN_TIME_WINDOW){
					entry.warn = true;
				}
				else{
					entry.healthy = true;
				}

				var alerts = JSON.parse(tag.alertrules);
				var keys = Object.keys(alerts);
				for (var j=0; j < keys.length; j++){
					entry[keys[j]]= alerts[keys[j]];
				} 
			}
			data.push(entry)
		}
	}
	return data;
}

var processActionsDue = function(tagHistories){
	createMapOfKeysToActionDue(tagHistories);
        // If both have loaded, then load the data grid
        if(tagHistoriesHaveLoaded && tagsHaveLoaded){
        	selectDefaultTag();
        }
}

//END logic helpers


