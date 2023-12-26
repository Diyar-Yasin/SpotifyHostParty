import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";

const Room = ( props ) => {
    const DEFAULT_VOTES = 2;
    const [ votesToSkip, setVotesToSkip ] = useState( DEFAULT_VOTES );
    const [ guestsCanPause, setGuestsCanPause ] = useState( false );
    const [ isHost, setIsHost ] = useState( false );
    const [ showSettings, setShowSettings ] = useState( false );
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const leaveRoom = () => {
        props.leaveRoomCallback();   
        navigate('/');
    }

    const getRoomDetails = () => {
        fetch( '/api/get-room' + '?code=' + roomCode ).then( (response) => {
            if ( !response.ok ) {
                leaveRoom();
            }
            
            return response.json();
        })
        .then( (data) => {
            setVotesToSkip( data.votes_to_skip );
            setGuestsCanPause( data.guests_can_pause );
            setIsHost( data.is_host );
        });
    }

    useEffect( () => {
        getRoomDetails();
    }, [ roomCode ]);

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch( '/api/leave-room', requestOptions )
        .then( () => leaveRoom() )
        .catch( ( error ) => console.log( error ) );
    }

    const updateShowSettings = ( value ) => { setShowSettings( value ); }

    const renderSettings = () => {
        return (
            <Grid container direction="column" spacing={1} alignItems="center">
                <Grid item>
                    <CreateRoomPage 
                        updateMode={true} 
                        votesToSkipProp={votesToSkip} 
                        guestsCanPauseProp={guestsCanPause} 
                        roomCode={roomCode} 
                        updateCallback={getRoomDetails}
                    />
                </Grid>
                <Grid item>
                    <Button 
                        color="secondary" 
                        variant="contained"
                        onClick={ () => updateShowSettings( false ) }
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    }

    const renderSettingsButton = () => {
        return (
            <Grid container direction="column" spacing={1} alignItems="center">
                <Grid item>
                    <Button 
                        color="primary" 
                        variant="contained"
                        onClick={ () => updateShowSettings( true ) }
                    >
                        Settings
                    </Button>
                </Grid>
            </Grid>
        );
    }

    const renderRoom = () => {
        return (
            <Grid container direction="column" spacing={1} alignItems="center">
                <Grid item>
                    <Typography variant="h4" component="h4">
                        Code: { roomCode }
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h6" component="h6">
                        Votes: { votesToSkip }
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h6" component="h6">
                        Guests Can Pause: { String( guestsCanPause ) }
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h6" component="h6">
                        Host: { String( isHost ) }
                    </Typography>
                </Grid>
                { isHost ? renderSettingsButton() : null }
                <Grid item>
                    <Button 
                        color="secondary" 
                        variant="contained"
                        onClick={ leaveButtonPressed }
                    >
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        );
    }

    return ( showSettings ? renderSettings() : renderRoom() );
};

export default Room;