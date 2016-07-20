//@flow
import React from 'react';
import col from "../../style/colors";
import './style-time-plot.scss';
import {flatten,map} from 'lodash';
import { NUM_SIGNALS, CYCLE, GREEN, OFFSET } from "../../constants/constants.js";
import type {Signals,Time} from '../../constants/types';
const { g, rect } = React.DOM;

const WIDTH = 250,
  HEIGHT = 175,
  MAR = 10,
  YDOMAIN = [0, NUM_SIGNALS];

function yScale(v:number):number{
  return HEIGHT * (YDOMAIN[1] - v) / (YDOMAIN[1] - YDOMAIN[0]);
}

const SignalBars = ({ signals, xScale }) => {
  let ss = flatten(map(signals, d => d.memory));
  const signalsRects = map(ss, (d, i) => {
    return rect({
      transform: `translate(${xScale(d.a)},${yScale(d.id)})`,
      width: xScale(d.b) - xScale(d.a),
      height: 5,
      className: 'signal-bar',
      key: d.id,
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

  xScale(v:number) {
    return (v - this.props.time + CYCLE) / CYCLE * WIDTH;
  };

  render() {
    return (
      <svg width={WIDTH+2*MAR} height={HEIGHT+2*MAR}>
        <g transform={`translate(${MAR},${MAR})`}>
        	<rect width={WIDTH} height={HEIGHT} className='bg'/>
          <SignalBars signals={this.props.signals} xScale={this.xScale}/>
        </g>
      </svg>
    );
  }
}

export default TimePlot
