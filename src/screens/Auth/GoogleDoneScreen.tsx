/*
 * Tezos-monsters - play game to lean Ligo and Tezos
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {parse} from 'querystring';
import {BeatLoader} from 'react-spinners';
import actions from '../../store/actions';
import {RootState} from '../../store';
import {isAuthenticated} from '../../store/auth';
import {STATUS} from "../../store/utils/status";

interface OAuthCompleteProps {
  method: 'signup' | 'login';
}

export const GoogleAuthDoneScreen: React.FC<OAuthCompleteProps> = ({
  method,
}: OAuthCompleteProps) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const [requestSent, setRequestSent] = useState(false);

  // If signedIn, redirect to core
  const isSignedIn = useSelector((state: RootState) => isAuthenticated(state));
  if (isSignedIn) {
    history.push('/');
  }

  // If signin in fails, inform user and redirect to /
  if (authStatus === STATUS.FAILURE && requestSent) {
    alert("Sorry, there is an internal problem with signing in. Please, try later");
    history.push("/login")
  }

  // parse querystring & get code
  const values = parse(history.location.search.replace("?", "")) as {code: string};
  useEffect(() => {
    if (values.code !== '' && !requestSent) {
    setRequestSent(true);
    dispatch(actions.auth.clearStatus());
    dispatch(actions.auth.oauthAuthenticate('google-oauth2', values.code));
  }
  }, [values.code])



  return <BeatLoader />;
};
