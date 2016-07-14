//@flow
import { VF, Q0, KJ, W, CYCLE, ROAD_LENGTH, GREEN, OFFSET, NUM_SIGNALS } from '../constants/constants';
import {assign, map, flatMap, range, min } from 'lodash';
const DISTANCE = ROAD_LENGTH / NUM_SIGNALS;
import {MFDEntry} from '../constants/types';
import type {Action,MFD} from '../constants/types';

class TableEntry {
  t: number;
  c: number;
  g: number;
  constructor(i) {
    const v = (i < 0 ? -W : VF),
      x = DISTANCE * i,
      travel_time = x / v,
      e = travel_time - i * OFFSET,
      g = GREEN - e,
      green = Math.max(g, 0),
      t = travel_time + CYCLE - e,
      c = Q0 * green + Math.max(0, -x * KJ);
    assign(this, {t,c,g});
  }
}

function loopOverEntries(direction) {
  let [g, i, res] = [999, 0, []];
  while ((g > 0) && (Math.abs(i) < 100)) { //MAKE SURE THAT G IS DECLINING?
    const entry = new TableEntry(i);
    g = entry.g;
    res.push(entry);
    if (direction === 'forward') i++;
    else i--;
  }
  return res;
}

function findMin(k:number, table:Array<TableEntry>) {
  const costs = map(table, entry => (entry.c + entry.x * k) / entry.t);
  let q = min([...costs, VF * k, W * (KJ - k)]),
    v = k > 0 ? q / k : 0;
  return new MFDEntry(k, q, v);
}

const table = flatMap(['forward', 'backward'], loopOverEntries);

export const MFD_INITIAL:MFD = range(.01, 1.01, .01).map(k => findMin(k, table));

export default function reduceMFD(mfd:MFD, action:Action) {
  switch(action.type){
    case 'FIND_MFD':
      const table = flatMap(['forward', 'backward'], loopOverEntries);
      return range(.01, 1.01, .01).map(k => findMin(k, table));
    default:
      return mfd;
  }
}
