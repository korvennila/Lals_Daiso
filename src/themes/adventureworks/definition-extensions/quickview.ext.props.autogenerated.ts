/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IQuickview containerModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';
import * as React from 'react';

export const enum titleHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export const enum altTextSource {
    product = 'product',
    cms = 'cms'
}

export interface IQuickviewConfig extends Msdyn365.IModuleConfig {
    titleHeadingTag?: titleHeadingTag;
    enableKeyInPrice?: boolean;
    minimumKeyInPrice?: number;
    maximumKeyInPrice?: number;
    thumbnailImageSettings?: Msdyn365.IImageSettings;
    galleryImageSettings?: Msdyn365.IImageSettings;
    seeDetailsLinkText: string;
    altTextSource?: altTextSource;
    shouldHideMasterProductImagesForVariant?: boolean;
    className?: string;
    clientRender?: boolean;
}

export interface IQuickviewResources {
    quickViewbuttonText: string;
    invalidSmallCustomAmountText: string;
    buyBoxGoToCartText: string;
    buyBoxContinueShoppingText: string;
    buyBoxSingleItemText: string;
    buyBoxMultiLineItemFormatText: string;
    buyBoxHeaderMessageText: string;
    priceFree: string;
    originalPriceText: string;
    currentPriceText: string;
    addToCartText: string;
    outOfStockText: string;
    averageRatingAriaLabel: string;
    addToOrderTemplateHeader: string;
    noOrderTemplatesMessage: string;
    noOrderTemplatesDescription: string;
    createAnOrderTemplateButtonText: string;
    cancelOrderTemplateCreationButtonText: string;
    selectTemplatesText: string;
    addToTemplateButtonText: string;
    addToOrderTemplateButtonTooltip: string;
    lineItemsText: string;
    createOrderTemplateHeader: string;
    orderTemplateTitle: string;
    orderTemplateNameAriaLabel: string;
    createOrderTemplateDescription: string;
    createNewOrderTemplateButtonText: string;
    createOrderTemplateButtonText: string;
    cancelNewOrderTemplateCreationButtonText: string;
    itemAddedToOrderTemplateHeaderItemOneText: string;
    itemAddedToOrderTemplateHeaderItemFormatText: string;
    itemAddedToOrderTemplateHeaderMessageText: string;
    invalidLargeCustomAmountText: string;
    addedQuantityText: string;
    defaultOrderTemplateName: string;
    viewOrderTemplateButtonText: string;
    continueShoppingButtonText: string;
    duplicatedProductsHeader: string;
    duplicatedProductsDescription: string;
    updateQuantityButtonText: string;
    cancelDuplicateItemsButtonText: string;
    addToOrderTemplateButtonText: string;
    addToWishlistButtonText: string;
    removeFromWishlistButtonText: string;
    addToWishlistMessage: string;
    removedFromWishlistMessage: string;
    addItemToWishlistError: string;
    removeItemFromWishlistError: string;
    nameOfWishlist: string;
    productQuantityHeading: string;
    inputQuantityAriaLabel: string;
    buyboxKeyInPriceLabelHeading: string;
    buyboxErrorMessageHeader: string;
    maxQuantityText: string;
    errorMessageOutOfStock: string;
    errorMessageOutOfRangeOneLeft: string;
    errorMessageOutOfRangeFormat: string;
    addedToCartFailureMessage: string;
    maxQuantityLimitText: string;
    productDimensionTypeColorErrorMessage: string;
    productDimensionTypeConfigurationErrorMessage: string;
    productDimensionTypeSizeErrorMessage: string;
    productDimensionTypeAmountErrorMessage: string;
    productDimensionTypeStyleErrorMessage: string;
    minQuantityText: string;
    selectDimensionFormatString: string;
    productDimensionTypeColor: string;
    productDimensionTypeConfiguration: string;
    productDimensionTypeSize: string;
    productDimensionTypeStyle: string;
    productDimensionTypeAmount: string;
    nextScreenshotFlipperText: string;
    previousScreenshotFlipperText: string;
    decrementButtonAriaLabel: string;
    incrementButtonAriaLabel: string;
    closeNotificationLabel: string;
    loadingText: string;
    quickViewAriaLabel: string;
    informationIconText: string;
    priceRangeSeparator: string;
    ariaLabelForSlide: string;
    swatchItemAriaLabel: string;
    priceText: string;
    skuText: string;
}

export interface IQuickviewProps<T> extends Msdyn365.IModule<T> {
    resources: IQuickviewResources;
    config: IQuickviewConfig;
    slots: {
        textBlocks: React.ReactNode[];
    };
}
