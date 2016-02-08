"use strict"

const config = require('../config')
  , client = require('twilio')(config.accountSid, config.authToken)
  

// Callback function for SMS send.
function sendSMSCallback(err,data){

  if(err){
    console.error('Could not notify administrator.')
    console.error(err)
  } else {
    console.log('Administrator notified.')
  }

}

module.exports.sendSMS = function(to, message){
  client.messages.create({
    body: message,
    to: to,
    from: config.sendingNumber
//  mediaUrl: imageUrl
  }, sendSMSCallback)
}