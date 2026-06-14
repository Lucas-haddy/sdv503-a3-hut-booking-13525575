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