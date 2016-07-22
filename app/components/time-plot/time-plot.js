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
  return (v - time + CYCLE) / CYCLE * WIDTH;
}

const SignalBars = ({ signals, xScale, time }) => {
  let ss = flatten(map(signals, d => d.memory));
  const signalsRects = map(ss, (d, i) => {
    return rect({
      transform: `translate(${xScale(d.a,time)},${yScale(d.id)})`,
      width: xScale(d.b,time) - xScale(d.a,time),
      height: 5,
      className: 'signal-bar',
      key: i,
      y: -5
    });
  });

  return g({
    className: 'g-signals'
  }, signalsRects);
};

type Props = {
  signals: Signals;
  time: Time;
}

class TimePlot extends React.Component{
  props:Props;

  render() {
    return (
      <svg width={WIDTH+2*MAR} height={HEIGHT+2*MAR}>
        <g transform={`translate(${MAR},${MAR})`}>
        	<rect width={WIDTH} height={HEIGHT} className='bg'/>
          <SignalBars
          signals={this.props.signals}
          xScale={xScale}
          time={this.props.time}
          />
        </g>
      </svg>
    );
  }
}

export default TimePlot
