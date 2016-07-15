import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import col from "../../style/colors";
import './style-road';
import { ROAD_LENGTH } from '../../constants/constants.js';
const PT = React.PropTypes;
const { rect, g } = React.DOM;

const RADIUS = 125,
  ROADWIDTH = 10,
  MAR = 20,
  LENGTH = 2 * (RADIUS + MAR + ROADWIDTH);

const rScale = x => x / ROAD_LENGTH * 360;

const Signals = ({ signals }) => {
  const signalsRects = _.map(signals, d => {
    return rect({
      className: 'signal',
      width: 2,
      height: ROADWIDTH*1.2,
      y: -5,
      key: d.index,
      fill: d.green ? col.green["500"] : col.red["500"],
      transform: `rotate(${rScale(d.x)}) translate(0,${RADIUS})`
    });
  });
  return g({
    className: 'g-signals'
  }, signalsRects);
};

const Cars = ({ cars }) => {
  const carRects = _.map(cars, d => rect({
    className: 'cars',
    width: 2,
    height: 5,
    y: -2.5,
    x: -1,
    key: d.id,
    fill: col["light-blue"]["500"],
    transform: `rotate(${rScale(d.x)}) translate(0,${RADIUS})`
  }));
  return g({
    className: 'g-cars'
  }, carRects);
};

const Road = React.createClass({
  proptypes: {
    signals: PT.array,
    cars: PT.array
  },
  render() {
    return (
      <svg width={LENGTH} height={LENGTH}>
        <g transform={`translate(${RADIUS+MAR+ROADWIDTH},${RADIUS+MAR+ROADWIDTH})`}>
          <circle r={RADIUS} className="road" strokeWidth={ROADWIDTH}/>
          <Signals signals={this.props.signals}/>
          <Cars cars={this.props.cars}/>
        </g>
      </svg>
    );
  }
});

export default Road;
