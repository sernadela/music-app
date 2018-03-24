import React, { Component } from 'react';
import API from '../api';
import UserList from './User';
import SongList from './Song';


export default class MusicApp extends Component {

  state = {
    user: '',
    song: ''
  }

  handleSubmit = event => {
    event.preventDefault();

    const data = {
      'id': +this.state.song
    }

    console.log(this.state.song);
    console.log(this.state.user);

    API.post(`fav/user/${this.state.user}/song`, data)
      .then(res => {
        this.refs.userChild.updateUserFavSongs();
      })
  }

  userCallback = (dataFromChild) => {
    //console.log('dataFromChild user');
    //console.log(dataFromChild);
    this.setState({ user: dataFromChild });
  }

  songCallback = (dataFromChild) => {
    //console.log('dataFromChild song');
    //console.log(dataFromChild);
    this.setState({ song: dataFromChild });
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-6">
            <UserList callbackFromParent={this.userCallback} ref="userChild" />
          </div>
          <div className="col-6">
            <h4>Songs</h4>
            <button type="submit" onClick={this.handleSubmit} className="btn btn-warning">Add Favorite Song</button>
            <SongList callbackFromParent={this.songCallback} />
          </div>
        </div>
      </div>
    )
  }
}