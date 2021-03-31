export interface IEnigma {
  _id: string;
  name: string;
  description: string;
  pictureUrl: string;
  question: string;
  positionX: number;
  positionY: number;
  scoreValue: number;
  isActive: boolean;
  geoGroupId: string;
  isLinked: boolean;
  nextEnigmaId: string;
  updatedAt?: Date;
  createdAt?: Date;
  __v?: number;
}
