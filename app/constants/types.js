//@flow
import {
  assign,
  random, takeRight,
  isEqual,
  lt,gte
} from 'lodash';
import {
  ROAD_LENGTH,
  NUM_CARS,
  SPACE,
  VF,
  RUSH_LENGTH,
  MEMORY_LENGTH,
  CYCLE,
  GREEN,
  TRIP_LENGTH
} from "./constants.js";

export type Time = number;
export type Loc = number;
export type Cell = number;
export type Measurement = {
  q: number;
  k: number;
  q_temp: number;
  n_temp: number;
};

export type Signals = Array < Signal > ;

export type Cells = Array<Cell>;

export type RootState = {
  time: Time;
  signals: Signals;
  traffic: TrafficState;
  mfd: MFD;
};

export type TrafficState = {
  population: Cars;
  waiting: Cars;
  queueing: Cars;
  history: History;
  moving: Cars;
  cells: Cells;
  measurement: Measurement;
};

export type HistoryDatum = {
  a: number;
  e: number;
  t: Time;
};

export type History = Array < HistoryDatum > ;

export type Cars = Array < Car > ;

export type Action = Object;

export class Car {
  x: Loc;
  id: number;
  moved: number;
  tA: Time;
  constructor(x: number, tA: number, id: number): void {
    assign(this, {
      x,
      id,
      moved: 0,
      tA
    });
  }
  move(x: Loc): void {
    this.x = x;
    this.moved++;
  }
}

export class MFDEntry {
  k: number;
  q: number;
  v: number;
  constructor(k: number, q: number, v: number): void {
    assign(this, {
      k,
      q,
      v
    });
  }
};

export type MFD = Array < MFDEntry > ;

// export class MemoryDatum {
//   a: Time;
//   b: Time;
//   id: number;
//   constructor(a: number, b: number, id: number): void {
//     assign(this, {
//       a,
//       b,
//       id
//     });
//   }
// };

// type

type MemoryDatum = {
  time: number;
  green: bool;
  index: number;
}

export class Signal {
  green: bool;
  lastGreen: number;
  next: Signal;
  x: Loc;
  index: number;
  oA: number;
  memory: Array<MemoryDatum>;
  constructor(index: number, oA: number, x: number): void {
    assign(this, {
      x,
      index,
      oA,
      memory: [],
      lastGreen: 0
    });
  };
  setNext(signal: Signal): void {
    this.next = signal;
  };
  testForGreen(time: number):bool{
    let relTime = time%CYCLE;
    if(this.oA < (this.oA + GREEN)%CYCLE){
      return (relTime < (this.oA + GREEN)%CYCLE) && (relTime >= this.oA);
    } else {
      return (relTime < (this.oA + GREEN)%CYCLE) || (relTime >= this.oA);
    }
  };
  tick(time:number):void{
    if(this.testForGreen(time)) this.green = true;
    else this.green = false;
    if(time%10==0){
      this.memory = takeRight(this.memory,4*CYCLE)
      .concat({green: this.green, time, index: this.index});
    }
  };
};
