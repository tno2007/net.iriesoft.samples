import groupArray from "group-array";

// var declaration
var documentsRequired;

// get businessUnits data
var buData = ajax.get("/api/GroupLogin/Documents/BusinessUnitsGet");


// loop bu's
buData.foreach(bu => {

	// initialize documentsRequired object based on each bu
	documentsRequired.push({
		guid: bu.CorporateServiceID,
		displayName: bu.BusinessUnitDisplayName,
		documents: [],
		documentGroup: null,
		documentsCount: 0,
		documentsOutstanding: 0,
		documentspercent: 0,
		documentsbg: "",
		buexpanded: false
	});


});


// get meta from ajax
var metaData = ajax.get("/metadata");

// loop thru metadata
metaData.foreach(r => {

	// update documentStatusId number with an object
	r.DocumentStatusId = getStatusDetails(r.DocumentStatusId);
	
	// match bu id and docsRequired bu id
	var docRequired = documentRequired.find(x => x.guid === r.CorporateServiceId);
	
	// if this r, has a DocumentName
	if (!r.DocumentName) continue;
	
	// check if docRequired has zero documents
	if (docRequired.documents.length === 0) {
	
		// push a document in docRequired documents
		docRequired.documents.push({		
			displayName: "",
			persons: [
				{
					displayName: "",
					documents: [],
					personExpanded: true
				}
			],
			productExpanded: true
			
		});
		
	}
	
	var doc = docRequired.documents.find(x => x.displayname === r.Reference);
	
	if (doc) {
		// ...
		var person = doc.persons.find(p => p.displayname === r.Persons;
		
		if (person){
			// ...
			person.documents.push(r);			
		}
		else {
			// ...
			doc.persons.push({
				displayname: r.Persons,
				documents: [r],
				personExpanded: false
			})
		}		
	}
	else {
		// ...
		docRequired.documents.push({
			displayname: Reference,
			persons: [
				{
				displayname: Persons,
				documents: [r],
				personExpanded: false
				}
			],
			productExpanded: false
		})
	}
	
	// ...
	docRequired.documentsCount += 1;
	
	if ([100000000, 100000003].indexOf(r.DocumentStatusId.id) !== -1){
		docRequired.documentsOutstanding += 1;
	}
	
	docRequired.documentsbg = "bg-success";
	
	let percent = Math.round(
                          ((docRequired.documentsCount -
                            docRequired.documentsOutstanding) /
                            docRequired.documentsCount) *
                            100
                        );
	
	docRequired.documentspercent = percent;
	
	if ((percent) === 0) {
		
		docRequired.documentspercent = 10;
		docRequired.documentsbg = "bg-danger";
	}
	
	
});


