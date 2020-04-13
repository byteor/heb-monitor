const heb = require('./heb');
const mail = require('./mail');
const INTERVAL = 1000 * 300 // 300s
// Sample config
const config = {
    // if set email will be sent
    email: '',
    // if set, SMS will be sent
    phone: '',
    heb: {
        // or ZIP (ZIP+4) and (optional) radius in miles
        zip: '',
        radius: 10,
    }
};

const monitors = {};
const intervals = {};

const tryIt = async (monitor) => {
    const {storeIds, cache, zip, email} = monitor;
    const results = [];
    console.log(`${(new Date()).toLocaleString()}: ${zip} - Looking for changes...`);
    const stores = await heb.getStores(storeIds);
    stores.forEach(store => {
        if (store.dates.length && (!cache[store.id] || cache[store.id] && cache[store.id] != store.dates.length)) {
            results.push(store);
            console.log(store.name, store.dates);
            cache[store.id] = store.dates.length;
        } else cache[store.id] = null;
    });
    if (results.length) {
        // here we have changes
        console.log(`${zip}: Changes!`, results);
        if(email) {
            mail.sendMail(results, email);
        }
    }
};


const start = async config => {

    let storeIds = config.heb.stores || [];
    const {zip} = config.heb;
    const radius = config.heb.radius || heb.DEFAULT_RADIUS

    if (zip) {
        console.log('Monitoring: ', zip, radius);
        const stores = await heb.getStoresByZip(zip, radius);
        console.log(stores);
        storeIds = stores.map(store => store.id);
    } else {
        throw new Error("ZIP is missing");
    }

    if(intervals[zip]) {
        clearInterval(intervals[zip].interval);
    }

    monitors[zip] = {
        storeIds: storeIds,
        cache: monitors[zip] && monitors[zip].cache || {},
        radius: radius,
        zip: zip,
        email: config && config.email,
    };
    intervals[zip] = setInterval(() => {
        tryIt(monitors[zip]).then().catch(error => console.log(zip, error));
    }, INTERVAL);

    tryIt(monitors[zip]).then().catch(error => console.log(zip, error));
    console.log(monitors[zip]);
    return monitors[zip];
};


const getMonitors = () => {
    return monitors;
}

module.exports = {
    start,
    getMonitors,
}