import { IEntry } from './../model/IPage';
import { IWebPartContext } from "@microsoft/sp-webpart-base";

export interface IDemoWorld2Props {
  items: any;
  context: IWebPartContext;
}

export interface IDemoWorld2State {
  items: IEntry[];
}
