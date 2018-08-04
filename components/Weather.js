import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: '1%'
  },
  paper: {
    padding: theme.spacing.unit * 3,
  },
});
//Used this example:  https://github.com/uber/react-vis/blob/master/showcase/plot/line-chart-with-style.js
class Weather extends Component {

  renderWeather = (period, index) => {
      const { classes } = this.props;
      return (
        <div className={classes.root} key={index}>
          <Grid container>
            <Paper className={classes.root}>
              <Grid item xs={8}>{period.name} - {period.temperature}{period.temperatureUnit}</Grid>
              <Grid item xs={4}><img src={period.icon} alt="Weather"/></Grid>
              <Grid item xs={12}>
                  <p>{period.detailedForecast}</p>
                  <p>Wind - {period.windSpeed}</p>
              </Grid>
            </Paper>
          </Grid>
        </div>
      )
  }
  render() {
    const data = this.props.data.properties;
    const properties = data.periods;

    return(
      <div>
        { properties.map(this.renderWeather) }
      </div>
    )
  }
}

export default  withStyles(styles)(Weather);
