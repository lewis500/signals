//@flow
import type { RootState, Cars, Time, Action } from '../constants/types';
import { TICK, SET_OFFSET } from '../constants/actions';
import signalsReduce, { SIGNALS_INITIAL } from './reduce-signals';
import { MFD_INITIAL } from './reduce-mfd';
import trafficReduce, { TRAFFIC_INITIAL } from './reduce-traffic';
import { GAP, NUM_SIGNALS } from '../constants/constants';
import { isEqual, groupBy,map,range } from 'lodash';

const ROOT_INITIAL = {
	time: 0,
	signals: SIGNALS_INITIAL,
	traffic: TRAFFIC_INITIAL,
	mfd: MFD_INITIAL
};


function rootReduce(state: RootState = ROOT_INITIAL, action: Action): RootState {
	switch(action.type) {
		case TICK:
			let time = state.time+1,
				signals = signalsReduce(state.signals, state.traffic.moving, time, action),
				traffic = trafficReduce(state.traffic, signals, time, action);
			return { ...state, signals, traffic , time };
		default:
			return state;
	}
}


// function root(state: RootState = ROOT_INITIAL, action: Action): RootState {
// 	let time = timeReduce(state.time, action),
// 		a = aReduce(state.a, time, action);
// 	return { time, a };
// }

export default rootReduce;
