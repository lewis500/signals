// require!{
// 	d3
// 	lodash: _
// 	'../constants/constants': {VF,K0,KJ,W,ROAD-LENGTH}
// 	'prelude-ls': {map,concat-map,concat}
// 	'./reduce-mfd': {reduce-mfd}
// }

import {VF,K0,KJ,W,ROAD_LENGTH,CYCLE,GREEN} from '../constants/constants';
import type{MFD} from '../constants/types';
import {map,range} from 'lodash';
import reduceMFD from './reduce-mfd';

const superMFD:MFD = range(.01, 1.01, .01)
  .map(k=>{
    let p:number,
      kk = k/K0;
    if(kk < GREEN/CYCLE){
      p = 1/VF;
    }else if ((GREEN/CYCLE<=KK) && (KK< (1+VF/W*(1 - GREEN/CYCLE)) )){
      p = 1/ VF * (1 - k/K0) / (1 - GREEN/CYCLE);
    }else{
      p = -1/W;
    }

  });

// function reduceSuperMfd():MFD{
//
// }

const superMFD:MFD = _.range(0)

reduce-super-mfd = (state)->
	{green,cycle,num-signals} = state
	super-mfd = state.mfd
		|> _.map _, ({k},i)->
			p = switch
				| k/K0<green/cycle
					1/VF
				| green/cycle<=k/K0< 1+(VF/W)*(1 - green/cycle)
					1/ VF * (1 - k/K0) / (1 - green/cycle)
				default
					-1/W
			offset = p * ROAD-LENGTH/num-signals
			{mfd} = reduce-mfd {...state,offset}
			mfd[i]
			# {k,q,v}

	{...state,super-mfd}

export reduce-super-mfd
