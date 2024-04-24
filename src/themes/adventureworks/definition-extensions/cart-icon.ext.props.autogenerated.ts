/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ICartIcon containerModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';
import * as React from 'react';

export const enum cartLinesSortOrder {
    ascending = 'ascending',
    descending = 'descending'
}

export interface ICartIconConfig extends Msdyn365.IModuleConfig {
    imageSettings?: Msdyn365.IImageSettings;
    enableHoverCart?: boolean;
    cartLinesSortOrder?: cartLinesSortOrder;
    isAnonymousCheckout?: boolean;
    clientRender?: boolean;
}

export interface ICartIconResources {
    goToCartButtonTitle: string;
    totalPriceFormatString: string;
    guestCheckoutButtonTitle: string;
    checkoutButtonTitle: string;
    productDimensionTypeColor: string;
    productDimensionTypeSize: string;
    productDimensionTypeStyle: string;
    productDimensionTypeConfiguration: string;
    quantityDisplayText: string;
    removeCartButtonText: string;
    cartLabel: string;
    cartQtyLabel: string;
    flyoutTitle: string;
    salesAgreementPricePrompt: string;
    shippingText: string;
    checkoutBlockedDueToUnavailableFundsTitle: string;
    checkoutBlockedDueToUnavailableFundsMessage: string;
    continueShoppingButtonTitle: string;
    subTotalMessage: string;
    item: string;
    items: string;
    emptyPrice: string;
}

export interface ICartIconProps<T> extends Msdyn365.IModule<T> {
    resources: ICartIconResources;
    config: ICartIconConfig;
    slots: {
        emptyCart: React.ReactNode[];
        promoContentItem: React.ReactNode[];
    };
}
