"use strict"

const request = require('request')
	,	cfg = require('./config')
	,	cronJob = require('cron').CronJob
	,	checksum = require('checksum')
	, twilio = require('./twilio/twilio-notification')
	, twilioMessages = {
		"BAD_RESPONSE_CODE": `The site, ${cfg.siteToMonitor}, has an error code of {code} and may have changed or is down.`,
		"SITE_HAS_CHANGED": `The site, ${cfg.siteToMonitor}, has changed!`
	}

let checksumString = ''	

// Watch the site for changes...
function siteWatcher(){

	// Check to see if there is a seed checksum
	if(!checksumString){
		// Create the first checksum and return
		return request(cfg.siteToMonitor, function initialRequestCallback(error, response, body){
			// TODO: DO SOMETHING MEANINGFUL WITH THE ERROR
			if(error){return console.error(error)}
			else {
				if(response.statusCode > 399){
					return twilio.sendSMSNotification(twilioMessages.BAD_RESPONSE_CODE.replace('{code}', response.statusCode))
				}
				else{
					return checksumString = checksum(body) 
				} // end else
			} // end else
		}) // end request

	}
	else{
		// Compare current checksum with latest request body 
		return request(cfg.siteToMonitor, function recurringRequestCallback(error, response, body){

			// TODO: DO SOMETHING MEANINGFUL WITH THE ERROR
			if(error){return console.error(error)}
			// Do the comparison
			else{
				var currentCheckSum = checksum(body)
				if(checksumString != currentCheckSum){
					// They are not the same so send notification 
					console.log('Sites are not the same.')
					
					// Update checkSumString's value
					checksumString = currentCheckSum

					// Send the SMS to administrators
					return twilio.sendSMSNotification(twilioMessages.SITE_HAS_CHANGED)
				}
	  	} // end else
		}) // end request
	} // end else

} // end siteWatcher

// Start the job to check every 5 seconds
var job = new cronJob('*/5 * * * * *', siteWatcher, function endCronJob(){
    console.log('cronJob ended')
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);

job.start()