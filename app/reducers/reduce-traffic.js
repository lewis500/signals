//@flow
import { ROAD_LENGTH, NUM_CARS, SPACE, VF, RUSH_LENGTH, MEMORY_LENGTH, TRIP_LENGTH } from "../constants/constants.js";
import { range, filter, isEqual, forEach, random, partition, concat, sortBy } from 'lodash';
import { sum } from 'd3-array';
import { Car, HistoryDatum } from '../constants/types';
import type { Loc, History, Action, Time, Signal, Cars, Signals, Cell, TrafficState, Measurement } from '../constants/types';
import { TICK } from '../constants/actions';

const population: Cars = range(NUM_CARS)
	.map(i => {
		const x: Loc = random(0, ROAD_LENGTH - 1),
			tA: Time = RUSH_LENGTH * i / NUM_CARS;
		return new Car(x, tA, i);
	});

let emptyCars: Cars = [];
let emptyHistory: History = [];

export const TRAFFIC_INITIAL = {
	population,
	waiting: population,
	moving: emptyCars,
	queueing: emptyCars,
	history: emptyHistory,
	cells: range(ROAD_LENGTH)
		.map(x => -SPACE),
	measurement: { q: 0, k: 0, q_temp: 0, n_temp: 0 }
};

function reduceTraffic(traffic: TrafficState, signals: Signals, time: Time, action: Action): TrafficState {
	switch(action.type) {
		case TICK:
			let movingNew = sortBy(traffic.moving, 'x'),
				taken = Array(ROAD_LENGTH),
				{ waiting, cells, queueing, measurement, history } = traffic,
				{ q_temp, n_temp, q, k } = traffic.measurement,
				queueingNew: Cars = [];

			//take care of the signals
			for(let s of signals) taken[s.x] = !s.green;

			function processCar(car: Car): void {
				if(!taken[car.x]) {
					taken[car.x] = true; //it's taken
					movingNew.push(car);
				} else queueingNew.push(car);
			}

			//get waiting and new entering
			let [arriving, waitingNew] = partition(waiting, car => car.tA <= time);

			//let queueing traffic get in first priority
			forEach(queueing, processCar);
			forEach(arriving, processCar);

			//process the moving traffic
			for(var car of movingNew) {
				let nextSpace = (car.x + 1) % ROAD_LENGTH;
				if(!taken[nextSpace] && ((time - cells[nextSpace]) > SPACE)) {
					car.move(nextSpace);
					q_temp++;
				}
				cells[car.x] = time;
			}

			n_temp += movingNew.length;

			if(isEqual(time % MEMORY_LENGTH, 0)) {
				k = n_temp / ROAD_LENGTH / MEMORY_LENGTH;
				q = q_temp / ROAD_LENGTH / MEMORY_LENGTH;
				n_temp = 0;
				q_temp = 0;
			}

			history.push(
				new HistoryDatum(
					NUM_CARS - waitingNew.length - queueingNew.length,
					NUM_CARS - waitingNew.length - movingNew.length - queueingNew.length,
					time)
			);

			//take care of the time stuff
			for(var c of movingNew) cells[c.x] = time;

			//get rid of the exited people
			movingNew = filter(movingNew, d => d.moved <= TRIP_LENGTH);

			return {
				...traffic,
				moving: movingNew,
				queueing: queueingNew,
				waiting: waitingNew,
				measurement: {
					q,
					k,
					q_temp,
					n_temp
				}
			};

		default:
			return traffic;
	}
};

export default reduceTraffic
