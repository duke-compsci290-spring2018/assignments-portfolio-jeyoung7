import React, { Component } from 'react';
import logo from './logo.svg';
import Unit from './components/Unit.js';
import './App.css';
import Photos from './images/photos.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import UnitModal from './components/UnitModal.js';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = { isOpen: false,
        url: null,
        id: null,
            index: 0,
        photos: [],
            colors: [],
            selected: '',
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.nextPhoto = this.nextPhoto.bind(this);
        this.lastPhoto = this.lastPhoto.bind(this);

    }
    toggleModal = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            url: null,
            id: null
        });
    };

    updateCurrent = (photo) => {
        console.log(photo);
        this.setState({
            isOpen: !this.state.isOpen,
            url: photo.url,
            id: photo.id,
            index: photo.id-1
        });
    };
    componentWillMount() {
        var colors = [];
        colors.push("all");
        for (var i = 0; i<Photos.length; i++)
        {
            if (colors.indexOf(Photos[i].color)<0) {

                colors.push(Photos[i].color);
            }
        }
        console.log(colors);
        this.setState({
            photos: Photos,
            colors: colors
        });

    }
    nextPhoto () {
            var newIndex = this.state.index + 1;

            this.setState({
                url: this.state.photos[newIndex].url,
                id: this.state.photos[newIndex].id,
                index: newIndex

            });

    }
    lastPhoto () {
        var newIndex = this.state.index - 1;

        this.setState({
            url: this.state.photos[newIndex].url,
            id: this.state.photos[newIndex].id,
            index: newIndex

        });

    }
    renderPhoto(photo,index) {
        var click = this.updateCurrent.bind(this,photo);
        return (<div className="col-sm-3"  onClick={click}> <Unit id={photo.id} key={index} url={photo.url} />
    </div>);
    }
    handleChange(event) {
        if (event.target.value === 'all')
        {
            this.state.photos = Photos;
            this.setState({selected: event.target.value});

        }
        else {
            this.state.photos = Photos;
            var newPhotos =[];
            for (var i = 0; i<this.state.photos.length; i++)
            {
                console.log(this.state.photos[i]);
                if (this.state.photos[i].color=== event.target.value) {
                    newPhotos.push(this.state.photos[i]);
                }
            }
            this.setState({selected: event.target.value, photos: newPhotos});

        }
    }
  render() {
    return (
      <div className="App ">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
          <div className="container-fluid">
          <div className="row row-t ">
              {this.state.photos.map((photo,index) => this.renderPhoto(photo,index))}
              <UnitModal  id={this.state.id} url={this.state.url} show={this.state.isOpen}
                          onClose={this.toggleModal}  index={this.state.index} maxIndex={this.state.photos.length}  nextPhoto={this.nextPhoto} lastPhoto={this.lastPhoto}
              >
                  Here's some content for the modal

              </UnitModal>
              <select value={this.state.selected} onChange={this.handleChange.bind(this)}> {this.state.colors.map(function(color) {
                  return ( <option key={color} value={color}>{color}</option>)
              })}  </select>
          </div>
          </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
