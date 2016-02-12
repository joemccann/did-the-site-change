# Did The Site Change?

This app notifies a group of administrators via SMS if a site has changed.  

This app uses a [SHA1 checksum](https://en.wikipedia.org/wiki/SHA-1) to determine if the site has changed.


# Installation

Install everything

`npm install`

Add your [Twilio](https://twilio.com) configuration details in `.env.RENAME_ME` and then rename it to `.env`

`mv .env.RENAME_ME .env`

In the `.env` file, add a single URL or multiple URLs, separated by a single space (space delimited) to the `SITES_TO_MONITOR` variable of the sites you want to watch for changes.

Next, run the website watcher script (need something like upstart or systemd to monitor it)

`node site-watcher`

