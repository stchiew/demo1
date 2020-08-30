import * as React from 'react';
import styles from './DemoWorld2.module.scss';
import { IDemoWorld2Props, IDemoWorld2State } from './IDemoWorld2Props';
import { FieldTextRenderer } from '@pnp/spfx-controls-react/lib/FieldTextRenderer';
import { IViewField, ListView } from '@pnp/spfx-controls-react/lib/ListView';
import { IconButton, IIconProps, DefaultButton, IPage } from 'office-ui-fabric-react';
import { DetailsList, buildColumns, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { IEntry, IResponse, ISubmission } from '../model/IPage';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from '@pnp/sp/webs';
import "@pnp/sp/clientside-pages/web";
import '@pnp/sp/comments/clientside-page';
import { ClientsidePageFromFile, IClientsidePage } from '@pnp/sp/presets/all';

var ilike: boolean = false;

export default class DemoWorld2 extends React.Component<IDemoWorld2Props, IDemoWorld2State> {

  constructor(props: Readonly<IDemoWorld2Props>) {
    super(props);
    this.state = {
      entries: this.props.items,
      loading: true
    };
    //this._renderIcon = this._renderIcon.bind(this);
    //this._loadLikes();
  }

  private _loadLikes() {
    const temp: ISubmission[] = this.state.entries;
    console.log('BeforeState');
    console.log(temp);
    temp.forEach(async (item, i) => {
      const page = await Web(this.props.context.pageContext.site.absoluteUrl).loadClientsidePage(item.File.ServerRelativeUrl);
      const info = await page.getLikedByInformation();
      const likedByMe = info.isLikedByUser;
      item.LikedByMe = likedByMe;
    });
    console.log('AfterState');
    console.log(temp);
    this.setState({ entries: temp });

  }

  private async _loadPages(): Promise<void> {
    const _response: ISubmission[] = await sp.web.lists
      .getByTitle('Site Pages').items
      .get();
    /***    
      const _items: IEntry[] = _response.map((item: IResponse) => {
        const _like: boolean = this._getLikeInfo(item.File.ServerRelativeUrl);
        return {
          Title: item.Title,
          Id: item.Id,
          LikedByMe: _like
        };
      });
      this.setState({ items: _items });
      **/
    console.log('All');
    console.log(_response);
    _response.forEach(async (item, i) => {
      const page = await Web(this.props.context.pageContext.site.absoluteUrl).loadClientsidePage(item.File.ServerRelativeUrl);
      const info = await page.getLikedByInformation();
      const likedByMe = info.isLikedByUser;
      item.LikedByMe = likedByMe;
    });
    console.log(_response);
    this.setState({ entries: _response, loading: true });


  }
  private async _getLikeInfo(ServerPathUrl: string): Promise<boolean> {
    let _likestatus: boolean = false;
    await this._getPageInfo(ServerPathUrl);
    _likestatus = ilike;
    console.log(_likestatus);
    return _likestatus;
  }

  private async _getPageInfo(ServerPathUrl: string): Promise<void> {
    const page = await Web(this.props.context.pageContext.site.absoluteUrl).loadClientsidePage(ServerPathUrl);
    const info = (await page.getLikedByInformation()).isLikedByUser;
    console.log('info');
    console.log(info);
    ilike = info;
  }

  public componentDidMount() {
    this._loadLikes();
  }

  public render(): React.ReactElement<IDemoWorld2Props> {

    return (this.state.loading &&
      <div className={styles.demoWorld2} >
        <div className={styles.container}>
          <DetailsList
            items={this.props.items}
            setKey="set"
            columns={this._fields}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="Row checkbox"
          />
        </div>
      </div>
    );
  }

  private _renderTitle(item?: ISubmission): any {
    return <FieldTextRenderer text={item.Title} />;
  }

  private _renderIcon: any = (item?: ISubmission, index?: number, column?: IColumn) => {
    console.log(item.Id);
    console.log(item.LikedByMe);
    const emojiIcon: IIconProps = { iconName: item.LikedByMe ? 'LikeSolid' : 'Like' };
    return (<div>{item.Id}{item.LikedByMe}</div>);
    //return (<div><IconButton title='Title' iconProps={emojiIcon} onClick={() => this.onLikeClicked(item.LikedByMe)} /></div>);
  }

  public onLikeClicked = (isLiked: boolean) => {
    alert('I Clicked ' + isLiked);
  }

  private readonly _fields: IColumn[] = [
    {
      key: 'column1',
      name: 'Id',
      fieldName: 'Id',
      maxWidth: 20,
      minWidth: 10
    },
    {
      key: 'column2',
      name: 'Title',
      fieldName: 'Title',
      maxWidth: 150,
      minWidth: 100
    },
    {
      key: 'column3',
      name: 'Like',
      fieldName: 'LikedByMe',
      maxWidth: 30,
      minWidth: 30,
      onRender: this._renderIcon
    }
  ];
}