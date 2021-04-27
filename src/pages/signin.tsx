import React, { useState, FormEvent, MouseEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Grid,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  Paper,
} from '@material-ui/core';
import {
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
} from '@material-ui/icons';
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import { GoogleLoginButton } from 'react-social-login-buttons';
import clsx from 'clsx';

import { Layout } from '@/components';
import { userAPI, Validator, GOOGLE_OAUTH_CLIENT_ID } from '@/utils';

// Redux Actions
import { setUser } from '@/redux/actions/user';
import { setError, setSuccess } from '@/redux/actions/snackbar';

// Types
import { ISignInValidations, IValidator, IValidationFromAPI } from '@/typings';

export default function SignIn() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const [signInData, setSignInData] = useState({
    userIdentifier: '',
    password: '',
  });
  const [signInErrors, setSignInErrors] = useState<ISignInValidations>({
    userIdentifier: null,
    password: null,
  });
  const [showInputPassword, setShowInputPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const checkSignInErrors = (): boolean => {
    const { userIdentifier, password } = signInData;
    const checkedSignInErrors: ISignInValidations = {
      userIdentifier: Validator.userIdentifier(userIdentifier),
      password: Validator.password(password),
    };

    setSignInErrors({
      ...signInErrors,
      ...checkedSignInErrors,
    });

    if (
      Object.values(checkedSignInErrors).every(
        (checkedSignInError) => checkedSignInError === null,
      )
    ) {
      return true;
    }

    return false;
  };

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setSignInErrors({
      ...signInErrors,
      [e.target.name]: (Validator as IValidator)[e.target.name](e.target.value),
    });

    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (
    e:
      | FormEvent<HTMLFormElement | HTMLInputElement | HTMLTextAreaElement>
      | MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    setLoading(true);
    e.preventDefault();
    const { userIdentifier, password } = signInData;

    try {
      if (checkSignInErrors()) {
        const { data } = await userAPI.post('/signin', {
          userIdentifier,
          password,
        });

        dispatch(setUser(data.user));
        localStorage.setItem('user', JSON.stringify(data.user));

        dispatch(setSuccess(data.message));

        await router.push('/app');
        setLoading(false);
      } else {
        setLoading(false);
        // handle here
      }
    } catch (err) {
      setLoading(false);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            dispatch(setError(err.response.data.message));
            if (err.response.data.messages) {
              const signInErrorsFromAPI: ISignInValidations = {} as ISignInValidations;
              err.response.data.messages.forEach(
                (signInError: IValidationFromAPI) => {
                  signInErrorsFromAPI[signInError.name] = signInError.message;
                },
              );
              setSignInErrors({
                ...signInErrors,
                ...signInErrorsFromAPI,
              });
            }
            break;

          default:
            dispatch(setError(err.response.data.message));
            break;
        }
      }
    }
  };

  const googleSignInOnSuccess = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await userAPI.post('/auth/google', {
        googleIdToken: (response as GoogleLoginResponse).tokenId,
      });

      dispatch(setUser(data.user));
      localStorage.setItem('user', JSON.stringify(data.user));

      dispatch(setSuccess(data.message));

      setLoading(false);

      await router.push('/app');
    } catch (err) {
      setLoading(false);

      if (err.response) {
        if (err.response.data) {
          dispatch(setError(err.response.data.message));
        }
      }
    }
  };

  const googleSignInOnFailure = (err: any): void => {
    dispatch(setError(err.response.data.message));
  };

  return (
    <Layout title={`Sign In`}>
      <Grid
        className={classes.wrapper}
        container
        direction={`column`}
        justify={`center`}
      >
        <Grid item>
          <Typography className={classes.headerText} variant={`h5`}>
            Sign in
          </Typography>
        </Grid>

        <Grid item>
          <GoogleLogin
            className={classes.googleButton}
            clientId={GOOGLE_OAUTH_CLIENT_ID}
            buttonText={`Continue with Google`}
            onSuccess={googleSignInOnSuccess}
            onFailure={googleSignInOnFailure}
            cookiePolicy={`single_host_origin`}
            isSignedIn
            render={(renderProps) => (
              <GoogleLoginButton
                onClick={renderProps.onClick}
                preventActiveStyles
              >
                <Typography variant={`body2`}>Continue with Google</Typography>
              </GoogleLoginButton>
            )}
          />
        </Grid>

        <Divider />

        <Grid
          item
          container
          className={classes.form}
          component={`form`}
          direction={`column`}
          onSubmit={handleSignIn}
          noValidate={false}
          autoComplete={`on`}
        >
          <Grid item>
            <TextField
              fullWidth
              autoComplete={`username`}
              label={`Username or Email`}
              name={`userIdentifier`}
              required
              value={signInData.userIdentifier}
              onChange={handleOnChange}
              error={
                signInErrors.userIdentifier !== null &&
                signInErrors.userIdentifier.length > 0
              }
              helperText={signInErrors.userIdentifier}
              disabled={loading}
              variant={`outlined`}
              size={`small`}
            />
          </Grid>

          <Grid item>
            <TextField
              fullWidth
              autoComplete={`current-password`}
              label={`Password`}
              name={`password`}
              required
              type={showInputPassword ? `text` : `password`}
              value={signInData.password}
              onChange={handleOnChange}
              error={
                signInErrors.password !== null &&
                signInErrors.password.length > 0
              }
              helperText={signInErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position={`end`}>
                    <IconButton
                      onClick={() => setShowInputPassword(!showInputPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      disabled={loading}
                    >
                      {showInputPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
              variant={`outlined`}
              size={`small`}
            />
          </Grid>

          <Grid item container direction={`column`}>
            <Grid item>
              <Button
                className={clsx(classes.button, classes.signInButton)}
                fullWidth
                color={`primary`}
                variant={`contained`}
                type={`submit`}
                onClick={handleSignIn}
                disabled={loading}
                size={`medium`}
              >
                {loading ? <CircularProgress /> : `Sign in`}
              </Button>
            </Grid>

            <Grid item>
              <Button
                className={clsx(classes.button, classes.forgotButton)}
                variant={`text`}
                type={`button`}
                disabled={loading}
                size={`small`}
              >
                {`Forgot password?`}
              </Button>
            </Grid>
          </Grid>

          <Divider />

          <Grid item container justify={`center`}>
            <Button
              className={clsx(classes.button, classes.signUpButton)}
              color={`primary`}
              onClick={() => router.push('/signup')}
              variant={`text`}
              size={`small`}
            >
              Create account
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      width: '100%',
      height: '100%',
      padding: theme.spacing(1),
      '& > *': {
        margin: theme.spacing(2, 0),
      },
    },
    headerText: {
      fontWeight: theme.typography.fontWeightBold,
    },
    form: {
      '& > *': {
        margin: theme.spacing(1, 0),
      },
    },
    button: {
      textTransform: 'none',
    },
    signInButton: {
      fontWeight: theme.typography.fontWeightBold,
    },
    signUpButton: {
      color: theme.palette.text.primary,
    },
    forgotButton: {
      marginTop: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    googleButton: {},
    content: {},
  }),
);
