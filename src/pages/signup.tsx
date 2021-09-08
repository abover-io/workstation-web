import { useState, FormEvent, ChangeEvent } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
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
import { ISignUpFormData, ISignUpFormValidations } from '@/types/auth';

// API
import api from '@/api';

// Config
import { GOOGLE_OAUTH_WEB_CLIENT_ID } from '@/config';

// HOCs
import { withoutAuth } from '@/hocs';

// Components
import { Layout } from '@/components';

// Utils
import { UserValidator } from '@/utils/validator';

// Redux Actions
import { setUser } from '@/redux/actions/auth';

type SignUpStep = 'email' | 'name-password';

const SignUp: NextPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [currentStep, setCurrentStep] = useState<SignUpStep>('email');
  const [formData, setFormData] = useState<ISignUpFormData>({
    name: '',
    email: '',
    password: '',
  });
  const [validations, setValidations] = useState<ISignUpFormValidations>({
    name: {
      error: false,
      text: '',
    },
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
  ) => {
    switch (e.target.name as keyof ISignUpFormValidations) {
      case 'name':
        const nameValidation = UserValidator.Name(e.target.value);
        setValidations(
          update(validations, {
            name: {
              $set: nameValidation,
            },
          }),
        );
        setFormData(
          update(formData, {
            name: {
              $set: e.target.value,
            },
          }),
        );
        break;

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

  const handleSignUp = async (
    e: FormEvent<HTMLFormElement | HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    try {
      e.preventDefault();

      setLoading(true);

      if (Object.values(validations).every((v) => v.error === false)) {
        const { data } = await api.post('/auth/signup', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        dispatch(setUser(data.user));

        enqueueSnackbar(data.message, {
          variant: 'success',
        });

        await router.push('/app');
      }
    } catch (err) {
      setLoading(false);

      if (err.response) {
        if (err.response.data.vallidations) {
          setValidations(err.response.data.vallidations);
        }
      }
    }
  };

  const googleSignInOnSuccess = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ): Promise<void> => {
    try {
      setLoading(true);

      const { data } = await api.post('/auth/google', {
        googleIdToken: (response as GoogleLoginResponse).tokenId,
      });

      dispatch(setUser(data.user));

      enqueueSnackbar(data.message, {
        variant: 'success',
      });

      setLoading(false);

      await router.push('/app');
    } catch (err) {
      setLoading(false);
    }
  };

  const googleSignInOnFailure = (err: any): void => {
    enqueueSnackbar(err.response.data.message, {
      variant: 'error',
    });
  };

  const handleValidateCurrentStep = (
    e: FormEvent<HTMLFormElement | HTMLInputElement | HTMLTextAreaElement>,
    step: SignUpStep,
  ) => {
    e.preventDefault();

    if (step === 'email') {
      const emailValidation = UserValidator.Email(formData.email);
      setValidations(
        update(validations, {
          email: {
            $set: emailValidation,
          },
        }),
      );

      if (!emailValidation.error) {
        setCurrentStep('name-password');
      }
    }
  };

  const handleRenderSteps = (step: SignUpStep) => {
    switch (step) {
      case 'email':
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
                clientId={GOOGLE_OAUTH_WEB_CLIENT_ID}
                buttonText={`Continue with Google`}
                onSuccess={googleSignInOnSuccess}
                onFailure={googleSignInOnFailure}
                cookiePolicy={`single_host_origin`}
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
                  value={formData.email}
                  onChange={handleChange}
                  error={validations.email.error}
                  helperText={validations.email.text}
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

      case 'name-password':
        return (
          <>
            <Grid item>
              <Button
                className={clsx(classes.button, classes.backButton)}
                onClick={() => setCurrentStep('email')}
                startIcon={<ArrowBackIcon />}
                size={`small`}
              >
                {formData.email}
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
                  value={formData.name}
                  onChange={handleChange}
                  error={validations.name.error}
                  helperText={validations.name.text}
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
                  value={formData.password}
                  onChange={handleChange}
                  error={validations.password.error}
                  helperText={
                    validations.password.error
                      ? validations.password.text
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

      default:
        return null;
    }
  };

  return (
    <Layout title={`Sign Up`}>
      <Grid
        className={classes.wrapper}
        container
        direction={`column`}
        justifyContent={`center`}
      >
        {handleRenderSteps(currentStep)}

        <Divider />

        <Grid item container justifyContent={`center`}>
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
};

export default withoutAuth(SignUp);

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
