const Shop = require('../models/shop');


const isOpen = (value, isOpen, fieldName) => {
    if (isOpen) {
      if (value === undefined || value === null) {
        return false; // Επιστρέφουμε false για να δείξουμε ότι η τιμή είναι απαραίτητη
      }
    }
    return true;  // Επιστρέφουμε true αν είναι έγκυρο
};










module.exports ={
    isOpen

};