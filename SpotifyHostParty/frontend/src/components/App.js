import React from "react";
import { render } from "react-dom";

export default class App extends React.Component {
    render() {
        return ( <h1>Testing</h1> );
    }
}

const appDiv = document.getElementById( "app" );
render( <App />, appDiv );