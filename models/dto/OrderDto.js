const Joi = require('joi');

const orderDto = Joi.object({
    startTime: Joi.string()
        .allow('', null)
        .messages({
            'string.base': 'Start time must be a string',
            'any.only': 'Start time must be a valid time string',
        }),
    endTime: Joi.string()
        .allow('', null)
        .messages({
            'string.base': 'End time must be a string',
            'any.only': 'End time must be a valid time string',
        }),
    startDate: Joi.date()
        .allow('', null)
        .messages({
            'date.base': 'Start date must be a date',
            'date.empty': 'Start date is required',
        }),
    endDate: Joi.date()
        .allow('', null)
        .messages({
            'date.base': 'End date must be a date',
            'date.empty': 'End date is required',
        }),
})
    .custom((orderData, helpers) => {
        const startDate = new Date(orderData.startDate);
        const endDate = new Date(orderData.endDate);
        const startTime = orderData.startTime ? new Date(orderData.startTime) : null;
        const endTime = orderData.endTime ? new Date(orderData.endTime) : null;

        // Validate startDate is earlier than endDate
        if (startDate && endDate && startDate >= endDate) {
            return helpers.error('date.startDateEarlierThanEndDate');
        }

        // Validate startTime is earlier than endTime
        if (startTime && endTime && startTime >= endTime) {
            return helpers.error('date.startTimeEarlierThanEndTime');
        }

        return orderData;
    })
    .messages({
        'date.startDateEarlierThanEndDate': 'Start date must be earlier than end date',
        'date.startTimeEarlierThanEndTime': 'Start time must be earlier than end time',
    });

module.exports = orderDto;
