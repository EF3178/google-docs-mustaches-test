const {google} = require('googleapis');
const keydocs = require('./Keys-docs.json');
const fs = require('fs');

const client = new google.auth.JWT(
  keydocs.client_email,
  null,
  keydocs.private_key,
  ['https://www.googleapis.com/auth/documents','https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file']

);
var updateData = {"ContratID":"AQ001675-1891","NomSouscripteur":"Faggion"}
const templateFile = '1a4wZnQA-g3TsNJEcTzo3zO3zPZWH8DRv1ZlxpGUem4Q'

client.authorize(function(err,tokens){

  if(err){
    console.log(err);
    return
  } else {
    console.log('connected');

// Start the functions.
// Method has to be one of the following : "copy", "copy&update","copy&update&export","update&export"


    const runOptions = { 
      cl : client,
      templateID: templateFile,
      targetDirectory:"",
      copyID: "1g7939EgIQBB5sNJ4ZHX0Bk5fn-nkvaaXkHcdnHqGWg4",
      method : "update&return"
    };

    run(runOptions);
        async function run(ropt){
          try {
        const copiedFile = await gdruncopy(ropt)
        }
        catch (error) {
        error.message; // "Oops!"
          }
        }
  }
});

//Copy google doc
async function gdruncopy(copt){
  const gdriveapi = await google.drive({version:'v3', auth: copt.cl })

  // ROute pour copy seul et copy & update et copy&update&return
  if (copt.method.slice(0, 4) == "copy"){
      var copyTitle = "NewCP";
      let newrequest = {
        name: copyTitle,
      };
      let copyFile = await gdriveapi.files.copy({
        fileId: copt.templateID,
        resource: newrequest,
      },async (err, driveResponse) => {
        const documentCopyId = await driveResponse.data.id;
        console.log(documentCopyId);
        // Call run update function
        copt.copyID = documentCopyId;
        gdrunupdate(copt);
      });

    // Route pour update & export  
    } else {
      gdrunupdate(copt)
  }
};

// Update data in google doc
async function gdrunupdate(uopt){
  const gdapi = await google.docs({version:'v1', auth: uopt.cl });

  let findTextToReplacementMap = updateData;
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
      documentId: uopt.copyID,
      resource: {
        requests,
      },
  };
  try {
        let data = await gdapi.documents.batchUpdate(opt);
        console.log("document updated");
        if (uopt.method.substr(uopt.method.length - 6) =="export"){
          gdrunexport(uopt);
        } else {
          return console.log("document "+ uopt.copyID +" updated")
  }
  } catch(err) {throw(err)};
};
//Export new file as pdf
async function gdrunexport(eopt){
  const gdriveapi = await google.drive({version:'v3', auth: eopt.cl });
  const pdfContentBlob = await gdriveapi.files.export(
   {
    fileId: eopt.copyID,  
    mimeType: "application/pdf"
  },
  { responseType: "arraybuffer" },
  (err, res) => {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile("file"+ Math.random()*100 + ".pdf", Buffer.from(res.data), function(err) {
        if (err) {
          return console.log(err);
        } else {
          return console.log("pdf successfully exported")
        }
      });
      // Export as file
      const pdf = Buffer.from(res.data).toString('base64'); //PDF WORKS
      // Delete google copied file
      gdriveapi.files.delete({fileId: updatedFileID});
      
       // res.send({'base64' : pdf})
 //     console.log(pdf);
    };
        
//      });
    
      }) 

};
