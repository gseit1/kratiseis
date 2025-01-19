// Επικύρωση ότι το bookingStart είναι μικρότερο από το bookingEnd και ότι είναι εντός των ωρών λειτουργίας
const validateBookingHours = function() {
  if (this.isOpen) {
    return this.bookingStart < this.bookingEnd && this.bookingStart >= this.open && this.bookingEnd <= this.close;
  }
  return true;
};

// Επικύρωση ότι το open είναι μικρότερο από το close
const validateOpenCloseHours = function() {
  if (this.isOpen) {
    return this.open < this.close;
  }
  return true;
};

// Επικύρωση ότι το phone είναι έγκυρο
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(69\d{8}|2\d{2,3}\d{6,7})$/;
  return phoneRegex.test(phone);
};

module.exports = {
  validateBookingHours,
  validateOpenCloseHours,
  validatePhoneNumber,
};