import React, { Component } from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  Crosshair
} from "react-vis";
import { observer } from "mobx-react";
import { decorate, observable, action } from "mobx";
import '../../node_modules/react-vis/dist/style.css';


//Used this example:  https://github.com/uber/react-vis/blob/master/showcase/plot/line-chart-with-style.js
class Graph extends Component {

  currentIndex = 0;
  keyIndex = 0;


  render() {
    const keyStyle = {
      background: '#fff',
      border: 'solid 1px #593d7d',
      color: '#593d7d',
      padding: '10px',
      position: 'absolute',
      left: this.keyIndex
    }
    if (this.props.data) {
      const dataSnow = this.props.data.map((d, i)=> {
        return {
          x0: new Date(d.Date).getTime(),
          x: new Date(d.Date).getTime(),
          y: Number(d["Snow Depth (in)"])
        }
      });
      const dataTemp = this.props.data.map((d, i)=> {
        return {
          x0: new Date(d.Date).getTime(),
          x: new Date(d.Date).getTime(),
          y: Number(d["Observed Air Temperature (degrees farenheit)"])
        }
      });

      return (
        <XYPlot
          xType="time"
          width={window.innerWidth * .7}
          height={window.innerHeight * .6}>
          <HorizontalGridLines style={{stroke: '#e9e9e9'}}/>
          <VerticalGridLines style={{stroke: '#e9e9e9'}}/>
          <XAxis title="Date" style={{
            line: {stroke: '#ADDDE1'},
            ticks: {stroke: '#ADDDE1'},
            text: {stroke: 'none', fill: '#6b6b76', fontWeight: 600}
          }}/>
          <Crosshair values={dataSnow}>
            <div style={keyStyle}>
              <div>Date: {new Date(dataSnow[this.currentIndex].x).toLocaleDateString("en-US")}</div>
              <div>Snow Depth: {dataSnow[this.currentIndex].y}in</div>
              <div>Temperature: <span className="tempColor">{dataTemp[this.currentIndex].y}F</span></div>
            </div>
          </Crosshair>
          <YAxis />
          <LineSeries
          color="#593d7d"
          onNearestX={(datapoint, event)=>{
            this.currentIndex = event.index;
            this.keyIndex = event.innerX;
          }}
            className="first-series"
            data={dataSnow}
            style={{
              strokeLinejoin: 'round',
              strokeWidth: 2,
            }}
          />
          <LineSeries
            color="#6CF79B"
            data={dataTemp}
          />
        </XYPlot>

      );
    } else {
      return(<div></div>);
    }

  }
}


decorate(Graph, {
  Graph: observer,
  currentIndex: observable,
  keyIndex: observable,
  onNearestX: action,
  onValueMouseEnter: action

});

export default Graph;
