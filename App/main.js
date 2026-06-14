const readline = require('readline')

const validator = require('./inputValidator');
const { loadData } = require('./dataStorage');
const bookingSystem = require('./bookingSystem');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

let huts = [];
let bookings = [];
