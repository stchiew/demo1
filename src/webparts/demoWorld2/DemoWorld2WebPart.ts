import { ISubmission } from './model/IPage';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DemoWorld2WebPartStrings';
import DemoWorld2 from './components/DemoWorld2';
import { IDemoWorld2Props } from './components/IDemoWorld2Props';

import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { Web } from '@pnp/sp/webs';

export interface IDemoWorld2WebPartProps {
  description: string;
}

export default class DemoWorld2WebPart extends BaseClientSideWebPart<IDemoWorld2WebPartProps> {

  private _items: ISubmission[];

  protected async onInit(): Promise<void> {
    await super.onInit();

    sp.setup({
      spfxContext: this.context
    });

    this._items = await sp.web.lists.getByTitle('Site Pages').items
      .select('Id,Title,File/ServerRelativeUrl')
      .expand('File')
      .get();

    this._items.forEach((item, i) => {
      item.LikedByMe = false;
    });
    console.log('Initial');
    console.log(this._items);
  }

  private _getLikeInfo(ServerPathUrl: string): boolean {
    let _likestatus: boolean = false;
    this._getPageInfo(ServerPathUrl).then((i) => {
      _likestatus = i;
    });

    return _likestatus;
  }

  private async _getPageInfo(ServerPathUrl: string): Promise<boolean> {
    const page = await Web(this.context.pageContext.site.absoluteUrl).loadClientsidePage(ServerPathUrl);
    const info = (await page.getLikedByInformation()).isLikedByUser;
    console.log(info);
    return info;
  }


  public render(): void {
    const element: React.ReactElement<IDemoWorld2Props> = React.createElement(
      DemoWorld2,
      {
        items: this._items,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private _getPages() {

  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
