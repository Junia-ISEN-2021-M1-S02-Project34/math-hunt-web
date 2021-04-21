export interface IHint {
  _id: string;
  name: string;
  text: string;
  rank: number;
  penalty: number;
  propositionToRemove: string;
  enigmaId: string;
  updatedAt?: Date;
  createdAt?: Date;
  __v?: number;
}
