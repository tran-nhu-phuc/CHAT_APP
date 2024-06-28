import { AxiosError } from 'axios';

export const handleErrorApi = (err: unknown) => {
  if (err instanceof AxiosError) {
    throw err;
  }

  throw Error('Unknown');
};
