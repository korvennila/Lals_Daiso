/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IActiveImage contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export const enum texttheme {
    dark = 'dark',
    light = 'light'
}

export interface IActiveImageConfig extends Msdyn365.IModuleConfig {
    productImageSettings?: Msdyn365.IImageSettings;
    canvasWidth?: number;
    activeImage?: Msdyn365.IImageData;
    activePoints?: IActivePointsData[];
    heading?: IHeadingData;
    paragraph?: Msdyn365.RichText;
    links?: ILinksData[];
    additionalContent?: IAdditionalContentData;
    className?: string;
    clientRender?: boolean;
    texttheme?: texttheme;
}

export interface IActiveImageResources {
    seeMoreButtonText: string;
    altTextForSeeMoreButtonWithProductName: string;
}

export interface IActivePointsData {
    xPosition?: number;
    yPosition?: number;
    radius?: number;
    itemId?: string;
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

export interface ILinksData {
    linkText?: string;
    linkUrl: Msdyn365.ILinkData;
    ariaLabel?: string;
    openInNewTab?: boolean;
}

export interface IAdditionalContentData {
    heading?: string;
    subtext?: string;
    links?: ILinksData[];
}

export interface ILinksData {
    linkText?: string;
    linkUrl: Msdyn365.ILinkData;
    ariaLabel?: string;
    openInNewTab?: boolean;
}

export interface IActiveImageProps<T> extends Msdyn365.IModule<T> {
    resources: IActiveImageResources;
    config: IActiveImageConfig;
}
