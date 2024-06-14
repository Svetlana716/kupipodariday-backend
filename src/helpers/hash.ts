import { hash, compare } from 'bcrypt';

export const hashValue = (value: string) => {
  return hash(value, 10);
};

export const veryfyHash = (value: string, hash: string) => {
  return compare(value, hash);
};
