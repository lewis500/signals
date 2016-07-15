//@flow
import { ROAD_LENGTH, NUM_SIGNALS, CYCLE, GREEN, OFFSET } from "../constants/constants.js";
import {map,range,forEach,isEqual} from 'lodash';
import {Signal,MemoryDatum} from '../constants/types';
import type {Action,Signals} from '../constants/types';
import {TICK} from '../constants/actions';

export const signals_initial:Signals = range(NUM_SIGNALS)
  .map(index => {
    let oA = (OFFSET * index) % CYCLE,
      x = Math.round(index / NUM_SIGNALS * ROAD_LENGTH);
    return new Signal(index,oA,x);
  });

for (var signal of signals_initial) {
  let i = signal.index,
    k = signals_initial,
    next = i < (k.length - 1) ? k[i + 1] : k[0];
  signal.setNext(next);
}

export default function(signals:Signals, time:number, action:Action):Signals {
  switch (action.type) {
    case TICK:
      for (var s of signals) {
        if (isEqual(time % CYCLE, s.oA)) {
          s.green = true;
          s.lastGreen = time;
        } else if (isEqual(time % CYCLE,(s.oA + GREEN) % CYCLE)) {
          s.remember(time);
          s.green = false;
        }
      }
      return signals;
    default:
      return signals;
  }
};
