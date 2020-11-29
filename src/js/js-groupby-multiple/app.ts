import groupArray from "group-array";
import JSONFormatter from "json-formatter-js";

import { joebloggs, leanne, arr, sortingProperties } from "./sample";

const results: any = groupArray(
  joebloggs,
  "CorporateServiceId",
  "Reference",
  "Persons"
);

const services = results;
const groupDocumentsMetaData = results;

//console.log(results);

// we use forEach instead of map, because we want to count up the number of documents.
// forEach makes it possible to run logic on every iteration

// summary variables
let serviceId: string;
let products: any[];
let productName: string;
let applicants: any[];
let applicantName: string;
let documents: any[];
let documentEntry: any;
let documentsOutstanding: number;
let documentsPercent: number;

Object.keys(services).forEach((serviceKey, serviceKeyIndex) => {
  // initialize loop variables
  serviceId = "";
  products = [];
  productName = "";
  applicants = [];
  applicantName = "";
  documents = [];
  documentEntry = null;
  documentsOutstanding = 0;
  documentsPercent = 0;

  serviceId = serviceKey;
  products = services[serviceKey];

  Object.keys(products).forEach((productKey: any) => {
    productName = productKey;
    applicants = products[productKey];

    Object.keys(applicants).forEach((applicantKey: any) => {
      applicantName = applicantKey;
      documents = applicants[applicantKey];

      Object.keys(documents).forEach((documentKey: any) => {
        documentEntry = documents[documentKey];

        // if the current document has a certain status...
        // - Needed: 100000000
        // - Rejected: 100000003
        // it counts as an outstanding document. so add
        documentsOutstanding +=
          [100000000, 100000003].indexOf(documentEntry.DocumentStatusId) !== -1
            ? 1
            : 0;
      }); // documents loop - end
    }); // applicants loop - end
  }); // products loop - end

  console.log({
    serviceId: serviceId,
    documentsCount: documents.length,
    documentsOutstanding: documentsOutstanding,
    documentsPercent: Math.round(
      ((documents.length - documentsOutstanding) / documents.length) * 100
    ),
  });
}); // services loop - end

const listing = Object.keys(groupDocumentsMetaData).map(
  //(e) => (console.log(`key=${e}`), console.log(`value=${results[e]}`))
  (serviceKey) => ({
    serviceId: serviceKey,
    authorised: null,
    documentsCount: null,
    documentsOutstanding: null,
    documentspercent: null,
    products: Object.keys(groupDocumentsMetaData[serviceKey]).map(
      (productKey) => ({
        productName: productKey,
        applicants: Object.keys(
          groupDocumentsMetaData[serviceKey][productKey]
        ).map((applicantKey) => ({
          applicantName: applicantKey,
          documents:
            groupDocumentsMetaData[serviceKey][productKey][applicantKey],
        })),
      })
    ),
  })
);

//console.log("listing", listing);

/*
const dashboardDetails = results.map(
  (el) =>
    ({
      Id: el.Id,
      IsClient: el.IsClient,
      BusinessUnit: el.BusinessUnit,
      CorpServiceGuid: el.CorpServiceGuid,
      EntityId: el.EntityId,
      Data1: el.Data1,
      Data1Header: el.Data1Header,
      Data2: el.Data2,
      Data2Header: el.Data2Header,
      Data3: el.Data2,
      Data3Header: el.Data2Header,
      Data4: el.Data4,
      Data4Header: el.Data4Header,
      NoServData: el.NoServData,
      // additional settings...
      FollowUrl: el.FollowUrl,
      Active: el.Active,
      FriendlyName: el.FriendlyName,
      LandingPageUrl: el.LandingPageUrl,
      LandingTarget: el.LandingTarget,
    } as IDashboardDetail)
);
*/

const app = document.getElementById("app");

const formatter = new JSONFormatter(listing);

if (app) {
  // const formatter = new JSONFormatter(results);
  // document.body.appendChild(formatter.render());
  //app.innerHTML = JSON.stringify(results, null, 2);
  app.appendChild(formatter.render());

  var textArea = document.createElement("textarea");
  textArea.cols = 80;
  textArea.rows = 40;
  textArea.innerText = JSON.stringify(results, null, 2);
  app.appendChild(textArea);
}
