exports.handler = async function(event) {
  if(event.httpMethod === 'OPTIONS'){
    return {
      statusCode:200,
      headers:{
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers':'Content-Type',
        'Access-Control-Allow-Methods':'POST'
      },
      body:''
    };
  }

  if(event.httpMethod !== 'POST'){
    return {statusCode:405, body:'Method not allowed'};
  }

  try{
    const {name, email} = JSON.parse(event.body);
    
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        attributes: {FIRSTNAME: name},
        listIds: [3],
        updateEnabled: true
      })
    });

    const result = await response.json();
    
    return {
      statusCode: 200,
      headers:{'Access-Control-Allow-Origin':'*'},
      body: JSON.stringify({success: true, result})
    };

  }catch(err){
    return {
      statusCode: 500,
      headers:{'Access-Control-Allow-Origin':'*'},
      body: JSON.stringify({success: false, error: err.message})
    };
  }
};
