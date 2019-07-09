import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';

import './HealthInfo.css';

const getChartInfo = (digest, numServings) => {
  if(numServings === undefined) numServings = 1;

  let data = [];
  for(var i = 0; i < 3; i++) {
    data.push(Math.round(digest[i].total/numServings));
  }

  let chartData = {
    labels: ["Fat (g)", "Carbs (g)", "Protein (g)"],
    datasets: [{
      backgroundColor: ["#FF7272", "#FFDF73", "#C4FF73"],
      data: data
    }]
  };

  let chartOptions = {
    legend: {
      labels: {
        boxWidth: 20,
        fontSize: 12,
        fontFamily: "Cabin",
        fontColor: "white"
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return [chartData, chartOptions];
};

const HealthInfo = props => {

   let caloriesInfo = null;

  if(props.calories && props.yield) {
    caloriesInfo = (<h3 className = "calories">{Math.round(props.calories/props.yield)} calories</h3>);
  } else if(props.calories) {
    caloriesInfo = (<h3 className = "calories">{Math.round(props.calories)} calories</h3>);
  }


  let nutritionChart = null;

  if(props.digest) {
    let chartInfo = getChartInfo(props.digest, props.yield);
    nutritionChart = (
      <div className = "chart">
        <Doughnut data = {chartInfo[0]} options = {chartInfo[1]}/>
      </div>
    );
  }

  return (
    <div className = "health-info">
      <h3 className = "nutrition">{props.yield ? "Nutrition Per Serving" : "Nutrition (entire recipe)"}</h3>
      {caloriesInfo}
      {props.digest ? null : <p>No additional health information.</p>}
      {nutritionChart}
    </div>
  );
};

HealthInfo.propTypes = {
  calories: PropTypes.number,
  digest: PropTypes.array,
  yield: PropTypes.number
};

export default HealthInfo;
