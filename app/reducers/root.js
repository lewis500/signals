//@flow
import signals, { signals_initial } from './reduce-signals';
import traffic, { traffic_initial } from './reduce-traffic';
import mfd, { MFD_INITIAL } from './reduce-mfd';
import type {RootState, Time,Action} from '../constants/types';
// import type {}
import {TICK} from '../constants/actions';

function timeReduce (time:Time = 0, action:Action):Time {
  return action.type == 'TICK' ? time + 1 : time;
};

function root(state:RootState = {
  signals: signals_initial,
  traffic: traffic_initial,
  mfd: MFD_INITIAL,
  time: 0,
  offset: 15
}, action:Action):RootState {
  return {
    signals: signals(state.signals, state.time, action),
    traffic: traffic(state.traffic, state.signals, state.time, action),
    time: timeReduce(state.time, action),
    mfd: mfd(state.mfd, action),
    offset: state.offset
  };
}

export default root;
