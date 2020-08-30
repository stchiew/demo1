import * as React from 'react';
import styles from './DemoWorld3.module.scss';
import { IDemoWorld3Props } from './IDemoWorld3Props';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IPageInfo, ITitle } from './IPageInfo';
import { Guid } from '@microsoft/sp-core-library';
require("sp-init");
require("microsoft-ajax");
require("sp-runtime");
require("sharepoint");
require("reputation");

export interface IDemoWorld3State {
  isLikedByMe: boolean;
}

export default class DemoWorld3 extends React.Component<IDemoWorld3Props, IDemoWorld3State> {
  private currentId: number;
  private currentUser: any;
  private listGuid: Guid;
  private currentUrl: string;

  constructor(props: IDemoWorld3Props) {
    super(props);
    this.state = { isLikedByMe: false };
    this.currentId = this.props.context.pageContext.listItem.id;
    this.currentUser = this.props.context.pageContext.user.displayName;
    this.currentUrl = this.props.context.pageContext.site.absoluteUrl;
    this.listGuid = this.props.context.pageContext.list.id;
  }
  public render(): React.ReactElement<IDemoWorld3Props> {
    return (
      <div className={styles.demoWorld3}>
        <div className={styles.container}>
          <IconButton iconProps={{ iconName: this.state.isLikedByMe ? 'LikeSolid' : 'Like' }} onClick={this._onClickLike.bind(this)} />

        </div>
      </div>
    );
  }

  public componentDidMount() {
    this._getPageInfo(this.currentId);
  }
  private async _getPageInfo(id: number) {
    const pageInfo: IPageInfo = await sp.web.lists.getByTitle('Site Pages').items.getById(id)
      .select('Id,Title,LikedBy/Title,LikesCount')
      .expand('LikedBy')();
    console.log(pageInfo);
    let likedByArray: any;
    let isLikedByMe: boolean = false;
    if (typeof pageInfo.LikedBy != "undefined") {
      likedByArray = pageInfo.LikedBy.map((user) => user.Title);
      isLikedByMe = likedByArray.includes(this.currentUser);
    }
    console.log(this.currentUser);
    console.log(likedByArray);
    console.log(isLikedByMe);
    this.setState({ isLikedByMe });
  }

  private _onClickLike(): void {
    let _click: boolean = !this.state.isLikedByMe;
    console.log('Clicked! :' + this.state.isLikedByMe);
    const ctx: SP.ClientContext = new SP.ClientContext(this.currentUrl);


    Microsoft.Office.Server.ReputationModel.Reputation.setLike(
      ctx,
      this.listGuid.toString(),
      this.currentId,
      _click
    );
    ctx.executeQueryAsync(
      (sender: any, args: SP.ClientRequestEventArgs): void => {
        //this._getPageInfo(this.currentId);
        //this.setState({myRating:rating});
        this.setState(prevState => ({ isLikedByMe: !prevState.isLikedByMe }));
        console.log('Like is set!');
        //console.log(this.state.isLikedByMe);
      },
      (sender: any, args: SP.ClientRequestFailedEventArgs): void => {
        console.log("Rating failed" + args.get_message());
        this._getPageInfo(this.currentId);
      }
    );
  }
}
