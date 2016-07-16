//@flow
import {VF,K0,KJ,W,ROAD_LENGTH,INITIAL_CYCLE,GREEN,CYCLE, NUM_SIGNALS} from '../constants/constants';
import type{MFD} from '../constants/types';
import {map,range,lt,lte} from 'lodash';
import {createMFD} from './reduce-mfd';
import { SET_OFFSET } from '../constants/actions';

// reduce-super-mfd = (state)->
// 	{green,cycle,num-signals} = state
// 	super-mfd = state.mfd
// 		|> _.map _, ({k},i)->
// 			p = switch
// 				| k/K0<green/cycle
// 					1/VF
// 				| green/cycle<=k/K0< 1+(VF/W)*(1 - green/cycle)
// 					1/ VF * (1 - k/K0) / (1 - green/cycle)
// 				default
// 					-1/W
// 			offset = p * ROAD-LENGTH/num-signals
// 			{mfd} = reduce-mfd {...state,offset}
// 			mfd[i]
// 			# {k,q,v}
//
// 	{...state,super-mfd}

export default map(
	range(.01, 1.01, .01),(k,i)=>{
    let p:number,
      kk = k/K0,
      gc = GREEN/CYCLE;
    if(lt(kk, gc)){
      p = 1/VF;
    }else if (lte(gc,kk) && lt(kk,1+VF/W*(1 - gc)) ){
      p = 1/ VF * (1 - kk) / (1 - gc);
    }else p = -1/W;
    let offset = p * ROAD_LENGTH/NUM_SIGNALS,
    	mfd = createMFD(offset);
  	return mfd[i];
  });
