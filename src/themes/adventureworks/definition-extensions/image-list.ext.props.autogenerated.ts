/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IImageList contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export const enum displayStyle {
    vertical = 'vertical',
    horizontal = 'horizontal'
}

export const enum imagePlacement {
    top = 'top',
    bottom = 'bottom',
    left = 'left',
    right = 'right'
}

export const enum contentAlignment {
    left = 'left',
    right = 'right',
    center = 'center'
}

export interface IImageListConfig extends Msdyn365.IModuleConfig {
    heading?: IHeadingData;
    images?: IImagesData[];
    className?: string;
    clientRender?: boolean;
    displayStyle?: displayStyle;
    imagePlacement?: imagePlacement;
    contentAlignment?: contentAlignment;
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

export interface IImagesData {
    image?: Msdyn365.IImageData;
    link?: ILinkData;
    paragraph?: Msdyn365.RichText;
}

export interface ILinkData {
    linkText?: string;
    linkUrl: Msdyn365.ILinkData;
    ariaLabel?: string;
    openInNewTab?: boolean;
}

export interface IImageListProps<T> extends Msdyn365.IModule<T> {
    config: IImageListConfig;
}
