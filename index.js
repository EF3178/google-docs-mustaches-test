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
    const copiedFile = await gdruncopy(client, templateFile)
   
    }
     catch (error) {
    error.message; // "Oops!"
      }
      }


  }
  });




let NomSouscripteur = 'John';
let ContratID = 'Doe';
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
async function gdruncopy(cl, templateFileId){
  const gdriveapi = await google.drive({version:'v3', auth: cl })

  var copyTitle = "NewCP";
  let newrequest = {
    name: copyTitle,
  };
  let copyFile = await gdriveapi.files.copy({
    fileId: templateFileId,
    resource: newrequest,
  },async (err, driveResponse) => {
    const documentCopyId = await driveResponse.data.id;
    console.log(documentCopyId);

    // Call run update function
    gdrunupdate(cl, documentCopyId);
  });
};

// Update data in google doc
async function gdrunupdate(cl, copiedFileID){
  const gdapi = await google.docs({version:'v1', auth: cl });

  let findTextToReplacementMap ={"ContratID":"Michel","NomSouscripteur":"Blob"};
  var requests = [];
  for (var findText in findTextToReplacementMap) { 
    var replaceText = findTextToReplacementMap[findText];
    findText = "{{"+ findText + "}}"
    console.log(replaceText);
    console.log(findText);
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
let data = await gdapi.documents.batchUpdate(opt);
console.log(data.data.documentId);
const updatedID = data.data.documentId;
gdrunexport(cl, updatedID);

} catch(err) {throw(err)};
};
//Export new file as pdf
async function gdrunexport(cl, updatedFileID){
  const gdriveapi = await google.drive({version:'v3', auth: cl });
  const pdfContentBlob = await gdriveapi.files.export(
   {
    fileId: updatedFileID,  // Please set the file ID of Google Docs.
    mimeType: "application/pdf"
  },
  { responseType: "arraybuffer" },
  (err, res) => {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile("file.pdf", Buffer.from(res.data), function(err) {
        if (err) {
          return console.log(err);
        } else {
          return console.log("success")
        }});
      const pdf = Buffer.from(res.data).toString('base64'); //PDF WORKS
      gdriveapi.files.delete({fileId: updatedFileID});
       // res.send({'base64' : pdf})
 //     console.log(pdf);
    };
        
//      });
    
      }) 

};
