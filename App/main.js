const readline = require('readline')

const validator = require('./inputValidator');
const { loadData } = require('./dataStorage');
const bookingSystem = require('./bookingSystem');
const { exec } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

let huts = [];
let bookings = [];

async function startApp() {
    console.log("System starting...");
    
    const loadedData = dataStorage.loadData();
    huts = loadedData.huts;
    bookings = loadedData.bookings;

    await menuLoop();
};

async function menuLoop() {
    let running = true;
    while (running) {
        console.log('\n======== DOC GREAT WALK BOOKING SYSTEM ========');
        console.log('=================================================');
        console.log('1. Record New Booking');
        console.log('2. View Bookings & Free Capacity');
        console.log('3. Cancel a Booking');
        console.log('4. View Occupancy Summary');
        console.log('5. Exit System');
        console.log('=================================================');

        const choice = await askQuestion('Select an option (1-5): ');

        switch (choice.trim()) {
            case '1': 
                await executeBookingFlow();
                break;
            case '2':
                await executeViewFlow();
                break;
            case '3':
                await executeCancellationFlow();
                break;
            case '4':
                await executeSummaryFlow();
                break;
            case '5':
                console.log('\nSaving Records... Goodbye!');
                running = false;
                rl.close();
                break;
            default: 
                console.log('Invalid option. Please select a number between 1 and 5.');    
        }
    }
}

async function executeBookingFlow() {
    console.log('\n=== New Booking Request ===');

    let name = '';
    while (true) {
        name = await askQuestion('Enter Hiker Name: ');
        if (validator.validateHikerName(name)) {
            break;
        }
    }
    let hutId = '';
    while (true) {
        hutId = await askQuestion('Enter Hut ID (e.g., H-01: ');
        if (validator.validateHutId(hutId)) {
            const hutExists = huts.some(h => h.hutId === hutId.trim());
            if (hutExists) {
                hutId = hutId.trim();
                break;
            } else {
                console.log('Hut ID does not exist.');
            }
        }
    }
    console.log(`\nProgress Saved. Booking for ${name} at ${hutId}...`);
}