const https = require('https');

exports.handler = async function(event) {
  if(event.httpMethod !== 'POST'){
    return {statusCode:405, body:'Method not allowed'};
  }
  const {name, email} = JSON.parse(event.body);
  const data = JSON.stringify({
    email: email,
    attributes: {FIRSTNAME: name},
    listIds: [3],
    updateEnabled: true
  });
  const options = {
    hostname: 'api.brevo.com',
    path: '/v3/contacts',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    }
  };
  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          body: JSON.stringify({success: true})
        });
      });
    });
    req.on('error', (e) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({success: false, error: e.message})
      });
    });
    req.write(data);
    req.end();
  });
};
