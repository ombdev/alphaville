import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
// import { translations } from 'src/shared/translations/translations.util';
import { createCarrier } from '../../service/carrier.service';
import { carriersReducer } from '../carriers.reducer';
import { loadCarriersAction } from './load-carriers.usecase';

const postfix = '/app';
const CREATE_CARRIER = `CREATE_CARRIER${postfix}`;
const CREATE_CARRIER_SUCCESS = `CREATE_CARRIER_SUCCESS${postfix}`;
const CREATE_CARRIER_ERROR = `CREATE_CARRIER_ERROR${postfix}`;

export const createCarrierAction: ActionFunctionAny<Action<any>> = createAction(
  CREATE_CARRIER
);
export const createCarrierSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_CARRIER_SUCCESS);
export const createCarrierErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_CARRIER_ERROR);

function* createCarrierWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createCarrier, fields);
    yield put(createCarrierSuccessAction(result));
    yield history.push('/carriers');
    yield put(loadCarriersAction());
    yield put(
      notificationAction({
        message: `¡Carrier ${result.returnCode} ha sido creada!`,
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
    yield put(createCarrierErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createCarrierWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_CARRIER, createCarrierWorker);
}

const carrierReducerHandlers = {
  [CREATE_CARRIER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_CARRIER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      carrier: null,
    };
  },
  [CREATE_CARRIER_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createCarrierWatcher);
carriersReducer.addHandlers(carrierReducerHandlers);
