import React, { useState, FormEvent, MouseEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
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
// import FacebookLogin from 'react-facebook-login';

import { Layout } from '@/components';
import {
  userAPI,
  Validator,
  GOOGLE_OAUTH_CLIENT_ID,
  // FACEBOOK_OAUTH_APP_ID,
} from '@/utils';

// Redux Actions
import { setUser } from '@/redux/actions/user';
import { setError, setSuccess } from '@/redux/actions/snackbar';

// Types
import {
  ISignInValidations,
  IValidator,
  IValidationFromAPI,
} from '@/typings';

export interface ISignInPageProps {}

export default function SignIn({}: ISignInPageProps) {
  const classes = useStyles({});
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
      [e.target.name]: (Validator as IValidator)[e.target.name](
        e.target.value,
      ),
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
      <Card classes={{ root: classes.cardContainer }}>
        <CardContent classes={{ root: classes.cardContent }}>
          <Typography variant={`h4`} gutterBottom>
            Welcome back!
          </Typography>

          <form
            className={classes.signInForm}
            onSubmit={handleSignIn}
            noValidate={false}
            autoComplete={`on`}
          >
            <TextField
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
            />
            <TextField
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
            />
            <Button
              color={`primary`}
              variant={`contained`}
              type={`submit`}
              onClick={handleSignIn}
              disabled={loading}
            >
              {loading ? <CircularProgress /> : `Sign In`}
            </Button>

            <GoogleLogin
              clientId={GOOGLE_OAUTH_CLIENT_ID as string}
              buttonText={`Continue with Google`}
              onSuccess={googleSignInOnSuccess}
              onFailure={googleSignInOnFailure}
              cookiePolicy={`single_host_origin`}
              // isSignedIn
            />

            {/* <FacebookLogin
              appId={FACEBOOK_OAUTH_APP_ID as string}
              autoLoad
              callback={(something) => console.log(something)}
            /> */}
          </form>
        </CardContent>

        <CardActions classes={{ root: classes.cardActions }}>
          <Button color={`primary`} onClick={() => router.push('/signup')}>
            Create account
          </Button>
        </CardActions>
      </Card>
    </Layout>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardContainer: {
      padding: theme.spacing(2),
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(1),
      '& > *': {
        width: '100%',
      },
    },
    signInForm: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& > *': {
        width: '100%',
        margin: theme.spacing(1, 0)
      },
    },
    cardActions: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: theme.spacing(1),
    },
  }),
);
