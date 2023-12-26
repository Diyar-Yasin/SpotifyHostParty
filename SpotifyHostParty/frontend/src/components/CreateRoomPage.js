import React, { useState } from "react";
import { FormLabel, FormControl, FormControlLabel, Radio, RadioGroup, Grid, Typography, TextField, Button, Collapse, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";


const CreateRoomPage = ( { votesToSkipProp = 2, guestsCanPauseProp = false, updateMode = false, roomCode = null, updateCallback = () => {} } ) => {
    const [ votesToSkip, setVotesToSkip ] = useState( votesToSkipProp );
    const [ guestsCanPause, setGuestsCanPause ] = useState( guestsCanPauseProp );
    const [ updateRoomResponseMsg, setUpdateRoomResponseMsg ] = useState( "" );
    const [ successfulUpdate, setSuccessfulUpdate ] = useState( true );
    const navigate = useNavigate();

    const handleVotesChanged = ( e ) => { setVotesToSkip( e.target.value ); }
    const handleGuestsCanPauseChanged = ( e ) => { setGuestsCanPause( e.target.value ); }

    const title = updateMode ? "Update Room" : "Create a Room";

    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guests_can_pause: guestsCanPause
            })
        };

        fetch( '/api/create-room', requestOptions ).then( ( response ) => {
                if ( !response.ok ) {
                    console.log( "Create room failed!" );   // @Diyar: I don't actually handle this situation     
                }

                return response.json(); })
            .then( ( data ) => navigate( '/room/' + data.code )
        );
    }

    const handleUpdateButtonPressed = () => {
        const requestOptions = {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guests_can_pause: guestsCanPause,
                code: roomCode
            })
        };

        fetch( '/api/update-room', requestOptions ).then( ( response ) => {
            if ( response.ok ) {
                setUpdateRoomResponseMsg( "Room updated successfully!" );
                setSuccessfulUpdate( true );
                updateCallback();
            } else {
                setUpdateRoomResponseMsg( "Error updating room..." );
                setSuccessfulUpdate( false );
            }
        });
    }

    const renderCreateButtons = () => {
        return (
            <>
                <Grid item>
                    <Button 
                        color="primary" 
                        variant="contained"
                        onClick={ handleRoomButtonPressed }
                    >
                        Create A Room
                    </Button>
                </Grid>
                <Grid item>
                    <Link to="/">
                        <Button 
                            color="secondary" 
                            variant="contained"
                        >
                            Back
                        </Button>
                    </Link>
                </Grid>
            </>
        );
    }

    const renderUpdateButtons = () => {
        return (
            <Grid item>
                <Button 
                    color="primary" 
                    variant="contained"
                    onClick={ handleUpdateButtonPressed }
                >
                    Update Room
                </Button>
            </Grid>
        );
    }

    return (
        <Grid container direction="column" spacing={1} alignItems="center">
            <Grid item>
                <Collapse in={ updateRoomResponseMsg !== "" } >
                    <Alert severity={ successfulUpdate ? "success" : "error" } onClose={ () => { setUpdateRoomResponseMsg( "" ) } }> { updateRoomResponseMsg } </Alert>
                </Collapse>
            </Grid>
            <Grid item>
                <Typography component="h4" variant="h4"> {title} </Typography>
                <FormControl>
                    <FormLabel>Guest Control of Playback State</FormLabel>
                    <RadioGroup row value={ guestsCanPause } onChange={ handleGuestsCanPauseChanged }>
                        <FormControlLabel value={true} control={<Radio color="success" />} label="Play/Pause" />
                        <FormControlLabel value={false} control={<Radio />} label="No Control" />
                    </RadioGroup>
                </FormControl> 
            </Grid>

            <Grid item>
                <FormControl>
                    <FormLabel>Votes Required To Skip Song</FormLabel>
                    <TextField 
                        required={true}
                        type="number"
                        defaultValue={ votesToSkip }
                        inputProps={{
                            min: 1,
                            style: { textAlign: "center" }
                        }}
                        onChange={ handleVotesChanged }
                    />
                </FormControl>
            </Grid>
            { updateMode ? renderUpdateButtons() : renderCreateButtons() }
        </Grid>
    );
}

export default CreateRoomPage;