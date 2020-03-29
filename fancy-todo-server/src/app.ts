import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from 'dotenv';

import router from './routes';

if (process.env.NODE_ENV !== 'production') {
  config();
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

mongoose.connect('mongodb://localhost:27017/fancy-todo-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(port, () => {
  console.log(`Sunday's API is running on port ${port}!`);
});

export default app;
