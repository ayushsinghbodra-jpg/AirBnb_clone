const express = require('express');
const storeRouter = express.Router();
const storeController = require('../Controllers/storeController');
const bookingController = require('../Controllers/bookingController');

storeRouter.get('/', storeController.getIndex);
storeRouter.get('/homes', storeController.getHomes);
storeRouter.get('/bookings', bookingController.getMyBookings);
storeRouter.get('/favourites', storeController.getFavouritesList);
storeRouter.get('/homes/:homeId', storeController.getHomeDetails);
storeRouter.get('/book/:homeId', bookingController.getBookPage);
storeRouter.post('/book', bookingController.postBook);
storeRouter.post('/bookings/:bookingId/cancel', bookingController.cancelBooking);
storeRouter.post('/favourites', storeController.postAddToFavourite);
storeRouter.post('/favourites/delete/:homeId', storeController.postRemoveFromFavourite);

module.exports = storeRouter;