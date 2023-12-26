import React, { useState } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const RoomJoinPage = () => {
    const [ roomCode, setRoomCode ] = useState("");
    const [ codeInputErrorMsg, setCodeInputErrorMsg ] = useState("");
    const navigate = useNavigate();
    const handleTextFieldChanged = ( e ) => { setRoomCode( e.target.value ); }

    const handleEnterRoomButtonClicked = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: roomCode
            })
        };

        fetch( '/api/join-room', requestOptions ).then( ( response ) => {
            if ( response.ok ) { navigate(`/room/${roomCode}`); } 
            else { setCodeInputErrorMsg("Room not found.") }
        }).catch( error => console.log( error ))
    }

    return (
        <Grid container direction="column" spacing={1} alignItems="center">
            <Grid item>
                <Typography component="h4" variant="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid item>
                <TextField 
                    error={codeInputErrorMsg.length > 0}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={roomCode}
                    helperText={codeInputErrorMsg}
                    variant="outlined"
                    onChange={handleTextFieldChanged}
                />
            </Grid>
            <Grid item>
                <Button variant="contained" color="primary" onClick={handleEnterRoomButtonClicked}>Enter Room</Button>
            </Grid>
            <Grid item>
                <Link to="/">
                    <Button variant="contained" color="secondary">Back</Button>
                </Link>
            </Grid>
        </Grid>
    );
}

export default RoomJoinPage;