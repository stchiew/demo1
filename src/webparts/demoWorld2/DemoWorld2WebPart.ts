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

export interface IDemoWorld2WebPartProps {
  description: string;
}

export default class DemoWorld2WebPart extends BaseClientSideWebPart<IDemoWorld2WebPartProps> {

  private _items: any[];

  protected async onInit(): Promise<void> {
    await super.onInit();

    sp.setup({
      spfxContext: this.context
    });

    this._items = await sp.web.lists.getByTitle('Site Pages').items.get();
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
