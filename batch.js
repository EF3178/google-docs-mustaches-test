const {google} = require('googleapis');
const keydocs = require('./Keys-docs.json');
const fs = require('fs');

const client = new google.auth.JWT(
  keydocs.client_email,
  null,
  keydocs.private_key,
  ['https://www.googleapis.com/auth/documents','https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file']

);


const templateFile = '1a4wZnQA-g3TsNJEcTzo3zO3zPZWH8DRv1ZlxpGUem4Q'
client.authorize(function(err,tokens){

  if(err){
    console.log(err);
    return
  } else {
    console.log('connected');



    run();
    async function run(){
      try {
    const copiedFile = await gdrunupdate(client, templateFile)
   
    }
     catch (error) {
    error.message; // "Oops!"
      }
      }

  }
  });


let findTextToReplacementMap ={"{{ContratID}}":"Michel","{{NomSouscripteur}}":"Blob"};

async function gdrunupdate(cl, copiedFileID){
  const gdapi = await google.docs({version:'v1', auth: cl });

  var requests = [];
  for (var findText in findTextToReplacementMap) {
    console.log(findText);
    var replaceText = findTextToReplacementMap[findText];
    console.log(replaceText);
    var request = {
      replaceAllText: {
        containsText: {
          text: findText,
          matchCase: true,
        },
        replaceText: replaceText
      }
    };
    
    console.log(request);
    requests.push(request);

    console.log(requests);
};
const opt ={
  documentId: copiedFileID,
  resource: {
    requests,
  },
};
try {
var response = await gdapi.documents.batchUpdate(opt);
var replies = response.replies;
console.log(response);
return "success"} catch(err){console.log(err)};
};
/*
async function gdrunupdate(cl, copiedFileID){
    const gdapi = await google.docs({version:'v1', auth: cl })
    const opt ={
        documentId: copiedFileID,
        resource: {
          requests,
        },
    };
  
  let data = await gdapi.documents.batchUpdate(opt);
  console.log(data.data.documentId)}*/