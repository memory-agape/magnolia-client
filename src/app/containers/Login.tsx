import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import * as Action from '../actions/Action';
import {
  LOGIN_FAILED,
  LOGIN_SUCCESS,
} from '../actions/Types';

import '../style/components/login.scss';
import '../style/components/input.scss';
import '../style/containers/container.scss';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const { useState, useRef } = React;

export const Login = (props: any) => {
  const dispatch = useDispatch();
  const idRef = useRef(null);
  const passwordRef = useRef(null);

  const [ errorInfo, setErrorInfo ] = useState({});

  const loginAction = () => {
    const id = (idRef.current as any).value;
    const password = (passwordRef.current as any).value;
    fetch('/api/v1/login', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({id, password})
    } as any)
      .then((response: any) => {
        return response.json()
      })
      .then((json: any) => {
        dispatch(
          Action.Login(
            json.status != 200
              ? LOGIN_FAILED
              : LOGIN_SUCCESS,
            {
              force: true,
              ...json
            }
          )
        );
        if (json.status != 200) {
          setErrorInfo(json);
        }
      });
    return false;
  };
  return (
    <>
      <div className="container container__login">
        <div>
          <div className="text-center">
            <div className="c-login-icon"></div>
          </div>
          <form action="javascript:void(0)" onSubmit={loginAction}>
            <p><input ref={idRef} type="text" className="input c-login-input" placeholder="ID" /></p>
            <p><input ref={passwordRef} type="password" className="input c-login-input" placeholder="PASSWORD" /></p>
            <input type="submit" value="" className="input input__hidden" />
          </form>
        </div>
      </div>

      <Dialog open={Object.keys(errorInfo).length > 0} onClose={() => setErrorInfo({})}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {(errorInfo as any).error}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorInfo({})} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
