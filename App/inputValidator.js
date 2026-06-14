const validateHikerName = (name) => {
    if (typeof name !== 'string' || name.trim() === '') {
        console.log('Hiker name cannot be empty.');
        return false;
    } else {
        return true;
    }
}

const validateHutId = (hutId) => {
    if (typeof hutId !== 'string' || hutId.trim() === '') {
        console.log('Please enter a valid hut ID.')
        return false;
    } else {
        return true;
    }
}

const validatePartySize = (partySize) => {
    if (!Number.isInteger(partySize) || partySize <= 0 || partySize > 20) {
        console.log('Party size must be a positive whole number between 1 and 20.');
        return false;
    } else {
        return true;
    }
}

const validateNights = (nights) => {
    if (!Number.isInteger(nights) || nights <= 0 || nights > 30) {
        console.log('Number of nights must be a positive whole number between 1 and 30.');
        return false;
    } else {
        return true;
    }
}

const validateStartDate = (startDate) => {
    if (!startDate.length !== 10) {
        console.log('Start date must be exactly 10 characters in the format YYYY-MM-DD.');
        return false;
    }
    if  (startDate[4] !== '-' || startDate[7] !== '-') { 
        console.log('Start date must be in the format YYYY-MM-DD with dashes in the correct positions.');
        return false;
    }
    const parts = startDate.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        console.log('Start date must contain valid numbers for year, month, and day.');
        return false;
    }
    const proposedDate = new Date(year, month - 1, day);
    if (proposedDate.getFullYear() !== year || proposedDate.getMonth() + 1 !== month || proposedDate.getDate() !== day) {
        console.log('Start date must be a valid calendar date.');
        return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    proposedDate.setHours(0, 0, 0, 0);
    if (proposedDate < today) {
        console.log('Start date cannot be in the past.');
        return false;
    }
    return true;
}

module.exports = { 
    validateHikerName,
    validateHutId,
    validatePartySize,
    validateNights,
    validateStartDate
};