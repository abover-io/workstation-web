import React, { FC, useState, FormEvent, MouseEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
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
import update from 'immutability-helper';

// Config
import { GOOGLE_OAUTH_CLIENT_ID } from '@/config';

// Types
import { ISignInFormValidations, ISignInFormData } from '@/types/auth';

// HOCs
import { withoutAuth } from '@/hocs';

// Components
import { Layout } from '@/components';

// APIs
import { AuthAPI } from '@/apis';

// Utils
import { UserValidator } from '@/utils/validator';

// Redux Actions
import { setUser } from '@/redux/actions/auth';

const SignIn: FC<{}> = () => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<ISignInFormData>({
    email: '',
    password: '',
  });
  const [validations, setValidations] = useState<ISignInFormValidations>({
    email: {
      error: false,
      text: '',
    },
    password: {
      error: false,
      text: '',
    },
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    switch (e.target.name as keyof ISignInFormValidations) {
      case 'email':
        const emailValidation = UserValidator.Email(e.target.value);
        setValidations(
          update(validations, {
            email: {
              $set: emailValidation,
            },
          }),
        );
        setFormData(
          update(formData, {
            email: {
              $set: e.target.value,
            },
          }),
        );
        break;

      case 'password':
        const passwordValidation = UserValidator.Password(e.target.value);
        setValidations(
          update(validations, {
            password: {
              $set: passwordValidation,
            },
          }),
        );
        setFormData(
          update(formData, {
            password: {
              $set: e.target.value,
            },
          }),
        );
        break;

      default:
        break;
    }
  };

  const handleSignIn = async (
    e:
      | FormEvent<HTMLFormElement | HTMLInputElement | HTMLTextAreaElement>
      | MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    try {
      e.preventDefault();

      setLoading(true);

      if (Object.values(validations).every((v) => v.error === false)) {
        const { data } = await AuthAPI.post('/signin', {
          email: formData.email,
          password: formData.password,
        });

        dispatch(setUser(data.user));

        enqueueSnackbar(data.message, {
          variant: 'success',
        });

        router.push('/app');
      } else {
        // handle here
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            if (err.response.data.vallidations) {
              setValidations(err.response.data.vallidations);
            }
            break;

          default:
            enqueueSnackbar(err.response.data.message, {
              variant: 'error',
            });
            break;
        }
      }
    }
  };

  const googleSignInOnSuccess = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ): Promise<void> => {
    try {
      setLoading(true);

      const { data } = await AuthAPI.post('/auth/google', {
        googleIdToken: (response as GoogleLoginResponse).tokenId,
      });

      dispatch(setUser(data.user));

      enqueueSnackbar(data.message, {
        variant: 'success',
      });

      router.push('/app');

      setLoading(false);
    } catch (err) {
      setLoading(false);

      if (err.response) {
        enqueueSnackbar(err.response.data.message, {
          variant: 'error',
        });
      }
    }
  };

  const googleSignInOnFailure = (err: any): void => {
    enqueueSnackbar(err.response.data.message, {
      variant: 'error',
    });
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
              autoComplete={`email`}
              label={`Email`}
              name={`email`}
              required
              value={formData.email}
              onChange={handleChange}
              error={validations.email.error}
              helperText={validations.email.text}
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
              type={showPassword ? `text` : `password`}
              value={formData.password}
              onChange={handleChange}
              error={validations.email.error}
              helperText={validations.email.text}
              InputProps={{
                endAdornment: (
                  <InputAdornment position={`end`}>
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      disabled={loading}
                    >
                      {showPassword ? (
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
                disabled={loading}
                size={`medium`}
              >
                {loading ? <CircularProgress size={28} /> : `Sign in`}
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
};

export default withoutAuth(SignIn);

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
