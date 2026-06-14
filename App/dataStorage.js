const fs = require('fs');

const defaultHuts = [
    {
        hutId: 'H-01',
        name: 'Mintaro Hut',
        track: 'Milford Track',
        bunkCap: 40,
        baseRate: 50
    },
    {
        hutId: 'H-02',
        name: 'Dumpling Hut',
        track: 'Milford Track',
        bunkCap: 30,
        baseRate: 50
    }
];

let huts = [];
let bookings = [];

const loadData = () => {
    try {
        if (!fs.existsSync('huts.json')) {
            console.log('huts.json not found. Starting with default huts...');
            fs.writeFileSync('huts.json', JSON.stringify(defaultHuts, null, 2));
            huts = defaultHuts;
        } else {
            const fileData = fs.readFileSync('huts.json');
            huts = JSON.parse(fileData);
        }
        if (!fs.existsSync('bookings.json')) {
            console.log('bookings.json not found. Starting with empty bookings...');
            fs.writeFileSync('bookings.json', JSON.stringify([], null, 2));
            bookings = [];
        } else {
            const fileData = fs.readFileSync('bookings.json');
            bookings = JSON.parse(fileData);
        }
        console.log('Data loaded successfully.');
        return { huts, bookings };
    } catch (error) {
        console.log('Error loading data. Starting with default data...');
        huts = defaultHuts;
        bookings = [];
        return { huts, bookings };
    }
}

module.exports = {
    loadData
}