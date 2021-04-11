import React, { useState } from 'react';
// import { useRouter } from 'next/router';
// import { makeStyles, createStyles } from '@material-ui/core/styles';

// import ProgressBanner from '@/assets/svgs/home/progress-banner.svg';

export interface IMainBannerProps {}

export default function MainBanner(props: IMainBannerProps) {
  const {} = props;
  // const router = useRouter();
  // const classes = useStyles();
  const [getStartedData, setGetStartedData] = useState({
    email: ''
  });

  const handleTextChange = (type: 'email', target: string | any) => {
    switch (type) {
      case 'email':
        setGetStartedData({ ...getStartedData, email: target });
        break;
    }
  };

  // const handleSubmit = (
  //   e:
  //     | FormEvent<HTMLFormElement | HTMLInputElement | HTMLTextAreaElement>
  //     | MouseEvent<HTMLButtonElement | any>
  // ) => {
  //   e.preventDefault();
  //   if (getStartedData.email.length) {
  //     router.push({ pathname: '/signup', query: { email: getStartedData.email } });
  //   } else {
  //     router.push('/signup');
  //   }
  // };

  return (
    <section>
      {/* <section className={classes.leftSection}>
        <ProgressBanner />
      </section>
      <section className={classes.rightSection}>
        <div className={classes.captionDiv}>
          <h1>Fancy Todo</h1>
          <p>
            Enable you to organize and prioritize your projects in a fun,
            flexible, and rewarding way.
          </p>
        </div>
        <form onSubmit={handleSubmit} className={classes.getStartedForm}>
          <TextField
            className={classes.getStartedTextField}
            value={getStartedData.email}
            onChange={(e, val) => handleTextChange('email', val)}
            placeholder="Email"
          />
          <PrimaryButton
            className={classes.getStartedBtn}
            type="submit"
            onSubmit={handleSubmit}
            onClick={handleSubmit}
          >
            Get Started!
          </PrimaryButton>
        </form>
      </section> */}
    </section>
  );
}

// const useStyles = makeStyles(() =>
//   createStyles({
//     mainBannerWrapper: {
//       width: '100%',
//       display: 'grid',
//       gridTemplateColumns: 'repeat(2, 1fr)',
//       minHeight: '100vh',
//       marginTop: '0 !important'
//     },
//     leftSection: {
//       width: '100%',
//       height: '100%',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: '0 5ch',
//       '& > svg': {
//         width: '100%',
//         height: '100%',
//         animation: `$mainBannerSVG 1s ease-in`
//       }
//     },
//     '@keyframes mainBannerSVG': {
//       '0%': {
//         transform: 'translateX(-100%)'
//       },
//       '100%': {
//         opacity: 1,
//         transform: 'translate(0%)'
//       }
//     },
//     rightSection: {
//       width: '100%',
//       height: '100%',
//       display: 'grid',
//       gridTemplateColumns: 'repeat(1, 1fr)',
//       gridTemplateRows: 'repeat(2, 1fr)',
//       justifyItems: 'center',
//       alignContent: 'center',
//       padding: '5ch'
//     },
//     getStartedForm: {
//       width: '100%',
//       height: '100%',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       '& > *': {
//         margin: '1ch 0'
//       }
//     },
//     getStartedTextField: {
//       width: '100%',
//       '& > .ms-TextField-wrapper div': {
//         height: '6ch',
//         borderColor: theme.palette.blueLight,
//         '&::after': {
//           borderColor: theme.palette.blueLight
//         },
//       },
//       '& > .ms-TextField-wrapper div input': {
//         fontSize: '1.5em',
//         lineHeight: 1,
//         '&::placeholder': {
//           fontSize: 'inherit',
//           lineHeight: 1
//         }
//       }
//     },
//     getStartedBtn: {
//       background: theme.palette.blueLight,
//       borderColor: theme.palette.blueLight,
//       opacity: 0.7,
//       fontSize: '1.5em',
//       lineHeight: 1.5,
//       padding: '2ch 3ch',
//       letterSpacing: 1.8,
//       textTransform: 'uppercase',
//       transition: 'opacity 1s ease',
//       '&:hover': {
//         opacity: 1,
//         background: theme.palette.blueLight,
//         borderColor: theme.palette.blueLight
//       }
//     },
//     captionDiv: {
//       width: '100%',
//       height: '100%',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'flex-start',
//       '& > h1': {
//         margin: 0,
//         padding: 0,
//         fontSize: '4em',
//         animation: '$heroTitle 2s ease-in'
//       },
//       '& > p': {
//         margin: 0,
//         padding: '1ch 0',
//         fontSize: '1.5em',
//         animation: '$heroDesc 2s ease-in'
//       }
//     },
//     '@keyframes heroTitle': {
//       '0%': {
//         opacity: 0
//       },
//       '100%': {
//         opacity: 1
//       }
//     },
//     '@keyframes heroDesc': {
//       '0%': {
//         opacity: 0
//       },
//       '50%': {
//         opacity: 0
//       },
//       '100%': {
//         opacity: 1
//       }
//     }
//   })
// );
