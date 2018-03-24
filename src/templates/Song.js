import React, { Component } from 'react';
import API from '../api';


export default class SongList extends Component {
  constructor(props) {
    super(props);
    this.updateSongList = this.updateSongList.bind(this);
  }
  state = {
    songs: [],
    selectedSong: ''
  }

  updateSongList = function () {
    API.get(`songs`)
      .then(res => {
        const songs = res.data;
        if (songs.length !== 0) {
          this.setState({ songs });
          this.setState({ selectedSong: songs[0].id });
          this.props.callbackFromParent(songs[0].id);
        }
      })
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({ selectedSong: event.target.value });
    this.props.callbackFromParent(event.target.value);
  }

  handleClick = event => {
    event.preventDefault();

    if (this.state.selectedSong !== '') {
      API.delete(`songs/${this.state.selectedSong}`)
        .then(res => {
          console.log(res.data);
          this.updateSongList();
        })
    }
  }

  componentDidMount() {
    this.updateSongList();
  }

  render() {
    return (
      <div>
        <form>
          <div className="form-group">
          <label></label>
            <select className="form-control" id="selectSongs" name="songs" size="5" onChange={this.handleChange}>
              {this.state.songs.map(song => <option key={song.id.toString()} value={song.id}> {song.title} ({song.artist}, {song.album}) </option>)}
            </select>
          </div>
          <button type="submit" onClick={this.handleClick} className="btn btn-danger">Delete Song</button>
        </form>
        <br></br>
        <SongAdd callbackFromParent={this.updateSongList} />
      </div>
    )
  }
}

export class SongAdd extends Component {

  handleSubmit = event => {
    event.preventDefault();

    const song = {
      title: this.refs.title.value,
      artist: this.refs.artist.value,
      album: this.refs.album.value
    };
    console.log(song);

    API.post(`songs/`, song)
      .then(res => {
        console.log(res);
        console.log(res.data);
        // update songs list
        this.props.callbackFromParent();
        // reset values
        this.refs.title.value = '';
        this.refs.artist.value = '';
        this.refs.album.value = '';
      })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
        <div className="form-group">
            <label><h4>Create New Song</h4></label>
          <div className="form-group">
            <label>Song Title </label>
            <input ref="title" type="text" name="title" className="form-control" id="inputSongTitle" placeholder="Title" />
          </div>
          <div className="form-group">
            <label>Artist </label>
            <input ref="artist" type="text" name="artist" className="form-control" id="inputSongArtist" placeholder="Artist" />
          </div>
          <div className="form-group">
            <label>Album </label>
            <input ref="album" type="text" name="album" className="form-control" id="inputSongAlbum" placeholder="Album" />
          </div>
          <button type="submit" onSubmit={this.handleSubmit} className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    )
  }
}


