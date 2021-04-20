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
  geoGroupId: string;
  geoGroupName: string;
  geoGroupScore: number;
  geoGroupScoreValue: number;
  enigmasProgression: [{
    enigmaId: string;
    enigmaName: string;
    done: boolean;
    score: number;
    scoreValue: number;
    usedHintsIds: string[];
    attemptsNumber: number;
  }];
}
