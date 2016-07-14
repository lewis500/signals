//@flow
import {assign,random} from 'lodash';
import { ROAD_LENGTH, NUM_CARS, SPACE, VF, RUSH_LENGTH, MEMORY_LENGTH, TRIP_LENGTH } from "./constants.js";

export type Time = number;
export type Loc = number;
export type Cell = number;
export type Measurement = {
	q: number;
	k: number;
}
export type Cars = Array<Car>
export type Signals = Array<Signal>

export type CarState = {
  population: Cars;
  waiting: Cars;
  queueing: Cars;
  history: Array<HistoryDatum>;
	moving:Cars;
  exited: Cars;
  cells: Array<Cell>;
  measurement: Measurement;
  q: number;
  n: number;
};

export type Action = {type: string;}

export class Car {
	x: Loc;
	id: number;
	moved: number;
	tA: Time;
	constructor(x:number,tA:number,id:number):void{
		assign(this, {x, id, moved: 0, tA});
	}
}

export class HistoryDatum{
	t: Time;
	a: number;
	e: number;
	constructor(t:number, a:number, e:number):void {
		assign(this, { t, a, e });
	}
}

export class MFDEntry {
	k: number;
	q:number;
	v:number;
  constructor(k:number, q:number, v:number) {
		assign(this,{k,q,v});
  }
}

export type MFD = Array<MFDEntry>

export class SignalHistoryDatum {
	a: Time;
	b: Time;
	id: number;
	constructor(a:number,b:number,id:number){
		assign(this,{a,b,id});
	}
}

export class Signal {
	green: bool;
	lastGreen: number;
	next: Signal;
	x: Loc;
	index: number;
	oA: number;
	history: Array<SignalHistoryDatum>;
	constructor(index:number, oA:number, x:number):void{
		assign(this, {x,index, oA, history: [], lastGreen: 0});
	}
	setNext(signal:Signal):void{
		this.next= signal;
	}
}
