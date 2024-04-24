/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IOrderTemplateList contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IOrderTemplateListConfig extends Msdyn365.IModuleConfig {
    heading?: IHeadingData;
    imageSettings?: Msdyn365.IImageSettings;
    enableImageProductLink?: boolean;
    className?: string;
    clientRender?: boolean;
}

export interface IOrderTemplateListResources {
    emptyOrderTemplateText: string;
    unableToGetOrderTemplateList: string;
    removeButtonText: string;
    addToBagButtonText: string;
    createNewTemplateButtonText: string;
    progressNotificationText: string;
    orderTemplateCreatedSuccessText: string;
    orderTemplateListTitle: string;
    orderTemplateCreationFailedText: string;
    deleteOrderTemplateFailedText: string;
    closeWindowButtonText: string;
    addToCartFailureMessage: string;
    addToCartSuccessMessage: string;
    addToCartProcessMessage: string;
    viewCartButtonText: string;
    orderTemplateCloseButtonText: string;
    linesAddedToCartHeaderItemsOneText: string;
    linesAddedToCartHeaderLinesOneText: string;
    linesAddedToCartHeaderLinesFormatText: string;
    linesAddedToCartHeaderMessageText: string;
    createOrderTemplateHeader: string;
    orderTemplateTitle: string;
    orderTemplateNameAriaLabel: string;
    createOrderTemplateDescription: string;
    createOrderTemplateButtonText: string;
    cancelNewOrderTemplateCreationButtonText: string;
    defaultOrderTemplateName: string;
    orderTemplateErrorMessage: string;
    orderTemplateModalAriaLabel: string;
    headingForEmptyOrderTemplateList: string;
    textForEmptyOrderTemplateList: string;
}

export const enum HeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IHeadingData {
    text: string;
    tag?: HeadingTag;
}

export interface IOrderTemplateListProps<T> extends Msdyn365.IModule<T> {
    resources: IOrderTemplateListResources;
    config: IOrderTemplateListConfig;
}
