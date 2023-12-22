import React from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from "react-router-dom";

function HomePage() {
    return (
        <Router>
            <Routes>
                <Route exact path='/' element={<p>This is the home page.</p>}>  </Route>
                <Route exact path='/join' element={<RoomJoinPage />} /> 
                <Route exact path='/create' element={<CreateRoomPage />} />
            </Routes>
        </Router>
    );
}

export default HomePage;