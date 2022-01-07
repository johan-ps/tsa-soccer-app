const admin = require('firebase-admin');
const serviceAccount = require('../firebase/service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://TSA-soccer-app.firebaseio.com',
});


module.exports.admin = admin