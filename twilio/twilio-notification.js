"use strict"

const twilioClient = require('./twilio-client')
	, fs = require('fs')
	, admins = require('../config/administrators.json')

function formatMessage(message){return 'ALERT! ' + message}

module.exports.sendSMSNotification = function(message){admins.forEach(function(admin){twilioClient.sendSMS(admin.phoneNumber, formatMessage(message))})}
