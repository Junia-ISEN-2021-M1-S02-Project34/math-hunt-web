export interface IAnswer {
  _id: string;
  enigmaId: string;
  isMcq: boolean;
  solution: string;
  attemptsNumber: number;
  updatedAt?: Date;
  createdAt?: Date;
  __v?: number;
}
