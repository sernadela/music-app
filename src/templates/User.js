import React, { Component } from 'react';
import API from '../api';


export default class UserList extends Component {
  constructor(props) {
    super(props);
    this.updateUserList = this.updateUserList.bind(this);
  }
  state = {
    users: [],
    selectedUser: '',
    songs: [],
    selectedSong: ''
  }

  updateUserList = function () {
    API.get(`users`)
      .then(res => {
        const users = res.data;
        if (users.length !== 0) {
          this.setState({ users });
          this.props.callbackFromParent(users[0].id);
          this.setState({ selectedUser: users[0].id });
        }
      })
  }

  updateUserFavSongs = function () {
    //console.log(this.state.selectedUser);
    if (this.state.selectedUser) {
      API.get(`fav/user/${this.state.selectedUser}`)
        .then(res => {
          //console.log(res.data);
          const data = res.data;
          this.setState({ songs: data });
        })
    }
  }

  handleChange = event => {
    event.preventDefault();
    //let user = this.state.users.find(function (obj) { return obj.id === +event.target.value; });
    //console.log(user);
    this.setState({ selectedUser: event.target.value }, () =>
      this.updateUserFavSongs());
    this.props.callbackFromParent(event.target.value);
  }

  handleChangeFavSongs = event => {
    event.preventDefault();

    this.setState({ selectedSong: event.target.value }, () =>
      console.log(this.state.selectedSong));
  }

  handleClick = event => {
    event.preventDefault();

    API.delete(`users/${this.state.selectedUser}`)
      .then(res => {
        console.log(res.data);
        this.updateUserList();
      })

  }

  handleClickAddFavSong = event => {
    event.preventDefault();

    //console.log('delete (favorite) song ' + this.state.selectedSong + ' from user ' + this.state.selectedUser);

    if (this.state.selectedUser && this.state.selectedSong) {
      API.delete(`fav/user/${this.state.selectedUser}/song/${this.state.selectedSong}`)
        .then(res => {
          console.log(res.data);
          // update list
          this.updateUserFavSongs();
        })
    }
  }

  componentDidMount() {
    this.updateUserList();
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-6">
            <form>
              <div className="form-group">
                <label><h4>Users</h4></label>
                <select className="form-control" id="selectUsers" name="users" size="8" onChange={this.handleChange}>
                  {this.state.users.map(user => <option key={user.id.toString()} value={user.id}> {user.username} ({user.email}) {user.songs}</option>)}
                </select>
              </div>
              <button type="submit" onClick={this.handleClick} className="btn btn-danger">Delete User</button>
            </form>
            <br></br>
            <UserAdd callbackFromParent={this.updateUserList} />
          </div>
          <div className="col-6">
            <form>
              <div className="form-group">
                <label><h4>User Favorite Songs</h4></label>
                <select className="form-control" id="selectFav" name="favs" size="8" onChange={this.handleChangeFavSongs}>
                  {this.state.songs.map(song => <option key={song.pk.toString()} value={song.pk.toString()}> {song.fields.title} ({song.fields.artist}, {song.fields.album})</option>)}
                </select>
              </div>
              <button type="submit" onClick={this.handleClickAddFavSong} className="btn btn-danger">Delete Favorite Song</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export class UserAdd extends Component {

  handleSubmit = event => {
    event.preventDefault();

    const user = {
      username: this.refs.username.value,
      email: this.refs.email.value
    };
    //console.log(user);

    API.post(`users/`, user)
      .then(res => {
        console.log(res.data);
        // update users list
        this.props.callbackFromParent();
        // reset values
        this.refs.username.value = '';
        this.refs.email.value = '';
      })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label><h4>Create New User</h4></label>
            <div className="form-group">
              <label>Username </label>
              <input ref="username" type="text" name="username" className="form-control" id="inputUsername" placeholder="Username" />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input type="email" ref="email" name="email" className="form-control" id="inputUserEmail" aria-describedby="emailHelp" placeholder="Email" />
              <small id="emailHelp" className="form-text text-muted">Please enter a valid email address.</small>
            </div>
            <button type="submit" onSubmit={this.handleSubmit} className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    )
  }
}
