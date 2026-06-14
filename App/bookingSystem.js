const checkCapacity = (hutId, startDate, nights, partySize, hutsList, bookingsList) => {
    const bookingHut = hutsList.find(hut => hut.hutId === hutId);
    if (!bookingHut) return false;
    const totalBunks = bookingHut.bunkCap;
    
    for (let i = 0; i < nights; i++) {
        let currentNight = new Date(startDate);
        currentNight.setDate(currentNight.getDate() + i);
        currentNight.setHours(0, 0, 0, 0);

        let bookedBunks = 0;

        for (let booking of bookingsList) {
            if (booking.hutId === hutId) {
                let bookingStart = new Date(booking.startDate);
                bookingStart.setHours(0, 0, 0, 0);
                let bookingEnd = new Date(booking.startDate);
                bookingEnd.setDate(bookingEnd.getDate() + booking.nights);
                bookingEnd.setHours(0, 0, 0, 0);
                if (currentNight >= bookingStart && currentNight < bookingEnd) {
                    bookedBunks += booking.partySize;
                }
            }
        }
        let remainingBunks = totalBunks - bookedBunks;
        if (remainingBunks - partySize < 0) {
            console.log(`Booking failed for ${currentNight.toDateString()}: Not enough bunks available. Remaining bunks: ${remainingBunks}`);
            return false;
        }
    }
    return true;
};

const calculateCost = (partySize, nights, baseRate, isMember) => {
    const subtotal = partySize * nights * baseRate;
    let discount = 0;
    if (isMember === true){
        discount = subtotal * 0.15;
    }
    const net = subtotal - discount;
    const gst = net * 0.15;
    const total = net + gst; 

    return {
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        net: Number(net.toFixed(2)),
        gst: Number(gst.toFixed(2)),
        total: Number(total.toFixed(2))
    };
};

module.exports = {
    checkCapacity,
    calculateCost
};