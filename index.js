const dotenv = require('dotenv').config()
const express = require('express')
const heb = require('./heb')
const monitor = require('./monitor')
const mail = require('./mail');
const app = express()
const port = 3000
const DEFAULT_ZIP = process.env.DEFAULT_ZIP;

const stores = async (req, res) => {

    let zip = req.query.zip || DEFAULT_ZIP;
    let radius = req.query.radius;

    const stores = await heb.getStoresByZip(zip, radius);
    console.log(stores);
    const storeIds = stores.map(store => store.id);
    const result = await heb.getStores(storeIds);
    //mail.sendMail(result);
    res.json(result);
};

const slots = async (req, res) => {

    let zip = req.query.zip || DEFAULT_ZIP;
    let radius = req.query.radius;
    let email = req.query.email;

    const stores = await heb.getStoresByZip(zip, radius);
    console.log(stores);
    const storeIds = stores.map(store => store.id);
    const result = await heb.getStores(storeIds);
    const withSlots = result.filter(store => store.dates.length > 0);
    if(withSlots.length && email) {
        mail.sendMail(withSlots);
    } else console.log("No slots found");
    res.json(withSlots);
};

const start = async (req, res) => {
    let zip = req.query.zip || DEFAULT_ZIP;
    let radius = req.query.radius;
    let email = req.query.email;

    res.json(await monitor.start({
        heb: {
            zip: zip,
            radius: radius,
        },
        email: email
    }));
};

const monitors = (req, res) => {
    console.log(monitor.getMonitors());
    res.json(monitor.getMonitors());
};

app.get('/', (req, res) => res.send('Hello World!'))

// All the stores
app.get('/stores', stores);

// Only stores with open slots
app.get('/slots', slots);

// Start a monitor
app.get('/start', start);

// List active monitors
app.get('/monitors', monitors);

app.listen(port, () => console.log(`HEB app listening at http://localhost:${port}`))

