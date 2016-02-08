# Did The Site Change?

This app notifies a group of administrators via SMS if a site has changed.  

This app uses a [SHA1 checksum](https://en.wikipedia.org/wiki/SHA-1) to determine if the site has changed.


# Installation

Install everything

`npm install`

Add your [Twilio](https://twilio.com) configuration details in `.env.RENAME_ME` and then rename it to `.env`

`mv .env.RENAME_ME .env`

Next, run the Website Watcher script (need something like upstart or systemd to monitor it)

`node site-watcher`

