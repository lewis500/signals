//@flow
import type { RootState, AState, Time, Action } from '../constants/types';
import { TICK, SET_OFFSET } from '../constants/actions';
import signalsReduce, {SIGNALS_INITIAL} from './reduce-signals';
import mfdReduce, { MFD_INITIAL } from './reduce-mfd';
import trafficReduce, {TRAFFIC_INITIAL} from './reduce-traffic';
import { OFFSET_INITIAL } from '../constants/constants';
import {isEqual} from 'lodash';

function timeReduce(time: Time, action: Action): Time {
  return isEqual(action.type, TICK) ? time + 1 : time;
}

function offsetReduce(offset: number, action: Action): number {
  return isEqual(action.type, SET_OFFSET) ? action.offset : offset;
}

function aReduce(a: AState, time: Time, offset: number, action: Action): AState {
  switch (action.type) {
    case TICK:
      let signals = signalsReduce(a.signals, time, offset, action),
        mfd = mfdReduce(a.mfd, offset, action),
        traffic = trafficReduce(a.traffic, signals, time, action);
      return { signals, mfd, traffic };
    default:
      return a;
  }
}

const ROOT_INITIAL = {
  offset: OFFSET_INITIAL,
  time: 0,
  a: {
    mfd: MFD_INITIAL,
    signals: SIGNALS_INITIAL,
    traffic: TRAFFIC_INITIAL
  }
};

function root(state: RootState=ROOT_INITIAL, action: Action): RootState {
  let time = timeReduce(state.time, action),
    offset = offsetReduce(state.offset, action),
    a = aReduce(state.a, time, offset, action);
  return { time, offset, a };
}

export default root;
