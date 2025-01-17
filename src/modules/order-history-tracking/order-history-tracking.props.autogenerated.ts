/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IOrderHistoryTracking contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export const enum titleHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IOrderHistoryTrackingConfig extends Msdyn365.IModuleConfig {
    showText?: string;
    titleHeadingTag?: titleHeadingTag;
    orderPlacedText?: string;
    orderConfirmedText?: string;
    readyToShipText?: string;
    shippedText?: string;
    outForDeliveryText?: string;
    deliveredText?: string;
}

export interface IOrderHistoryTrackingResources {
    textBoxPlaceholder: string;
    submitButtonText: string;
    noResultText: string;
    networkResponseText: string;
}

export interface IOrderHistoryTrackingProps<T> extends Msdyn365.IModule<T> {
    resources: IOrderHistoryTrackingResources;
    config: IOrderHistoryTrackingConfig;
}
