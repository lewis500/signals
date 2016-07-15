//@flow
import React from 'react';
import col from "../../style/colors";
import './style-cum-plot.scss';
import _ from 'lodash';
import { NUM_SIGNALS, CYCLE, GREEN, OFFSET, RUSH_LENGTH, NUM_CARS } from "../../constants/constants";
import {HistoryDatum} from '../../constants/types';
const { g, rect } = React.DOM;
const PT = React.PropTypes;

const WIDTH = 250,
  HEIGHT = 175,
  MAR = 10;

type Props = {
  history: Array<HistoryDatum>
}

function xScale(v:number):number{
  return v/ (RUSH_LENGTH*1.2) * WIDTH
}

function yScale(v:number):number{
  return (NUM_CARS - v) / NUM_CARS * HEIGHT;
}

function pathMaker(data:Array<any>, xVar:string, yVar:string):string {
  let i = data.length,
    points = new Array(i);
  while (i--) {
    points[i] = [
      xScale(data[i][xVar]),
      yScale(data[i][yVar])
    ];
  }
  return "M" + points.join("L");
}

class CumPlot extends React.Component{
  props: Props;

  render() {
    let history = this.props.history;
    return (
      <svg width={WIDTH+2*MAR} height={HEIGHT+2*MAR}>
        <g transform={`translate(${MAR},${MAR})`}>
          <rect width={WIDTH} height={HEIGHT} className='bg'/>
          <path d={pathMaker(history, 't','a')} className='plot arrivals'/>
          <path d={pathMaker(history, 't','e')} className='plot exits'/>
        </g>
      </svg>
    );
  }
}

export default CumPlot
