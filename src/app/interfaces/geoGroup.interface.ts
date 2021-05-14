export interface IGeoGroup {
  _id: string;
  name: string;
  positionX: number;
  positionY: number;
  radius: number;
  pictureUrl: string;
  order: number;
  updatedAt?: Date;
  createdAt?: Date;
  __v?: number;
}
