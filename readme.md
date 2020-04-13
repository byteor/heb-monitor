# HEB Carbside Monitor

## API:

### Get all stores

[/stores]()

URL Parameters:
* zip
* radius (miles)

### Get only stores with open slots

[/slots]()

URL Parameters:
* zip
* radius (miles)
* email (urlencoded)

### Start a monitor

[/start]()

URL Parameters:
* zip
* radius (miles)
* email (urlencoded)

Example:

[/start?zip=12345-6789&radius=5&email=foo%40example.com]()

starts a monitor that is looking for open slots for stores sin  for 12345-6789 ZIP code

### List active monitors
[/monitors]()

## Environment setup

`.env` file:

```bash
MAILJET_API_KEY=???
MAILJET_API_SECRET=???
MAILJET_FROM=foo@example.com
TWILIO_API_PHONE_FROM=+1 737 555 5555
TWILIO_API_PHONES_TO=+1 512 555 5555
TWILIO_API_SID=???
TWILIO_API_TOKEN=???
DEFAULT_ZIP=78717-5409
DEFAULT_RADIUS=6
```

* TWILIO is not being used at this time
* MAILJET setup can be skipped if no email is required
* ZIP & RADIUS can be skipped if always set in the URL

## Run

`npm install`

`node index.js`
