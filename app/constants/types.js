//@flow
import {
  assign,
  random
} from 'lodash';
import {
  ROAD_LENGTH,
  NUM_CARS,
  SPACE,
  VF,
  RUSH_LENGTH,
  MEMORY_LENGTH,
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
  offset: number;
  a: AState;
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

export type AState = {
	signals: Signals;
	traffic: TrafficState;
	mfd: MFD;
};

export class HistoryDatum {
  a: number;
  e: number;
  t: Time;
  constructor(a: number, e: number, t: Time): void {
    assign(this, {
      a,
      e,
      t
    });
  }
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

export class MemoryDatum {
  a: Time;
  b: Time;
  id: number;
  constructor(a: number, b: number, id: number): void {
    assign(this, {
      a,
      b,
      id
    });
  }
};

type Memory = Array < MemoryDatum > ;

export class Signal {
  green: bool;
  lastGreen: number;
  next: Signal;
  x: Loc;
  index: number;
  oA: number;
  memory: Memory;
  constructor(index: number, oA: number, x: number): void {
    assign(this, {
      x,
      index,
      oA,
      memory: [],
      lastGreen: 0
    });
  }
  setNext(signal: Signal): void {
    this.next = signal;
  }
  remember(time: Time): void {
    this.memory = [
      ...this.memory.slice(0, 2),
      new MemoryDatum(this.lastGreen, time, this.index)
    ];
  }
};
