import { NextPageContext } from 'next';
import { IncomingMessage } from 'http';

export interface CookieMessage extends IncomingMessage {
  cookies: {
    [name: string]: string;
  };
}

export interface CookiesPageContext extends NextPageContext {
  req?: CookieMessage;
}

export type Validation = {
  error: boolean;
  text: string;
};

export interface Option<K = any, L = string, V = any> {
  key: K;
  label: L;
  value: V;
}
