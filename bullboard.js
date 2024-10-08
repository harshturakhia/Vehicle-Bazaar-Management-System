const { createBullBoard } = require('bull-board');
const { BullAdapter } = require('bull-board/bullAdapter');

const emailQueue = require('./queues/emailQueue'); // Import your email queue
const orderQueue = require('./queues/orderQueue'); // Import your email queue

const { router, setQueues, replaceQueues } = createBullBoard([
    new BullAdapter(emailQueue),
    new BullAdapter(orderQueue),
]);

module.exports = router;
