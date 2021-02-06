const {google} = require('googleapis');
const keydocs = require('./Keys-docs.json');
const fs = require('fs');

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
   // const runAllAPIs = async function(){
   // const copiedFile = await gdruncopy(client);
    //const updatedFile = await gdrunupdate(client, copiedFile);
    gdrunexport(client);
    //}
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


//Copy google doc
async function gdruncopy(cl, newFileId){
  const gdriveapi = await google.drive({version:'v3', auth: cl })

  var copyTitle = "NewCP";
  let newrequest = {
    name: copyTitle,
  };
  let copyFile = await gdriveapi.files.copy({
    fileId: newFileId,
    resource: newrequest,
  }, (err, driveResponse) => {
    let documentCopyId = driveResponse.data.id;
    console.log(documentCopyId);
    return documentCopyId
  });
};

// Update data in google doc
async function gdrunupdate(cl){
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

//Export new file as pdf
async function gdrunexport(cl){
  const gdriveapi = await google.drive({version:'v3', auth: cl })
 
  var fileId = '1a4wZnQA-g3TsNJEcTzo3zO3zPZWH8DRv1ZlxpGUem4Q';
  var dest = fs.createWriteStream('./resume.pdf');
 
  const exportedFile = await gdriveapi.files.export({
    fileId: fileId,
    mimeType: 'application/pdf'
    },
    {responseType: 'stream'});
    console.log(exportedFile);

    await new Promise((resolve, reject) => {
      exportedFile.data
        .on('error', reject)
        .pipe(dest)
        .on('error', reject)
        .on('finish', resolve);
    });
 
};


