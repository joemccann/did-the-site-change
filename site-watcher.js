"use strict"

const request = require('request')
	,	cfg = require('./config')
	,	cronJob = require('cron').CronJob
	,	checksum = require('checksum')
	, twilio = require('./twilio/twilio-notification')


// Create data structure containing site objects to monitor
let sites = []

// Populate said data structure; we need an URL and a checksum
cfg.sitesToMonitor.split(" ").forEach(function(element){
	sites.push({url: element, checksum: ''})
}) 

// Cycle through all sites and watch them; called by Cron Job. 
function batchWatch(){
	sites.forEach(function(element){
		siteWatcher(element)
	})
}

// Watch the site for changes...
function siteWatcher(siteObject){

	let twilioMessages = {
		"BAD_RESPONSE_CODE": `The site, ${siteObject.url}, has an error code of {code} and may have changed or is down.`,
		"SITE_HAS_CHANGED": `The site, ${siteObject.url}, has changed!`
	}

	// Check to see if there is a seed checksum
	if(!siteObject.checksumString){

		// Create the first checksum and return
		return request(siteObject.url, function initialRequestCallback(error, response, body){

			// TODO: DO SOMETHING MEANINGFUL WITH THE ERROR
			if(error){return console.error(error)}
			else {
				if(response.statusCode > 399){
					return twilio.sendSMSNotification(twilioMessages.BAD_RESPONSE_CODE
												.replace('{code}', response.statusCode))
				}
				else{
					console.log(`Seeding checksum for ${siteObject.url}.`)
					return siteObject.checksumString = checksum(body) 
				} // end else

			} // end else

		}) // end request

	}
	else{
		// Compare current checksum with latest request body 
		return request(siteObject.url, function recurringRequestCallback(error, response, body){

			// TODO: DO SOMETHING MEANINGFUL WITH THE ERROR
			if(error){return console.error(error)}
			// Do the comparison
			else{
				
				let currentCheckSum = checksum(body)
				
				if(siteObject.checksumString != currentCheckSum){
					// They are not the same so send notification 
					console.log(`Site ${siteObject.url} is not the same.`)
					
					// Update checkSumString's value
					siteObject.checksumString = currentCheckSum

					// Send the SMS to administrators
					return twilio.sendSMSNotification(twilioMessages.SITE_HAS_CHANGED)
				}
				else console.log(`Site ${siteObject.url} is still the same.`)
	  	} // end else
		
		}) // end request
	
	} // end else

} // end siteWatcher

// Start the job to check every 10 seconds
var job = new cronJob('*/10 * * * * *', batchWatch, function endCronJob(){
    console.log('cronJob ended')
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);


job.start()