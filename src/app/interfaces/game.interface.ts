export interface IGame {
  _id: string;
  name: string;
  startDate: Date;
  duration: number;
  isStarted: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  __v?: number;
}
