# sdv503-a3-hut-booking-13525575

The repository for SDV503 assessment 3, where I will design and build a booking manager for tramping areas/huts.

## Operating Instructions

Step 1: Open the terminal and ensure that you are in the App folder (cd App)

Step 2: Type 'node main.js' to open the application

Step 3: Choose between the available options (1-5) for your desired function.

Step 4: If you wish to create a new booking, type '1' into the terminal and press enter.
    Step 4a: Enter the Hiker name, Hut Id (only H-01 & H-02 are valid), Start date, number of nights, party size and member status.
    Step 4b: The system will take your provided information and produce a billing invoice in the terminal. If you wish to save the booking, type 'yes' if you do not, type 'no'.
    Step 4c: The booking will be saved to the system and a booking reference code will be printed into the terminal.

Step 5: If you wish to view Bookings & Free Capacity, type '2' into the terminal.
    Step 5a: Enter the Hut ID of the Hut you wish to check, as well as the exact date you wish to check.
    Step 5b: The system will display the bookings on that date with the name of the Hiker, the ID of the booking and the size of the group.

Step 6: If you wish to cancel a booking, type '3'
    Step 6a: Enter the Booking ID of the booking you wish to cancel, e.g. B-1001.
    Step 6b: The system will locate the booking from the ID number and ask if you wish to cancel the booking, type 'yes' if you do, or 'no' if you do not.
    Step 6c: If the booking is cancelled, the capacity held by said booking will be freed.

Step 7: If you wish to view the summary for all listed huts, type '4'
    Step 7a: The system will print the occupancy summary into the terminal with all logged bookings displayed in a counter.

Step 8: If you wish to close the system, type '5'. The system will save all recorded data and then close.
