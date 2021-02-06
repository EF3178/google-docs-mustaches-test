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
    gdrun(client)
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



/*
google.options({auth: auth});
google
    .discoverAPI(
        'https://docs.googleapis.com/$discovery/rest?version=v1&key={YOUR_API_KEY}')
    .then(function(docs) {
      docs.documents.batchUpdate(
          {
            documentId: '1yBx6HSnu_gbV2sk1nChJOFo_g3AizBhr-PpkyKAwcTg',
            resource: {
              requests,
            },
          },
          (err, {data}) => {
            if (err) return console.log('The API returned an error: ' + err);
            console.log(data);
          });
    });
*/
