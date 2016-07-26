//@flow
import { ROAD_LENGTH, NUM_SIGNALS, CYCLE, GREEN, GAP, K0, UPDATE_FREQUENCY, FRO, BRO } from "../constants/constants.js";
import { map, sum, range, forEach, isEqual,lt,gte } from 'lodash';
import { Signal } from '../constants/types';
import type { Action, Signals, Cars, Time } from '../constants/types';
import { TICK } from '../constants/actions';
const EmptyLinks: Array < number > = map(range(NUM_SIGNALS), i => 0);

const doubleMod = (a,b)=> (a%b + b)%b;

function retimeSignals(signals: Signals, moving:Cars, time:Time):void {
  if (time %UPDATE_FREQUENCY == 0) {
      const links:Array<number> = EmptyLinks.slice();

      //count the accumulations
      for (var car of moving) links[Math.floor(car.x / GAP)]++;

      //turn accumulations into densities
      for (var i = 0; i < links.length; i++) links[i] = links[i]/GAP;

      //now calculate preliminary relative offsets
      const ROs = map(links, l=> l > K0 ? BRO : FRO);
      console.log(ROs);

      //now get the total extra
      const extra = Math.round((sum(ROs)%CYCLE)/NUM_SIGNALS);

      //calculate corrected ROs
      const ROsCorrected = map(ROs, d=> d-extra);

      //now make the absolute offsets
      let oA = 0;
      forEach(signals.reverse(), (s,i,k)=>{
        oA = doubleMod(oA + ROsCorrected[i], CYCLE);
        k[i].oA = oA;
      });

    }
}

export default function(signals: Signals, moving: Cars, time: Time, action: Action): Signals {
  switch (action.type) {
    case TICK:
      // retimeSignals(signals, moving, time);
      for(var s of signals) s.tick(time);
      return signals;
    default:
      return signals;
  }
};

export const SIGNALS_INITIAL: Signals = range(NUM_SIGNALS)
  .map(index => {
    let oA = Math.round(doubleMod(FRO * index, CYCLE)),
      x = Math.round(index / NUM_SIGNALS * ROAD_LENGTH);
    return new Signal(index, oA, x);
  });

forEach(SIGNALS_INITIAL, function(signal, i, k): void {
  let next = i < (k.length - 1) ? k[i + 1] : k[0];
  signal.setNext(next);
});
