//@flow
import { ROAD_LENGTH, NUM_SIGNALS, CYCLE, GREEN, GAP, K0, RESET_FREQUENCY, FRO, BRO } from "../constants/constants.js";
import { map, range, forEach, isEqual } from 'lodash';
import { Signal, MemoryDatum } from '../constants/types';
import type { Action, Signals, Cars, Time } from '../constants/types';
import { TICK } from '../constants/actions';

const EmptyLinks: Array < number > = map(range(NUM_SIGNALS), i => 0);

function retimeSignals(signals: Signals, moving:Cars, time:Time) {
  switch (time % RESET_FREQUENCY) {
    case 0:
      const links:Array<number> = EmptyLinks.slice();
      for (var car of moving) {
        let whichLink = Math.floor(car.x / GAP);
        links[whichLink]++;
      }

      forEach(signals.reverse(), (s,i)=>{
        s.oA = (s.next.oA + (links[i] / GAP > K0 ? BRO : FRO))%CYCLE;
      });

      return signals;

    default:
      return signals;
  }
}

export default function(signals: Signals, moving: Cars, time: Time, action: Action): Signals {
  switch (action.type) {
    case TICK:
      // signals = retimeSignals(signals, moving, time);
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
