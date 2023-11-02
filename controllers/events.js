const { response } = require('express');
const Event = require('../models/Event');


const getEvent = async( req, res = response ) => {

    const events = await Event.find()
                                    .populate('user', 'name');
    
    res.json({
        ok: true,
        // events: events
        events
    })
}

const createEvent = async( req, res = response ) => {

    const event = new Event( req.body );
    console.log(event);
    try {
        
        event.user = req.uid;
        const newEvent = await event.save();

        res.json({
            ok: true,
            event: newEvent
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact administrator'
        })
    }
    
}

const updateEvent = async( req, res = response ) => {
    
    //obtengo el id del evento
    const eventId = req.params.id;
    //obtengo el id del usuario
    const uid = req.uid;
    console.log(uid);
    try {

        const event = await Event.findById( eventId )
        
        if( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Event doesn\'t exist by this id'
            })
        }

        //verificamos que la persona que actualiza el evento es la misma que lo creó
        if( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'You don\'t have the priviledge of updating this event'
            })
        }
        //ahora sí puede editar ya que es la misma persona
        const newEvent = {
            //desestructuro todo lo de antes, es decir lo que me mande,
            // que viene en la request.body, y adicionalmente colocaré el user 
            ...req.body,
            user: uid
        }
        //actualizo
        const updatedEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        //si todo sale bien enviamos respuesta
        res.json({
            ok: true,
            event: updatedEvent
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact administrator'
        });
    }

}
const deleteEvent = async( req, res = response ) => {


    //obtengo el id del evento
    const eventId = req.params.id;
    //obtengo el id del usuario
    const uid = req.uid;
    console.log(uid);
    try {

        const event = await Event.findById( eventId )
        
        if( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Event doesn\'t exist by this id'
            })
        }

        //verificamos que la persona que actualiza el evento es la misma que lo creó
        if( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'You don\'t have the priviledge of deleting this event'
            })
        }
        //ahora sí puede eliminar ya que es la misma persona
        //elimino
        const deletedEvent = await Event.findByIdAndDelete( eventId );

        //si todo sale bien enviamos respuesta
        res.json({
            ok: true,
            event: deletedEvent
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact administrator'
        });
    }
}

module.exports = {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
}

