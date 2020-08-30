export interface IEntry {
  Id: number;
  Title: string;
  LikedByMe: boolean;
}

export interface IFile {
  ServerRelativeUrl: string;
}

export interface IResponse {
  Id: number;
  Title: string;
  File: IFile;
}

export interface ISubmission {
  Id: number;
  Title: string;
  File: IFile;
  LikedByMe: boolean;
}