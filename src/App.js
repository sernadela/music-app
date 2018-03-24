import React, { Component } from 'react';
import MusicApp from './templates/MusicApp';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Music App</h1>
        </header>
        <p className="App-intro"></p>
        <div className="App-main">
          <div className="container">
            <MusicApp />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

