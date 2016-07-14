import _ from 'lodash';
import signals, { signals_initial } from './reduce-signals';
import cars, { cars_initial } from './reduce-cars';
import mfd, { MFD_INITIAL } from './reduce-mfd';

const timeReduce = (time = 0, action) => {
  return action.type == 'TICK' ? time + 1 : time;
};

function root(state = {
  signals: signals_initial,
  cars: cars_initial,
  mfd: MFD_INITIAL,
  time: 0
}, action) {
  return {
    signals: signals(state.signals, state.time, action),
    cars: cars(state.cars, state.signals, state.time, action),
    time: timeReduce(state.time, action),
    mfd: mfd(state.mfd, action)
  };
}

export default root;
