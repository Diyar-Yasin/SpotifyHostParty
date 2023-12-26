import React, { useEffect, useState } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Typography, Grid, Button, ButtonGroup } from "@mui/material";

const HomePage = () => {
    const [ roomCode, setRoomCode ] = useState( null );

    useEffect(() => {

        const fetchUsersInRoom = async () => {
            fetch( '/api/user-in-room' )
            .then( ( response ) => {
                if ( !response.ok ) throw new Error('No roomCode associated with user found');

                return response.json();
            })
            .then( ( data ) => setRoomCode( String( data.code ) ))
            .catch( ( error ) => console.log( error ) );
        }

        fetchUsersInRoom()
        .catch( console.error );

    }, []);

    const clearRoomCode = () => { setRoomCode( null ); }

    const renderHomePage = () => {
        return (
            <Grid container direction="column" spacing={3} alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3">
                        Spotify Music Player
                    </Typography>
                </Grid>
                <Grid item>
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Link to="/join">
                            <Button color="primary">
                                Join a Room
                            </Button>
                        </Link>
                        <Link to="/create">
                            <Button color="secondary">
                                Create a Room
                            </Button>
                        </Link>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    return (
        <Router>
            <Routes>
                <Route exact path='/' element={ roomCode !== null ? <Navigate to={`/room/${roomCode}`} replace={true} /> : renderHomePage() } /> : 
                <Route path='/join' element={<RoomJoinPage />} />
                <Route path='/create' element={<CreateRoomPage />} />
                <Route 
                    path='/room/:roomCode' 
                    element={<Room leaveRoomCallback={ clearRoomCode } />} 
                />
            </Routes>
        </Router>
    );
}

export default HomePage;