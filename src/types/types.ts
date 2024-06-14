export interface IUser {
  id: number;
  username: string;
}

export interface IPayload {
  payload: {
    sub: number;
    username: string;
  };
}
