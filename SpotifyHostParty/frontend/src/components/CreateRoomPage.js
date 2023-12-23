import React, { useState } from "react";
import { FormLabel, FormControl, FormControlLabel, Radio, RadioGroup, Grid, Typography, TextField, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const CreateRoomPage = () => {
    const DEFAULT_VOTES = 2;
    const [ votesToSkipSong, setVotesToSkipSong ] = useState( DEFAULT_VOTES );
    const [ guestsCanPause, setGuestsCanPause ] = useState( false );
    const navigate = useNavigate();

    const handleVotesChanged = ( e ) => { setVotesToSkipSong( e.target.value ); }
    const handleGuestsCanPauseChanged = ( e ) => { setGuestsCanPause( e.target.value ); }

    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: votesToSkipSong,
                guests_can_pause: guestsCanPause
            })
        };

        fetch( '/api/create-room', requestOptions ).then( ( response ) => response.json() ).then( ( data ) => 
             navigate( '/room/' + data.code )
        );
    }

    return (
        <Grid container direction="column" spacing={1} alignItems="center">
            <Grid item>
                <Typography component="h4" variant="h4">
                    Create A Room
                </Typography>
                <FormControl>
                    <FormLabel>Guest Control of Playback State</FormLabel>
                    <RadioGroup row value={guestsCanPause} onChange={ handleGuestsCanPauseChanged }>
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
                        defaultValue={votesToSkipSong}
                        inputProps={{
                            min: 1,
                            style: { textAlign: "center" }
                        }}
                        onChange={ handleVotesChanged }
                    />
                </FormControl>
            </Grid>

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
        </Grid>
    );
}

export default CreateRoomPage;