import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DemoWorld1WebPartStrings';
import LikeBox, { ILikeBoxProps } from './components/LikeBox';
import { sp } from "@pnp/sp/presets/all";

export interface IDemoWorld1WebPartProps {
  description: string;
}


export default class DemoWorld1WebPart extends BaseClientSideWebPart<IDemoWorld1WebPartProps> {
  protected async onInit(): Promise<void> {

    await super.onInit();

    // other init code may be present

    sp.setup(this.context);
  }

  public render(): void {
    const element: React.ReactElement<ILikeBoxProps> = React.createElement(
      LikeBox,
      {
        description: this.properties.description,
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
