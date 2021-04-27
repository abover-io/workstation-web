import React, { useState, useEffect, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

// import { Header, Footer } from '@/components';

// Types
import { IRootState, ISnackbarOptions } from '@/typings';

// Redux Actions
import { resetSnackbar } from '@/redux/actions/snackbar';

// Components
import CustomHead from './custom-head';

export interface IAppLayoutProps {
  title: string;
  children: ReactNode;
  // header?: boolean;
  // footer?: boolean;
}

export default function AppLayout({
  title,
  children,
}: // header = true,
// footer = true,
IAppLayoutProps) {
  const dispatch = useDispatch();
  const snackbar = useSelector((state: IRootState) => state.snackbar);
  const [snackbarOptions, setSnackbarOptions] = useState<ISnackbarOptions>({
    open: false,
    message: null,
    severity: undefined,
  });

  useEffect(() => {
    if (snackbar.info && snackbar.info.length > 0) {
      setSnackbarOptions({
        severity: 'info',
        message: snackbar.info,
        open: true,
      });
    } else if (snackbar.warning && snackbar.warning.length > 0) {
      setSnackbarOptions({
        severity: 'warning',
        message: snackbar.warning,
        open: true,
      });
    } else if (snackbar.error && snackbar.error.length > 0) {
      setSnackbarOptions({
        severity: 'error',
        message: snackbar.error,
        open: true,
      });
    } else if (snackbar.success && snackbar.success.length > 0) {
      setSnackbarOptions({
        severity: 'success',
        message: snackbar.success,
        open: true,
      });
    } else {
      setSnackbarOptions({
        ...snackbarOptions,
        message: null,
        open: false,
      });
    }
  }, [snackbar]);

  const handleCloseSnackbar = (): void => {
    dispatch(resetSnackbar());

    setSnackbarOptions({
      ...snackbarOptions,
      open: false,
      message: null,
    });
  };

  const handleCloseAlert = (): void => {
    dispatch(resetSnackbar());

    setSnackbarOptions({
      ...snackbarOptions,
      open: false,
      message: null,
    });
  };

  return (
    <>
      <CustomHead title={title} />

      {/* <Header /> */}

      {children}

      {/* <Footer /> */}

      <Snackbar
        open={snackbarOptions.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={snackbarOptions.severity}
          onClose={handleCloseAlert}
          variant={`filled`}
          elevation={6}
        >
          {snackbarOptions.message}
        </Alert>
      </Snackbar>
    </>
  );
}
