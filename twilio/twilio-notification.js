"use strict"

const twilioClient = require('./twilio-client')
	, fs = require('fs')
	,	admins = require('../config/administrators.json')

function formatMessage(errorToReport) {
  return	'ALERT! It appears the server is' 
  			+	' having issues. Exception: ' + errorToReport
};


module.exports.sendSMSNotification = function(message){
  admins.forEach(function(admin){
		console.log(admin.phoneNumber)
    twilioClient.sendSMS(admin.phoneNumber, formatMessage(message))
  })
}
