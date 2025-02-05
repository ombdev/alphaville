import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
// import { translations } from 'src/shared/translations/translations.util';
import { createEquipment } from '../../service/equipment.service';
import { equipmentsReducer } from '../equipments.reducer';
import { loadEquipmentsAction } from './load-equipments.usecase';

const postfix = '/app';
const CREATE_EQUIPMENT = `CREATE_EQUIPMENT${postfix}`;
const CREATE_EQUIPMENT_SUCCESS = `CREATE_EQUIPMENT_SUCCESS${postfix}`;
const CREATE_EQUIPMENT_ERROR = `CREATE_EQUIPMENT_ERROR${postfix}`;

export const createEquipmentAction: ActionFunctionAny<Action<any>> = createAction(
  CREATE_EQUIPMENT
);
export const createEquipmentSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_EQUIPMENT_SUCCESS);
export const createEquipmentErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_EQUIPMENT_ERROR);

function* createEquipmentWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createEquipment, fields);
    yield put(createEquipmentSuccessAction(result));
    yield history.push('/equipments');
    yield put(loadEquipmentsAction());
    yield put(
      notificationAction({
        message: `¡Equipo ${result.returnCode} ha sido creado!`,
        type: 'success',
      })
    );
  } catch (e) {
    const { releaseForm } = action.payload;
    let message: string =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    /*
    message = message.includes(
      translations.users.error_responses.users_unique_username
    )
      ? translations.users.error_responses.users_unique_username_message
      : message;
    */
    yield releaseForm();
    yield put(createEquipmentErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createEquipmentWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_EQUIPMENT, createEquipmentWorker);
}

const equipmentReducerHandlers = {
  [CREATE_EQUIPMENT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_EQUIPMENT_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      equipment: null,
    };
  },
  [CREATE_EQUIPMENT_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createEquipmentWatcher);
equipmentsReducer.addHandlers(equipmentReducerHandlers);
