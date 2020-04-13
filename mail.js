const mailjet = require('node-mailjet')
.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);
  //.connect('c05d38edf03976e75832e2440bd98f33', '9143a96d459dfd999808d051ce9f6c11')

const sendMail = (stores, to) => {
  const request = mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
      "Messages": [
        {
          "From": {
            "Email": process.env.MAILJET_FROM,
            "Name": "Andrey"
          },
          "To": [
            {
              "Email": to || "sagegeek@gmail.com",
              "Name": "Andrey"
            }
          ],
          "Subject": "Open time slots on {{var:date}}",
          "TextPart": "Hey, some open slots here",
          "TemplateLanguage": true,
          "HTMLPart": "<h2>{{var:date}}</h2>" +
            "{% for store in var:stores %}" +
            "<h3>{{store.name}}</h3>" +
            "<i><b>{{store.city}}</b> {{store.address}}</i>" +
            " <ul>" +
            "{% for slot in store.dates %}" +
            " <li>{{slot}}</li>" +
            "{% endfor %}" +
            " </ul>" +
            "{% endfor %}"
          ,
          "CustomID": "heb-" + (new Date()).getTime(),
          "Variables": {
            "stores": stores,
            "date": (new Date()).toLocaleString(),
          }
        }
      ]
    })
  request
    .then((result) => {
      console.log(result.body)
    })
    .catch((err) => {
      console.log(err.statusCode)
    })

};

module.exports = {
  sendMail
};