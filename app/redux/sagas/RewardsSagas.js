import { all, call, put, takeEvery } from 'redux-saga/effects';
import { FETCH_REWARDS_ASYNC, CLAIM_REWARD_ASYNC } from '../actions';
import { Toast } from 'native-base';
// import Big from 'big.js';

import * as Rehive from '../../util/rehive';

function* fetchRewards() {
  try {
    const response = yield call(Rehive.getRewards);
    if (response.status === 'error') {
      yield put({
        type: FETCH_REWARDS_ASYNC.success,
        payload: null,
      });
    } else {
      yield put({
        type: FETCH_REWARDS_ASYNC.success,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log(error);
    yield put({ type: FETCH_REWARDS_ASYNC.error, payload: error.message });
  }
}

function* claimReward(action) {
  try {
    yield call(Rehive.claimReward, action.payload.identifiere);

    Toast.show({
      text:
        'Your reward has been requested and it will reflect in your wallet balance upon admin approval',
      duration: 3000,
    });

    yield put({
      type: CLAIM_REWARD_ASYNC.success,
    });
  } catch (error) {
    console.log(error);
    Toast.show({
      text: 'Unable to request reward: ' + error.message,
      duration: 3000,
    });
    yield put({ type: CLAIM_REWARD_ASYNC.error, payload: error.message });
  }
}

// function*

export const rewardsSagas = all([
  takeEvery(FETCH_REWARDS_ASYNC.pending, fetchRewards),
  takeEvery(CLAIM_REWARD_ASYNC.pending, claimReward),
]);
