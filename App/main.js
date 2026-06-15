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

async function executeViewFlow() {
    console.log('\n=== View Bookings by Date ===');

    let hutId = await askQuestion('Enter Hut ID to view (e.g. H-01: ');
    hutId = hutId.trim();
    const bookingHut = huts.find(h => h.hutId === hutId);
    if (!bookingHut) {
        console.log('That Hut ID does not exist.');
        return;
    }
    const viewDate = await askQuestion('Enter Date to check (YYYY-MM-DD): ');
    if (!validator.validateStartDate(viewDate)) {
        return;
    }
    
    console.log(`\nBookings for ${bookingHut.hutName} on ${viewDate}:`);
    console.log('================================================');

    let bookedBunks = 0;
    let foundAny = false;

    for (let b of bookings) {
        if (b.hutId === hutId) {
            let bStart = new Date(b.startDate);
            let bEnd = new Date(b.startDate);
            bEnd.setDate(bEnd.getDate() + b.nights);
            let target = new Date(viewDate);

            bStart.setHours(0, 0, 0, 0);
            bEnd.setHours(0, 0, 0, 0);
            target.setHours(0, 0, 0, 0);
            if (target >= bStart && target < bEnd) {
                console.log(`- ID: ${b.bookingId} | Hiker: ${b.hikerName} | Group Size: ${b.partySize}`);
                bookedBunks += b.partySize; 
                foundAny = true;
            }
        }
    }
    if (!foundAny) {
        console.log('No bookings found for the selected date.');
    }

    console.log('================================================');
    console.log(`Total Bunk Capacity: ${bookingHut.bunkCap}`);
    console.log(`Booked Bunks: ${bookedBunks}`);
    console.log(`Free Bunks: ${bookingHut.bunkCap - bookedBunks}`);
}

async function executeCancellationFlow() {
    console.log('\n=== Cancel a Booking ===');

    const searchId = await askQuestion('Enter Booking ID: ');
    const trimmedId = searchId.trim().toUpperCase();

    const index = bookings.findIndex(b => b.bookingId === trimmedId);
    if (index === -1) {
        console.log('That Booking ID does not exist.');
        return;
    }
    
    const targetBooking = bookings[index];
    console.log(`\nBooking Found: ${targetBooking.hikerName} - ${targetBooking.partySize} people.`);
    const confirm = await askQuestion(`Are you sure you want to cancel booking ${trimmedId}? (yes/no): `);

    if (confirm.trim().toLowerCase() === 'yes' || confirm.trim().toLowerCase() === 'y') {
        bookings.splice(index, 1);
        try {
            const fs = require('fs');
            fs.writeFileSync('bookings.json', JSON.stringify(bookings, null, 2)); 
            console.log(`\nSuccess: Booking ${trimmedId} has been cancelled. Capacity freed.`);
        } catch (error) {
            console.log('File Error: Changes could not be saved.');
        } 
    } else {
        console.log('Cancellation aborted.');
    }

}