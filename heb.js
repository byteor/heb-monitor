const axios = require('axios').default

// 1. POST https://www.heb.com/commerce-api/v1/store/locator/address
// 2. https://www.heb.com/commerce-api/v1/timeslot/timeslots?store_id=395&days=15&fulfillment_type=pickup

const DEFAULT_RADIUS = process.env.DEFAULT_RADIUS || 10;
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/json;charset=utf-8',
    'Origin': 'https://www.heb.com',
    'Referer': 'https://www.heb.com/static-page/heb-curbside-delivery',
};

//const getStores = (req, res) => {
const getStoresByZip = async (zip, radius) => {

    const payload = `{"address":"${zip}","curbsideOnly":true,"radius":${radius || DEFAULT_RADIUS},"nextAvailableTimeslot":true,"includeMedical":false}`;
    try {
        response = await axios.post('https://www.heb.com/commerce-api/v1/store/locator/address', payload, { headers });
        const stores = response.data.stores;
        return stores.map(({ store, distance }) => ({
            id: store.id,
            distance: distance,
            name: store.name,
            city: store.city,
            zip: store.postalCode,
            address: store.address1
        })).sort((a, b) => a.distance - b.distance);
    } catch (e) {
        console.log(e);
    }
    return [];
}

const getStores = async (ids) => {
    const results = [];
    try {
        const responses = ids.map(async id => await axios.get(`https://www.heb.com/commerce-api/v1/timeslot/timeslots?store_id=${id}&days=15&fulfillment_type=pickup`, headers));
        for (const asyncResponse in responses) {
            const response = await responses[asyncResponse];
            const store = response.data.pickupStore;
            const slots = {};
            response.data.items
                .map(slot => slot.timeslot)
                .sort((a, b) => a.startTime > b.startTime ? 1 : -1)
                .forEach(slot => {
                    if (!slots[slot.date]) slots[slot.date] = [];
                    slots[slot.date].push({
                        date: slot.date,
                        time: slot.from_time,
                        day: slot.dayOfWeek,
                        capacity: slot.capacity,
                        price: slot.totalPrice,
                        startTime: slot.startTime
                    })
                });
            //console.log(store, slots);
            if (Object.keys(slots)) results.push({
                id: store.id,
                name: store.name,
                city: store.city,
                zip: store.postalCode,
                address: store.address1,
                slots: slots,
                dates: Object.keys(slots).sort((a, b) => a.localeCompare(b))
            });
        };
        //console.log('got all')
    } catch (error) {
        console.log(error);
    }
    return results;
};

module.exports = {
    getStores,
    getStoresByZip,
    DEFAULT_RADIUS,
}