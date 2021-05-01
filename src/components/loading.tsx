import React, { FC } from 'react';
import { LinearProgress, Grid } from '@material-ui/core';
import { AssignmentTurnedIn as AssignmentTurnedInIcon } from '@material-ui/icons';

import Container from './container';

const Loading: FC<{}> = () => {
  return (
    <Container>
      <Grid
        container
        justify={`center`}
        alignContent={`center`}
        direction={`column`}
      >
        <Grid item>
          <AssignmentTurnedInIcon color={`primary`} fontSize={`large`} />
        </Grid>
        <Grid>
          <LinearProgress />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Loading;
