import {IAnswer} from './answer.interface';
import {IProposition} from './proposition.interface';

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
  order: number;
  updatedAt?: Date;
  createdAt?: Date;
  __v?: number;
}

export interface IFullEnigma {
  enigma: IEnigma;
  answer: IAnswer;
  propositions: IProposition[];
}
