const {google} = require('googleapis');
const keydocs = require('./Keys-docs.json');
const client = new google.auth.JWT(
  keydocs.client_email,
  null,
  keydocs.private_key,
  ['https://www.googleapis.com/auth/documents','https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file']

);

client.authorize(function(err,tokens){

  if(err){
    console.log(err);
    return
  } else {
    console.log('connected');
    gdruncopy(client)
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
// Update data in google doc
async function gdrun(cl){
  const gdapi = await google.docs({version:'v1', auth: cl })
  const opt ={
      documentId: '1a4wZnQA-g3TsNJEcTzo3zO3zPZWH8DRv1ZlxpGUem4Q',
      resource: {
        requests,
      },
  };

let data = await gdapi.documents.batchUpdate(opt)
console.log(data)
}


//Copy google doc
async function gdruncopy(cl){
  const gdriveapi = await google.drive({version:'v3', auth: cl })

  var copyTitle = "NewCP";
  let newrequest = {
    name: copyTitle,
  };
  let copyFile = await gdriveapi.files.copy({
    fileId: '1a4wZnQA-g3TsNJEcTzo3zO3zPZWH8DRv1ZlxpGUem4Q',
    resource: newrequest,
  }, (err, driveResponse) => {
    let documentCopyId = driveResponse.data.id;
    console.log(documentCopyId)
  });


}


