//@flow
import type { RootState, Cars, AState, Time, Action } from '../constants/types';
import { TICK, SET_OFFSET } from '../constants/actions';
import signalsReduce, { SIGNALS_INITIAL } from './reduce-signals';
import { MFD_INITIAL } from './reduce-mfd';
import trafficReduce, { TRAFFIC_INITIAL } from './reduce-traffic';
import { GAP, NUM_SIGNALS } from '../constants/constants';
import { isEqual, groupBy,map,range } from 'lodash';

function timeReduce(time: Time, action: Action): Time {
	return isEqual(action.type, TICK) ? time + 1 : time;
}

const EmptyLinks:Array<number> = map(range(NUM_SIGNALS), i=> 0);

// let links = EmptyLinks.slice();
// for(var car of moving){
//   let i = Math.floor(car.x/GAP);
//   links[i]++;
// }


function aReduce(a: AState, time: Time, action: Action): AState {
	switch(action.type) {
		case TICK:
			let signals = signalsReduce(a.signals, a.traffic.moving, time, action),
				traffic = trafficReduce(a.traffic, signals, time, action);
			return { signals, traffic };
		default:
			return a;
	}
}

const ROOT_INITIAL = {
	time: 0,
	a: {
		signals: SIGNALS_INITIAL,
		traffic: TRAFFIC_INITIAL
	}
};

function root(state: RootState = ROOT_INITIAL, action: Action): RootState {
	let time = timeReduce(state.time, action),
		a = aReduce(state.a, time, action);
	return { time, a };
}

export default root;
