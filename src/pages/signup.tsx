import React, { useState, FormEvent, MouseEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Grid,
  TextField,
  Divider,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  InputAdornment,
} from '@material-ui/core';
import {
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon,
} from '@material-ui/icons';
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import { GoogleLoginButton } from 'react-social-login-buttons';
import clsx from 'clsx';
import update from 'immutability-helper';

// Typings
import { ISignUpData, ISignUpValidations, IValidationFromAPI } from '@/typings';

// Components
import { Layout } from '@/components';

// Utils
import { userAPI, Validator, GOOGLE_OAUTH_CLIENT_ID } from '@/utils';

// Redux Actions
import { setUser } from '@/redux/actions/user';
import { setSuccess, setError } from '@/redux/actions/snackbar';

type SignUpStep = 'email' | 'name-password';

export default function SignUp() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState<SignUpStep>('email');
  const [signUpData, setSignUpData] = useState<ISignUpData>({
    name: '',
    email: '',
    password: '',
  });
  const [signUpErrors, setSignUpErrors] = useState<ISignUpValidations>({
    name: null,
    username: null,
    email: null,
    password: null,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const checkSignUpErrors = () => {
    const { name, email, password } = signUpData;
    const checkedSignUpErrors: ISignUpValidations = {
      name: Validator.Name(name),
      email: Validator.email(email),
      password: Validator.password(password),
    };

    setSignUpErrors({
      ...signUpErrors,
      ...checkedSignUpErrors,
    });

    if (
      Object.values(checkedSignUpErrors).every(
        (checkedSignUpError) => checkedSignUpError === null,
      )
    ) {
      return true;
    }

    return false;
  };

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (
    e: FormEvent<HTMLFormElement | HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLoading(true);
    e.preventDefault();
    const { name, email, password } = signUpData;
    try {
      if (checkSignUpErrors()) {
        const { data } = await userAPI.post('/signup', {
          name,
          email,
          password,
        });
        dispatch(setUser(data.user));
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch(setSuccess(data.message));
        await router.push('/app');
        setLoading(false);
      } else {
        setLoading(false);
        // throw something to the snackbar
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            dispatch(setError(err.response.data.message));
            if (err.response.data.messages) {
              const signUpErrorsFromAPI: ISignUpValidations = {} as ISignUpValidations;
              err.response.data.messages.forEach(
                (signUpError: IValidationFromAPI) => {
                  signUpErrorsFromAPI[signUpError.name] = signUpError.message;
                },
              );
              setSignUpErrors({
                ...signUpErrors,
                ...signUpErrorsFromAPI,
              });
            }
            break;

          default:
            dispatch(setError(err.response.data.message));
            break;
        }

        setLoading(false);
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

  const handleValidateCurrentStep = (
    e: FormEvent<HTMLFormElement | HTMLInputElement | HTMLTextAreaElement>,
    step: SignUpStep,
  ) => {
    e.preventDefault();

    if (step === 'email') {
      const emailValidation = Validator.email(signUpData.email);
      setSignUpErrors(
        update(signUpErrors, {
          email: {
            $set: emailValidation,
          },
        }),
      );

      if (emailValidation === null) {
        setCurrentStep('name-password');
      }
    }
  };

  const handleRenderSteps = (step: SignUpStep) => {
    if (step === 'email') {
      return (
        <>
          <Grid item>
            <Typography className={classes.headerText} variant={`h5`}>
              Sign up
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
                  <Typography variant={`body2`}>
                    Continue with Google
                  </Typography>
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
            onSubmit={(
              e: FormEvent<
                HTMLFormElement | HTMLInputElement | HTMLTextAreaElement
              >,
            ) => handleValidateCurrentStep(e, 'email')}
            noValidate={false}
            autoComplete={`on`}
          >
            <Grid item>
              <TextField
                autoComplete={`email`}
                fullWidth
                name={`email`}
                required
                type={`email`}
                label={`Email`}
                value={signUpData.email}
                onChange={handleOnChange}
                error={
                  signUpErrors.email !== null && signUpErrors.email.length > 0
                }
                helperText={signUpErrors.email}
                disabled={loading}
                size={`small`}
                variant={`outlined`}
              />
            </Grid>

            <Grid item>
              <Button
                className={clsx(classes.button, classes.signUpButton)}
                fullWidth
                variant={`contained`}
                color={`primary`}
                type={`submit`}
                disabled={loading}
                size={`medium`}
              >
                {`Sign up with email`}
              </Button>
            </Grid>
          </Grid>
        </>
      );
    }

    if (step === 'name-password') {
      return (
        <>
          <Grid item>
            <Button
              className={clsx(classes.button, classes.backButton)}
              onClick={() => setCurrentStep('email')}
              startIcon={<ArrowBackIcon />}
              size={`small`}
            >
              {signUpData.email}
            </Button>
          </Grid>

          <Grid item>
            <Typography className={classes.headerText} variant={`h5`}>
              Almost there
            </Typography>
          </Grid>

          <Grid
            item
            container
            className={classes.form}
            component={`form`}
            direction={`column`}
            onSubmit={handleSignUp}
            noValidate={false}
            autoComplete={`on`}
          >
            <Grid item>
              <TextField
                name={`name`}
                fullWidth
                required
                label={`Your name`}
                value={signUpData.name}
                onChange={handleOnChange}
                error={
                  signUpErrors.name !== null && signUpErrors.name.length > 0
                }
                helperText={signUpErrors.name}
                disabled={loading}
                size={`small`}
                variant={`outlined`}
              />
            </Grid>

            <Grid item>
              <TextField
                autoComplete={`new-password`}
                fullWidth
                name={`password`}
                required
                type={showPassword ? `text` : `password`}
                label={`Password`}
                value={signUpData.password}
                onChange={handleOnChange}
                error={
                  signUpErrors.password !== null &&
                  signUpErrors.password.length > 0
                }
                helperText={
                  signUpErrors.password !== null &&
                  signUpErrors.password.length > 0
                    ? signUpErrors.password
                    : `At least 6 characters.`
                }
                disabled={loading}
                size={`small`}
                variant={`outlined`}
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
              />
            </Grid>

            <Grid item>
              <Button
                className={clsx(classes.button, classes.signUpButton)}
                fullWidth
                variant={`contained`}
                color={`primary`}
                type={`submit`}
                disabled={loading}
                size={`medium`}
              >
                {loading ? <CircularProgress size={28} /> : `Sign up now`}
              </Button>
            </Grid>
          </Grid>
        </>
      );
    }
  };

  return (
    <Layout title={`Sign Up`}>
      <Grid
        className={classes.wrapper}
        container
        direction={`column`}
        justify={`center`}
      >
        {handleRenderSteps(currentStep)}

        <Divider />

        <Grid item container justify={`center`}>
          <Button
            className={clsx(classes.button, classes.signInButton)}
            variant={`text`}
            fullWidth
            onClick={() => router.push('/signin')}
            size={`small`}
          >
            Sign in
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
}

const useStyles = makeStyles((theme) =>
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
    signUpButton: {
      fontWeight: theme.typography.fontWeightBold,
    },
    signInButton: {
      color: theme.palette.text.primary,
    },
    googleButton: {},
    content: {},
    backButton: {
      paddingLeft: 0,
      color: theme.palette.text.primary,
    },
  }),
);
