import React from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";

export default class App extends React.Component {
    render() {
        return (
            <HomePage />
        );
    }
}

const appDiv = document.getElementById( "app" );
render( <App />, appDiv );