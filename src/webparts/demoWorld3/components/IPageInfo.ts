export interface ITitle {
  Title?: string;
}
export interface IPageInfo {
  Id: number;
  Title: string;
  LikedBy?: ITitle[];
  LikesCount: number;
}