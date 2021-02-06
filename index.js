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
    gdrunupdate(cl, documentCopyId);
  });
};

// Update data in google doc
async function gdrunupdate(cl, copiedFileID){
  const gdapi = await google.docs({version:'v1', auth: cl })
  const opt ={
      documentId: copiedFileID,
      resource: {
        requests,
      },
  };

let data = await gdapi.documents.batchUpdate(opt);
console.log(data.data.documentId);
const updatedID = data.data.documentId;
gdrunexport(cl, updatedID);

};

//Export new file as pdf
async function gdrunexport(cl, updatedFileID){
  const gdriveapi = await google.drive({version:'v3', auth: cl })
 
  var dest = fs.createWriteStream('./resume.pdf');
 
  const exportedFile = await gdriveapi.files.export({
    fileId: updatedFileID,
    mimeType: 'application/pdf'
    },
    {responseType: 'stream'});
  
    const pdfFile = await new Promise((resolve, reject) => {
      exportedFile.data
        .on('error', reject)
        .pipe(dest)
        .on('error', reject)
        .on('finish', resolve);
    });
   
    // Read file and return base64
      fs.readFile('./resume.pdf', function (err, data) {
      if (err) throw err;
      const pdf = data.toString('base64'); //PDF WORKS
//      console.log(pdf);

      //delete google drive file
 //     files().delete(file.getId()).execute();
      // delete pdf file
     fs.unlink(resultat.filename, (err) => {
        if (err) {
                 console.error(err)
                 return
         }});
         return pdf;
       // return Base64
       // res.send({'base64' : pdf})
     });
};


