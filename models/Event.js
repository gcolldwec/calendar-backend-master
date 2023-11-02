
const { Schema, model } = require('mongoose');

const EventSchema = Schema({

    title: {
        type: String,
        required: true,
    },
    notes: {
        type: String
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

});

EventSchema.method('toJSON', function() { 
    //desestructuro y extraigo la version y el id(__v, _id) y lo demás lodejo con el spread
    const { __v, _id, ...object } = this.toObject();
    //ahora lo reemplazo en el object
    object.id = _id;
    return object;
})

module.exports = model( 'Event', EventSchema );
    