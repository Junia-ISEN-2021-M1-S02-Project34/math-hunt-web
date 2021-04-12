export interface ITeam {
  _id: string;
  username: string;
  password: string;
  score: number;
  gameId: string;
  progression: IEnigmaStatus[];
  currentEnigmaId: string;
  currentGeoGroupId: string;
  isConnected: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  __v?: number;
}

interface IEnigmaStatus {
  enigmaId: string;
  geoGroupId: string;
  done: boolean;
  score: number;
  usedHintsIds: string[];
}
