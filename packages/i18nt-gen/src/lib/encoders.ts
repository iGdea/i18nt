import {
  jsEncode,
  htmlEncode,
  urlEncode,
} from 'htmlyer';


export type Encoder = (str: string) => string;

export type Encoders = {
  [type: string]: Encoder
};

export const encoders: Encoders = {
  jsEncode,
  htmlEncode,
  urlEncode,
};
