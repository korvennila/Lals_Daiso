/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IWishlistItems contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IWishlistItemsConfig extends Msdyn365.IModuleConfig {
    heading?: IHeadingData;
    imageSettings?: Msdyn365.IImageSettings;
    enableImageProductLink?: boolean;
    className?: string;
    clientRender?: boolean;
}

export interface IWishlistItemsResources {
    emptyWishlistText: string;
    noLongerExitsWishlistItemText: string;
    priceFree: string;
    unableToGetWishlist: string;
    removeButtonText: string;
    addToCartButtonText: string;
    removeButtonAriaLabel: string;
    waitingClass: string;
    outOfStockText: string;
    addedToCartSuccessMessage: string;
    addedToCartFailureMessage: string;
    maxQuantityLimitText: string;
    originalPriceText: string;
    currentPriceText: string;
    productDimensionTypeColor: string;
    productDimensionTypeSize: string;
    productDimensionTypeStyle: string;
    productDimensionTypeAmount: string;
    wishlistErrorGettingWishlist: string;
    invoiceInCartErrorMessage: string;
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

export interface IWishlistItemsProps<T> extends Msdyn365.IModule<T> {
    resources: IWishlistItemsResources;
    config: IWishlistItemsConfig;
}
