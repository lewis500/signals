//@flow
import { ROAD_LENGTH, NUM_CARS, SPACE, VF, RUSH_LENGTH, MEMORY_LENGTH, TRIP_LENGTH } from "../constants/constants.js";
import {range,random,partition,concat,sortBy} from 'lodash';
import { sum } from 'd3-array';
import {Car,HistoryDatum} from '../constants/types';
import type {Loc,Action,Time,Signal,Cars,Cell,CarState,Measurement} from '../constants/types';
import {TICK} from '../constants/actions';

const population:Cars = range(NUM_CARS)
  .map(i=>{
    const x:Loc = random(0, ROAD_LENGTH - 1),
      tA:Time = RUSH_LENGTH * i / NUM_CARS;
    return new Car(x, tA, i);
  });


export const cars_initial:CarState = {
  population,
  waiting: population,
  moving: [],
  queueing: [],
  history: [],
  exited: [],
  cells: range(ROAD_LENGTH).map(x => -SPACE),
  measurement: { q: 0, k: 0 },
  q: 0,
  n: 0
};

function reduceCars(cars:CarState, signals:Array<Signal>, time:Time, action:Action):CarState {
  switch(action.type){
    case TICK:
      let moving = sortBy(cars.moving, 'x');
      const taken = Array(ROAD_LENGTH);
      const cells = cars.cells;
      let { q, n } = cars;

      for (var s of signals) taken[s.x] = !s.green;

      const [newQueueing, waiting] = partition(cars.waiting, c => c.tA <= time);

      let queueing = concat(newQueueing, cars.queueing),
        entering = [];

      [entering, queueing] = partition(queueing, c => {
        if (taken[c.x]) return false;
        else {
          q++;
          return (taken[c.x] = true);
        }
      });

      for (var c of moving) {
        let nextSpace = (c.x + 1) % ROAD_LENGTH;
        if (!taken[nextSpace] && ((time - cells[nextSpace]) > SPACE)) {
          c.x = nextSpace;
          c.moved++;
          q++;
        }
        cells[c.x] = time;
      }

      n += moving.length + entering.length;
      if (time % MEMORY_LENGTH === 0) {
        cars.measurement.k = n / ROAD_LENGTH / MEMORY_LENGTH;
        cars.measurement.q = q / ROAD_LENGTH / MEMORY_LENGTH;
        n = 0;
        q = 0;
      }

      let exiting = [];
      [moving, exiting] = partition(moving, d => d.moved <= TRIP_LENGTH);

      const exited = concat(cars.exited, exiting);

      let history = [
        ...cars.history,
        new HistoryDatum(time, NUM_CARS - waiting.length, exited.length)
      ];

      moving = concat(moving, entering);

      for (var c of moving) cells[c.x] = time;

      return {
        ...cars,
        moving,
        queueing,
        waiting,
        exited,
        history,
        q,
        n
      };
    default:
      return cars;
  }
};

export default reduceCars
