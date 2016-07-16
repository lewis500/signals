//@flow
import { connect } from 'react-redux';
import React,{Component} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import './style-app.scss';
import { timer } from 'd3-timer';
import Road from '../road/road.js';
import {pick} from 'lodash';
import TimePlot from '../time-plot/time-plot.js';
import CumPlot from '../cumulative/cumulative.js';
import MFDPlot from '../mfd-plot/mfd-plot.js';
import type {Loc,RootState,TrafficState,Signal,Time,Car, Cell,MFD,Measurement} from '../../constants/types';
import {actions} from '../../constants/actions';

type Props = {
  signals: Array<Signal>;
  traffic:TrafficState;
  time:Time;
  mfd:MFD;
  tick: Function;
}

class AppComponent extends Component{
  paused = true;
  timer = null;
  props:Props;

  pausePlay = ()=> {
    if (!(this.paused = !this.paused)) {
      this.timer = timer(elapsed => {
        if (this.paused && this.timer) this.timer.stop();
        this.props.tick();
      });
    }
  };

  render() {
    return (
      <div>
        <button onClick={this.pausePlay}>Pause/Play</button>
        <Road signals={this.props.signals} cars={this.props.traffic.moving}/>
        <MFDPlot
          mfd={this.props.mfd}
          measurement={this.props.traffic.measurement} />
        <CumPlot history={this.props.traffic.history} />
      </div>
    );
  }
};

function mapActionsToProps(dispatch:Function):Object{
  return {
    reset(){
      dispatch(actions.reset());
    },
    tick() {
      dispatch(actions.tick());
    }
  };
}

function mapStateToProps(state:RootState):Object{
  return pick(state.a, ['signals', 'traffic', 'time','mfd' ]);
}

export default connect(mapStateToProps, mapActionsToProps)(AppComponent);
