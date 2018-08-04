import React, { Component } from 'react';
import { observer } from "mobx-react";
import { decorate, observable, action } from "mobx";

import Map from './components/Map';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { sessionStored } from 'mobx-stored'


const theme = createMuiTheme({
  palette: {
    primary: { main: '#593d7d' },
    secondary: { main: '#0ef25b' },
  },
});



const defualtStatus = {'status': true};
const alertStatus = sessionStored('status', defualtStatus);

class App extends Component {

  changeAlertStatus = () => {
    alertStatus.status = false;
  }

  render() {

    return (
      <div>
        <MuiThemeProvider theme={theme}>
        <Dialog
          open={alertStatus.status}
          onClose={this.changeAlertStatus}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location. This means sending anonymous location data to
              Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.changeAlertStatus} color="primary">
              Got it.
            </Button>
          </DialogActions>
        </Dialog>
          <Map />
        </MuiThemeProvider>
      </div>
    );
  }
}



export default App;

decorate(App, {
  App: observer,
  alert: observable,
  changeAlertStatus: action
});
