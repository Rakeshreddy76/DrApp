const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const contextQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const bookingSchema = new mongoose.Schema({
  Username_doctor: { type: String, required: true },
  accId: { type: String, required: true },
  doctorEmail: { type: String, required: true },
  doctorTimezone: { type: String, required: true },
  bookedServicesData: [{
    bookingId: { type: String, required: true },
    orderId: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhoneNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    serviceTitle: { type: String, required: true },
    serviceCategory: { type: String, required: true },
    serviceNumber: { type: Number, required: true },
    isServicePackage: { type: Boolean, default: false },
    packageValidity: { type: String },
    transactionId: { type: String, required: true },
    isRescheduled: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    numberOfReschedules: { type: Number, default: 0 },
    rescheduledBy: { type: String, default: 'consumer' },
    questionObj: [questionSchema],
    contextQuestion: [contextQuestionSchema],
    transactionStatus: { type: String, required: true },
    bookingStatus: { type: String, required: true },
    meetingStartTime: { type: String },
    meetingEndTime: { type: String },
    date: {
      day: { type: Number, required: true },
      month: { type: String, required: true },
      weekDay: { type: String, required: true },
    },
    customerTimezone: { type: String, required: true },
    location: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    isPaymentSuccessful: { type: Boolean, required: true },
    correlationId: { type: String, required: true },
  }],
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
