//@flow
import type {Action} from './types';

export const TICK = 'TICK';
export const RESET = 'RESET';
export const SET_MFD = 'SET_MFD';



export const actions = {
    tick():Action{
        return {type: TICK};
    },
    reset():Action{
      return {type: RESET};
    },
    setMFD():Action{
      return {type: SET_MFD};
    }
};
