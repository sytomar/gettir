/* jshint node: true */
const mongoose = require('mongoose');
const count = mongoose.Schema({
    type: Number
}, { _id : false });
const base = {
    key: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: null
    },
    counts: {
        type: [count],
        default: []
    },
    key: {
        type: String,
        default: null
    }
};
let recordsSchema = new mongoose.Schema(base);

recordsSchema.set('runValidators', false);
recordsSchema.set('strict', false);
recordsSchema.set('versionKey', false);

recordsSchema.pre('save', function (next) {
    let now = Date.now();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

recordsSchema.post('save', function(doc) {
    console.log('%s has been saved', doc._id);
});

recordsSchema.index({'key': 1.0}, {'name': 'key_1'});
recordsSchema.index({'createdAt': 1.0}, {'name': 'createdAt_1'});
recordsSchema.set('autoIndex', true);

module.exports = mongoose.model('records', recordsSchema);
