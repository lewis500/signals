//@flow
import { ROAD_LENGTH, NUM_SIGNALS, CYCLE, GREEN, OFFSET_INITIAL, FRO, BRO } from "../constants/constants.js";
import { map, range, forEach, isEqual } from 'lodash';
import { Signal, MemoryDatum } from '../constants/types';
import type { Action, Signals } from '../constants/types';
import { TICK } from '../constants/actions';

export const SIGNALS_INITIAL: Signals = range(NUM_SIGNALS)
  .map(index => {
    let oA = (FRO * index) % CYCLE,
      x = Math.round(index / NUM_SIGNALS * ROAD_LENGTH);
    return new Signal(index, oA, x);
  });

forEach(SIGNALS_INITIAL, function(signal, i, k): void {
  let next = i < (k.length - 1) ? k[i + 1] : k[0];
  signal.setNext(next);
});

function signalsBlah(signals, time) {
  switch (time % RESET_FREQUENCY) {
    case 0:
      for(var s of signals){
        let newOA = calculate(s);
        let Δ = (newOA - s.oA);
        s.
      }
    default:
      return signals;
  }

}

export default function(signals: Signals, time: number, action: Action): Signals {
  switch (action.type) {
    case TICK:
      for (var s of signals) {
        if (isEqual(time % CYCLE, s.oA)) {
          s.green = true;
          s.lastGreen = time;
        } else if (isEqual(time % CYCLE, (s.oA + GREEN) % CYCLE)) {
          s.remember(time);
          s.green = false;
        }
      }
      return signals;
    default:
      return signals;
  }
};
