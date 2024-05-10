/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IProductSpecification contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export const enum displayStyle {
    accordion = 'accordion',
    table = 'table'
}

export interface IProductSpecificationConfig extends Msdyn365.IModuleConfig {
    heading?: IHeadingData;
    displayStyle?: displayStyle;
    hideEmptyProductSpec?: boolean;
    className?: string;
    clientRender?: boolean;
}

export interface IProductSpecificationResources {
    trueValueText: string;
    falseValueText: string;
    additionalDownloadsText: string;
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

export interface IProductSpecificationProps<T> extends Msdyn365.IModule<T> {
    resources: IProductSpecificationResources;
    config: IProductSpecificationConfig;
}
