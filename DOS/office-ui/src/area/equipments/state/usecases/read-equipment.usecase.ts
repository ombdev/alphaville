import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readEquipment } from '../../service/equipment.service';
import { equipmentsReducer } from '../equipments.reducer';

const postfix = '/app';
const READ_EQUIPMENT = `READ_EQUIPMENT${postfix}`;
const READ_EQUIPMENT_SUCCESS = `READ_EQUIPMENT_SUCCESS${postfix}`;
const READ_EQUIPMENT_ERROR = `READ_EQUIPMENT_ERROR${postfix}`;

export const readEquipmentAction: ActionFunctionAny<Action<any>> = createAction(
  READ_EQUIPMENT
);
export const readEquipmentSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_EQUIPMENT_SUCCESS);
export const readEquipmentErrorAction: ActionFunctionAny<Action<any>> = createAction(
  READ_EQUIPMENT_ERROR
);

function* readEquipmentWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readEquipment, id);
    yield put(readEquipmentSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield history.push('/equipments/list');
    yield put(readEquipmentErrorAction());
  }
}

function* readEquipmentWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_EQUIPMENT, readEquipmentWorker);
}

const equipmentsReducerHandlers = {
  [READ_EQUIPMENT]: (state: any) => {
    return {
      ...state,
      loading: true,
      equipment: null,
    };
  },
  [READ_EQUIPMENT_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      equipment: action.payload.equipment,
    };
  },
  [READ_EQUIPMENT_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readEquipmentWatcher);
equipmentsReducer.addHandlers(equipmentsReducerHandlers);
