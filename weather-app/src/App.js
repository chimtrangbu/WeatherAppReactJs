import React, { Component } from 'react';
import './App.css';
import Autocomplete from "./components/autocomplete";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Autocomplete />
        </div>
      </div>
    );
  }
}

export default App;
