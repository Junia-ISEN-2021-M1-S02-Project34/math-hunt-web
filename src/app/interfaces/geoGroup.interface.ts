export interface IGeoGroup {
  _id: string;
  name: string;
  positionX: number;
  positionY: number;
  radius: number;
  pictureUrl: string;
  updatedAt?: Date;
  createdAt?: Date;
  __v?: number;
}
