export interface ITeam {
  _id: string;
  username: string;
  password: string;
  score: number;
  gameId: string;
  progression: EnigmaStatus[];
  currentEnigmaId: string;
  updatedAt?: Date;
  createdAt?: Date;
  __v?: number;
}

interface EnigmaStatus {
  enigmaId: string;
  done: boolean;
  score: number;
}
