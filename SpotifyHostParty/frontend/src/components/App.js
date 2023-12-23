import { createRoot } from 'react-dom/client';
import React from "react";
import HomePage from "./HomePage";

export default class App extends React.Component {
    render() {
        return (
            <HomePage />
        );
    }
}

const container = document.getElementById( "app" );
const root = createRoot( container );
root.render(<App />);