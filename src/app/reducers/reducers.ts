import {combineReducers, ReducersMapObject} from 'redux'
import { connectRouter } from 'connected-react-router'

import { LoginReducer } from './LoginReducer';
import { SettingReducer } from './SettingReducer';
import {PageReducer} from "@reducers/PageReducer";

export default (history: any) => combineReducers<any, any>({
  router: connectRouter(history),
  login: LoginReducer,
  setting: SettingReducer,
  page: PageReducer,
})
