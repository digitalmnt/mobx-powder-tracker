import React from 'react';
import Modal from 'react-modal';
import { observer } from "mobx-react";
import { decorate, observable, action } from "mobx";
import Graph from './Graph';
import Weather from './Weather';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

//TABS
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';










function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}





const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width: '80%',
    height: '80%'
  }
};
Modal.setAppElement('#root')


class Weathermodal extends React.Component {


  tab = "one";

  handleChange = (event, value) => {
    this.tab = value;
  }


  render() {
    const snowData = this.props.snow.data;
    const stationData = this.props.snow.station_information;
    const weather = this.props.weather;
    return (

      <div>

        <Modal
          isOpen={this.props.modalStatus}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div>
            <Button variant="raised" color="primary" onClick={this.props.toggleModal}>Close</Button>
            {this.props.status === "fetching" ?
              <div></div>
              : this.props.status === "set" ?
                <div>{stationData.name}</div>
              :
              <div>Apologies please try again</div>
            }
            <AppBar position="static">
              <Tabs value={this.tab} onChange={this.handleChange}>
                <Tab value="one" label="Weather" />
                <Tab value="two" label="Historical Snow Data" />
              </Tabs>
            </AppBar>
            {this.tab === 'one' && <TabContainer>
              {this.props.status === "fetching" ?
              <div color="primary">
                <CircularProgress />
              </div>
                : this.props.status === "set" ?
                <Weather data={weather}/>
                :
                <div>Apologies please try again</div>
              }
            </TabContainer>}
            {this.tab === 'two' && <TabContainer>
              {this.props.status === "fetching" ?
              <div color="primary">
                <CircularProgress />
              </div>
                : this.props.status === "set" ?
                <Graph data={snowData}/>
                :
                <div>Apologies please try again</div>
              }
            </TabContainer>}
          </div>
        </Modal>
      </div>
    );
  }
}

export default Weathermodal;

decorate(Weathermodal, {
  Weathermodal: observer,
  modalStatus: observable,
  snow: observable,
  weather: observable,
  tab: observable,
  handleChange: action

});
