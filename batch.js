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

    /*
    gdruncopy(client, templateFile)
    .then(gdrunupdate(client, documentCopyId))
    .then(gdrunexport(client, updatedID)); 
    console.log('all done !');



      run();
    async function run(){
      try {
      console.log('run');
      const copiedFile = await gdruncopy(client, templateFile);
      const updatedFile = await gdrunupdate(client, copiedFile.documentCopyId);
      const returnedFile = await gdrunexport(client, updatedFile.updatedID); 
      }
       catch (error) {
      error.message; // "Oops!"
      }
       }*/
  }
  });




let NomSouscripteur = 'Alice';
let ContratID = 'AQ001675- 1675';
let requests = [
  {
    replaceAllText: {
      containsText: {
        text: '{{NomSouscripteur}}',
        matchCase: true,
      },
      replaceText: NomSouscripteur,
    },
  },
  {
    replaceAllText: {
      containsText: {
        text: '{{ContratID}}',
        matchCase: true,
      },
      replaceText: ContratID,
    },
  },
];
async function gdrunupdate(cl, copiedFileID){
    const gdapi = await google.docs({version:'v1', auth: cl })
    const opt ={
        documentId: copiedFileID,
        resource: {
          requests,
        },
    };
  
  let data = await gdapi.documents.batchUpdate(opt);
  console.log(data.data.documentId)};