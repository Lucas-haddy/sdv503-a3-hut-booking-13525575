# Pseudocode

MODULE dataStorage

    FUNCTION loadData()
        TRY
            IF huts.json DOES NOT EXIST OR IS EMPTY THEN
                INITIALIZE defaultHuts array with baseline records (e.g., Mintaro Hut)
                WRITE defaultHuts to huts.json
            ELSE
                READ huts.json and PARSE into global huts array
            ENDIF

            IF bookings.json DOES NOT EXIST OR IS EMPTY THEN
                INITIALIZE empty bookings array
                WRITE empty array to bookings.json
            ELSE
                READ bookings.json and PARSE into global bookings array
            ENDIF
            PRINT "Data successfully initialized."
        CATCH error
            PRINT "Warning: Corrupt or unreadable files. Starting with clean fallback data."
            INITIALIZE fallback arrays
        END TRY
    END FUNCTION

    FUNCTION saveBookings(bookingsArray)
        TRY
            CONVERT bookingsArray to JSON string
            WRITE JSON string to bookings.json
        CATCH error
            PRINT "Error writing data to file system."
        END TRY
    END FUNCTION

END MODULE

MODULE inputValidator

    FUNCTION validateHikerName(name)
        IF name IS EMPTY OR type IS NOT string THEN
            RETURN FALSE with error "Name cannot be empty."
        ENDIF
        RETURN TRUE
    END FUNCTION

    FUNCTION validateHutId(id, hutsList)
        IF id DOES NOT MATCH any hut.hutId in hutsList THEN
            RETURN FALSE with error "Hut ID does not exist."
        ENDIF
        RETURN TRUE
    END FUNCTION

    FUNCTION validatePartySize(size)
        IF size IS NOT A WHOLE NUMBER OR size <= 0 OR size > 20 THEN
            RETURN FALSE with error "Party size must be a whole number between 1 and 20."
        ENDIF
        RETURN TRUE
    END FUNCTION

    FUNCTION validateNights(nights)
        IF nights IS NOT A WHOLE NUMBER OR nights <= 0 OR nights > 30 THEN
            RETURN FALSE with error "Nights must be a whole number between 1 and 30."
        ENDIF
        RETURN TRUE
    END FUNCTION

    FUNCTION validateStartDate(dateString)
        IF dateString DOES NOT MATCH YYYY-MM-DD pattern THEN
            RETURN FALSE with error "Invalid format. Use YYYY-MM-DD."
        ENDIF
        
        CONVERT dateString to targetDateObject
        GET currentDateObject
        
        IF targetDateObject IS INVALID DATE OR targetDateObject < currentDateObject THEN
            RETURN FALSE with error "Date must be a valid calendar date and cannot be in the past."
        ENDIF
        RETURN TRUE
    END FUNCTION

END MODULE

MODULE bookingSystem

    // Core Logical Concept: Iterating individual dates of stay across existing overlaps
    FUNCTION checkCapacityForStay(hutId, startDateStr, nights, requestedPartySize, hutsList, bookingsList)
        FIND targetHut IN hutsList MATCHING hutId
        LET totalBunkCapacity = targetHut.bunkCap

        // Loop through each distinct night of the proposed stay
        FOR i FROM 0 TO (nights - 1)
            LET currentNightObject = startDateStr plus i days
            LET bookedBunksForNight = 0

            // Add up party sizes of existing bookings occupying this exact night
            FOR EACH booking IN bookingsList
                IF booking.hutId == hutId THEN
                    LET bStart = booking.startDate
                    LET bEnd = booking.startDate plus booking.nights days
                    
                    // A6: Checkout morning does not conflict (exclusive upper bound)
                    IF currentNightObject >= bStart AND currentNightObject < bEnd THEN
                        bookedBunksForNight = bookedBunksForNight + booking.partySize
                    ENDIF
                ENDIF
            ENDFOR

            LET remainingCapacity = totalBunkCapacity - bookedBunksForNight
            
            // Rejection condition
            IF (remainingCapacity - requestedPartySize) < 0 THEN
                RETURN FALSE with data (currentNightObject, remainingCapacity)
            ENDIF
        ENDFOR

        RETURN TRUE
    END FUNCTION

    FUNCTION calculateCosts(partySize, nights, baseRate, isMember)
        LET subtotal = partySize * nights * baseRate
        
        LET discount = 0
        IF isMember == TRUE THEN
            discount = subtotal * 0.15
        ENDIF
        
        LET net = subtotal - discount
        LET gst = net * 0.15
        LET total = net + gst

        RETURN structured cost object { subtotal, discount, net, gst, total }
    END FUNCTION

    FUNCTION cancelBooking(bookingId, bookingsList)
        FIND index OF booking IN bookingsList MATCHING bookingId
        IF index NOT FOUND THEN
            PRINT "Error: Booking code does not exist."
            RETURN FALSE
        ELSE
            REMOVE booking from bookingsList
            CALL DataManager.saveBookings(bookingsList)
            PRINT "Booking cancelled successfully. Capacity freed."
            RETURN TRUE
        ENDIF
    END FUNCTION

END MODULE

MODULE main

    IMPORT DataManager, InputValidator, BookingLogic

    FUNCTION start()
        CALL DataManager.loadData()
        CALL menuLoop()
    END FUNCTION

    FUNCTION menuLoop()
        LET running = TRUE
        WHILE running IS TRUE
            DISPLAY "--- DOC GREAT WALKS HUT BOOKING MANAGER ---"
            DISPLAY "1. Record New Booking"
            DISPLAY "2. View Bookings & Remaining Capacity by Date"
            DISPLAY "3. Cancel an Active Booking"
            DISPLAY "4. Print Occupancy Summary"
            DISPLAY "5. Exit System"
            
            PROMPT user for choice
            
            SWITCH choice
                CASE 1: CALL executeBookingFlow()
                CASE 2: CALL executeViewFlow()
                CASE 3: CALL executeCancellationFlow()
                CASE 4: CALL executeSummaryFlow()
                CASE 5: 
                    PRINT "System closing. Securing records..."
                    running = FALSE
                DEFAULT: PRINT "Invalid operational option selected."
            END SWITCH
        ENDWHILE
    END FUNCTION

    FUNCTION executeBookingFlow()
        PROMPT and VALIDATE hikerName using InputValidator
        PROMPT and VALIDATE hutId using InputValidator
        PROMPT and VALIDATE startDate using InputValidator
        PROMPT and VALIDATE nights using InputValidator
        PROMPT and VALIDATE partySize using InputValidator
        PROMPT isMember toggle flag

        // Call Module 3 capacity engine
        LET fits = CALL BookingLogic.checkCapacityForStay(hutId, startDate, nights, partySize, huts, bookings)
        
        IF fits IS FALSE THEN
            PRINT "Booking Rejected: Over-capacity limits hit during the duration sequence."
            RETURN
        ENDIF

        // Generate dynamic ID and billing lines
        LET newId = "B-" + unique timestamp or counter string
        LET rates = FIND hut baseRate in huts list
        LET billing = CALL BookingLogic.calculateCosts(partySize, nights, rates, isMember)

        CREATE completeBookingRecord containing variables and billing object
        PUSH completeBookingRecord to global bookings array
        
        CALL DataManager.saveBookings(bookings)
        PRINT "Booking Confirmation success under Reference Code: " + newId
    END FUNCTION

END MODULE
