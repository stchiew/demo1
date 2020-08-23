import * as React from 'react';
import styles from './DemoWorld2.module.scss';
import { IDemoWorld2Props, IDemoWorld2State } from './IDemoWorld2Props';
import { escape } from '@microsoft/sp-lodash-subset';
import { FieldTextRenderer } from '@pnp/spfx-controls-react/lib/FieldTextRenderer';
import { IViewField, ListView } from '@pnp/spfx-controls-react/lib/ListView';
import { IconButton, IIconProps, DefaultButton, IPage } from 'office-ui-fabric-react';
import { DetailsList, buildColumns, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { IEntry } from '../model/IPage';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface IResponse {
  Id: number;
  Title: string;
  Page_x0020_Type: string;
}
export default class DemoWorld2 extends React.Component<IDemoWorld2Props, IDemoWorld2State> {

  private async _loadPages(): Promise<void> {
    const _response: IResponse[] = await sp.web.lists
      .getByTitle('Site Pages').items
      .select("Id", "Title", "Page_x0020_Type")
      .get();
    const _items: IEntry[] = _response.map((item: IResponse) => {
      const _like: boolean = this._getLikeInfo(item.Page_x0020_Type);
      return {
        Title: item.Title,
        Id: item.Id,
        LikedByMe: _like
      };
    });
    this.setState({ items: _items });
  }
  private _getLikeInfo(ServerPathUrl: string): boolean {
    return true;
  }

  constructor(props: Readonly<IDemoWorld2Props>) {
    super(props);
    this.state = { items: [] };
    //this._renderIcon = this._renderIcon.bind(this);
    this._alertClicked = this._alertClicked.bind(this);

  }

  public componentDidMount() {
    this._loadPages();
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


  public render(): React.ReactElement<IDemoWorld2Props> {
    return (
      <div className={styles.demoWorld2}>
        <div className={styles.container}>
          <DetailsList
            items={this.state.items}
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

  private _renderTitle(item?: IEntry): any {
    return <FieldTextRenderer text={item.Title} />;
  }

  private _renderIcon(item?: IEntry): any {
    const emojiIcon: IIconProps = { iconName: item.LikedByMe ? 'LikeSolid' : 'Like' };
    return (<div><IconButton title='Title' iconProps={emojiIcon} onClick={() => _iCLicked(item.Title)} /></div>);
  }
  public _alertClicked(item: string) {
    alert('I Clicked ' + item);
  }
}

function _iCLicked(item: string) {
  alert('Clicked ' + item);
}
