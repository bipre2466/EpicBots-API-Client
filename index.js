const EpicBots = require('epicbots-prevnames');
const config = require('./config.js');
const USER_ID = config.user
EpicBots.prevnames(USER_ID)
  .then(data => {
    console.log("EpicBots API Request Client By MrCat !")
    console.log("Result of your search :")
    console.log(data);
  })
  .catch(error => {
    console.error(error)
  });