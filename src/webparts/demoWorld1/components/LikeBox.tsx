import * as React from "react";
import { IWebPartContext } from "@microsoft/sp-webpart-base";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { IPageItem } from './IPageItem';
import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/comments";
import "@pnp/sp/comments/item";
import { ILikeData, ILikedByInformation } from "@pnp/sp/comments";
import { IItem } from "@pnp/sp/items";


export interface ILikeBoxProps {
  description: string;
  context: IWebPartContext;
}

export interface ILikeBoxState {
  isLikedByMe: boolean;
}

class LikeBox extends React.Component<ILikeBoxProps, ILikeBoxState> {
  private itemid: number = 0;
  constructor(props: ILikeBoxProps) {
    super(props);
    this.state = { isLikedByMe: false };

    this.itemid = this.props.context.pageContext.listItem.id;
  }

  public render() {
    return (
      <IconButton iconProps={{ iconName: this.state.isLikedByMe ? 'LikeSolid' : 'Like' }} title='Like Me!' />
    );
  }

  public componentDidMount() {
    this._getPageLike(this.itemid);
  }

  private async _getPageLike(id: number) {
    const item = await sp.web.lists.getByTitle("JudgingPanel").items.getById(1)();
    const pageItem = await sp.web.lists.getByTitle("JudgingPanel").items.getById(1).getLikedByInformation();
    console.log(item);
    console.log(pageItem);
    // get the liked by data
    //const likedByData: ILikeData[] = await pageItem.getLikedBy();
    // get the liked by information
    //const likedByInfo: ILikedByInformation = await pageItem.getLikedByInformation();
    //console.log(likedByData);
    //console.log(likedByInfo);




  }
}

//TODO
// Component mounted
// Get current users like state of current page's item
// update state
// component remounts

export default LikeBox;