//@flow
import React from 'react';
import col from "../../style/colors";
import './style-time-plot.scss';
import {flatten,map} from 'lodash';
import { NUM_SIGNALS, CYCLE, GREEN } from "../../constants/constants.js";
import type {Signals,Time} from '../../constants/types';
const { g, rect } = React.DOM;

const WIDTH = 500,
  HEIGHT = 175,
  MAR = 10,
  YDOMAIN = [0, NUM_SIGNALS];

function yScale(v:number):number{
  return HEIGHT * (YDOMAIN[1] - v) / (YDOMAIN[1] - YDOMAIN[0]);
}

function xScale (v:number,time:number):number{
  let a = time - 4*CYCLE,
    b = time;
  return (v - a) / (4*CYCLE) * WIDTH;
}

// const SignalBars = ({ signals, xScale, time }) => {
//
//
//   return signalsRects;
//
//   // return g({
//   //   className: 'g-signals'
//   // }, signalsRects);
// };

type Props = {
  signals: Signals;
  time: Time;
}

class TimePlot extends React.Component{
  props:Props;

  createSignals(){
    let ss = flatten(map(this.props.signals, d => d.memory));
    return map(ss, (d, i) => {
      return rect({
        transform: `translate(${xScale(d.time,this.props.time)},${yScale(d.index)})`,
        className: 'signal-bar ' + (d.green ? 'green' : 'red'),
        key: i,
        width: 12,
        x: -6,
        y: -1,
        height: 2
      });
    });
  };

  render() {
    return (
      <svg width={WIDTH+2*MAR} height={HEIGHT+2*MAR}>
        <g transform={`translate(${MAR},${MAR})`}>
        	<rect width={WIDTH} height={HEIGHT} className='bg'/>
          {this.createSignals()}
        </g>
      </svg>
    );
  }
}

export default TimePlot
