import {
  jsEncode,
  htmlEncode,
  urlEncode,
} from 'htmlyer';


export enum EncoderType {
  jsEncode = 'jsEncode',
  htmlEncode = 'htmlEncode',
  urlEncode = 'urlEncode',
};

export type Encoder = (str: string) => string;

export type Encoders = {
  [type in EncoderType]: Encoder
};

export const encoders: Encoders = {
  jsEncode,
  htmlEncode,
  urlEncode,
};
