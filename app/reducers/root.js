//@flow
import type { RootState, Cars, Time, Action } from '../constants/types';
import { TICK, SET_OFFSET } from '../constants/actions';
import signalsReduce, { SIGNALS_INITIAL } from './reduce-signals';
import { MFD_INITIAL } from './reduce-mfd';
import trafficReduce, { TRAFFIC_INITIAL } from './reduce-traffic';
import { GAP, NUM_SIGNALS } from '../constants/constants';
import { isEqual, groupBy,map,range } from 'lodash';

const ROOT_INITIAL = {
	time: -1,
	signals: SIGNALS_INITIAL,
	traffic: TRAFFIC_INITIAL,
	mfd: MFD_INITIAL,
};

function tick(state:RootState,action):RootState{
	const time = state.time+1,
		signals = signalsReduce(state.signals, state.traffic.densities, time, action),
		traffic = trafficReduce(state.traffic, signals, time, action);
	return {...state, signals, traffic , time };

}

function rootReduce(state: RootState = ROOT_INITIAL, action: Action): RootState {
	switch(action.type) {
		case TICK:
			for (var i = 0; i < 5; i++) {
				state = tick(state,action);
			}
			return state;
		default:
			return state;
	}
}

export default rootReduce;
