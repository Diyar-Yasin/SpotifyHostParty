import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Room = ( ) => {
    const DEFAULT_VOTES = 2;
    const [ votesToSkip, setVotesToSkip ] = useState( DEFAULT_VOTES );
    const [ guestsCanPause, setGuestsCanPause ] = useState( false );
    const [ isHost, setIsHost ] = useState( false );
    const { roomCode } = useParams();
    
    const getRoomDetails = () => {
        fetch( '/api/get-room' + '?code=' + roomCode ).then( (response) => {
            return response.json();
        }).then( (data) => {
            setVotesToSkip( data.votes_to_skip );
            setGuestsCanPause( data.guests_can_pause );
            setIsHost( data.is_host );
        });
    }

    // @Diyar: Not completely sure that this useEffect works as I expect:
    // which is to call getRoomDetails once we get the roomCode from useParams
    useEffect( () => {
        getRoomDetails();
    }, [ roomCode ])

    return (
        <div>
            <h3>{roomCode}</h3>
            <p>Votes: {votesToSkip}</p>
            <p>Guests Can Pause: { String( guestsCanPause ) }</p>
            <p>Host: { String( isHost ) }</p>
        </div>
    );
};

export default Room;