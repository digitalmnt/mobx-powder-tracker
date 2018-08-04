import React, {Component} from 'react';
import { observer } from "mobx-react";
import ReactMapGL, {Marker, NavigationControl} from 'react-map-gl';
import { decorate, observable, runInAction, action } from "mobx";
import fetchJsonp from "fetch-jsonp";
import Weathermodal from './Modal';
import Mnt from './Mnt.png';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  progress: {
    position: 'absolute',
    top : '50%',
    left : '50%',
  },
});




class Map extends Component {
  stations = []
  status = "none" // "none" / "fetching" / "set" / "error"
  width = window.innerWidth;
  height = window.innerHeight;
  stationStatus = "none"; // "none" / "fetching" / "set" / "error"
  weather = [];
  snow = [];
  modalOpen = false;

  async getLocations() {
    this.status = "fetching"
    try {
      const response = await fetchJsonp(`http://api.powderlin.es/stations`)
      const stations = await response.json()
      runInAction(() => {
        this.stations = stations;
        this.status = "set";
      })
    } catch (error) {
      runInAction(() => {
        this.status = "error";
      })
    }
  }




  async showZone(station) {

    try {
      this.modalOpen = true;
      this.stationStatus = "fetching"
      const responseWeather = await fetch('https://api.weather.gov/points/'+ station.location.lat + ',' + station.location.lng + '/forecast');
      const responseSnow = await fetchJsonp('http://api.powderlin.es/station/'+ station.triplet +'?days=90');


      const weather = await responseWeather.json();
      const snow = await responseSnow.json();
      runInAction(() => {
        this.weather = weather;
        this.snow = snow;
        this.stationStatus = "set";
      })
    } catch (error) {
      this.snow = "Error in Request";
      console.log(error)
      runInAction(() => {
        this.stationStatus = "error";
      })
    }
  }







  componentDidMount(){
    this.getLocations();
    window.addEventListener("resize", this.resize);
  }
  renderStationMarker = (station, index) => {
    let stationData = station.location;
    return (
      <Marker key={`marker-${index}`}
        longitude={stationData.lng}
        latitude={stationData.lat}>
        <img src={Mnt} onClick={() => this.showZone(station)} alt=""/>
      </Marker>
    )
  }
  activeStation = "none";
  // renderPopup() {
  //   const station = this.activeStation;
  //   return("<div></div>")
  // }


  resize = () => {
    this.viewport.width = window.innerWidth;
    this.viewport.height = window.innerHeight;
  };
  onViewportChange = viewport => {
    this.viewport = viewport;
  }


 viewport = {
   width: this.width,
   height: this.height,
   latitude: 39.9172036,
   longitude: -105.536042,
   zoom: 8,
   bearing: 0,
   pitch: 0,
 };


  toggleModalStatus = () => {
    this.modalOpen = !this.modalOpen;
  }
  render() {
    const { classes } = this.props;
    const navStyle = {
      position: 'absolute',
      top: 0,
      left: 0
    };
    if (this.status === "none") {
      return(<div></div>)
    } else if (this.status === "fetching") {
      return(
        <div>
          <CircularProgress className={classes.progress}/>
        </div>
      )
    } else if (this.status === "set") {

      const stations = this.stations;
      return (
        <div>
          <div>
            <Weathermodal status={this.stationStatus} modalStatus={this.modalOpen} toggleModal={this.toggleModalStatus} weather={this.weather} snow={this.snow}/>
          </div>
          <div>
            <ReactMapGL mapboxApiAccessToken={process.env.REACT_APP_MAPTOKEN}
            mapStyle="mapbox://styles/mapbox/dark-v9"
            {...this.viewport}
            onViewportChange={this.onViewportChange}
            >
            { stations.map(this.renderStationMarker) }
            <div className="nav" style={navStyle}>
              <NavigationControl onViewportChange={this.onViewportChange} />
            </div>
            </ReactMapGL>
          </div>
        </div>



      );
    } else if (this.status === "error") {
      return (
        <div color="danger">Sorry Map is not Available. Please refresh.</div>
      )
    }
  }
}
decorate(Map, {
  Map: observer,
  status: observable,
  viewport: observable,
  resize: observable,
  width: observable,
  height: observable,
  activeStation: observable,
  stationStatus: observable,
  weather: observable,
  snow: observable,
  toggleModalStatus: action,
  modalOpen: observable
});


export default withStyles(styles)(Map);
