/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import {
    CacheType,
    createObservableDataAction,
    IAction,
    IActionContext,
    IActionInput,
    IAny,
    ICommerceApiSettings,
    ICreateActionContext,
    IGeneric
} from '@msdyn365-commerce/core';
import { getEstimatedAvailabilityAsync } from '@msdyn365-commerce/retail-proxy/dist/DataActions/ProductsDataActions.g';
import { ReleasedProductType } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import {
    ArrayExtensions,
    buildCacheKey,
    createInventoryAvailabilitySearchCriteria,
    IProductInventoryInformation,
    mapAggregatedProductInventoryInformation
} from '@msdyn365-commerce-modules/retail-actions';

import { ActiveWishlistInput, getActiveWishlistItems } from './get-items-in-wishlists';

/**
 * Input class for availabilities for items in wishlist.
 */
export class ProductAvailabilitiesForWishlistItems implements IActionInput {
    private readonly apiSettings: ICommerceApiSettings;

    constructor(apiSettings: ICommerceApiSettings) {
        this.apiSettings = apiSettings;
    }

    public getCacheKey = () => buildCacheKey('ActiveWishlistItemsAvailability', this.apiSettings);

    public getCacheObjectType = () => 'ActiveWishlistItemsAvailability';

    public dataCacheType = (): CacheType => 'request';
}

const createInput = (inputData: ICreateActionContext<IGeneric<IAny>>) => {
    return new ProductAvailabilitiesForWishlistItems(inputData.requestContext.apiSettings);
};

/**
 * Calls the Retail API to get wishlist which will be cached the then finds the quantities for each item.
 * @param input
 * @param ctx
 */
export async function getAvailabilitiesForWishlistItems(
    input: ProductAvailabilitiesForWishlistItems,
    ctx: IActionContext
): Promise<IProductInventoryInformation[]> {
    // If no input is provided fail out
    if (!input) {
        throw new Error('[getAvailabilitiesForWishlistItems]No valid Input was provided, failing');
    }

    const products = await getActiveWishlistItems(new ActiveWishlistInput(), ctx);

    if (!products) {
        ctx.trace('[getAvailabilitiesForWishlistItems] Not able to get products in wishlist');
        return <IProductInventoryInformation[]>[];
    }

    let validProducts: number[] = [];

    for (const product of products) {
        if (
            product.ProductDetails &&
            product.ProductDetails.RecordId &&
            product.ProductDetails.ItemTypeValue !== ReleasedProductType.Service
        ) {
            validProducts.push(product.ProductDetails.RecordId);
        }
    }

    if (validProducts.length === 0) {
        ctx.trace('[getAvailabilitiesForWishlistItems] No products in wishlist');
        return <IProductInventoryInformation[]>[];
    }

    validProducts = ArrayExtensions.unique(validProducts);
    const searchCriteria = createInventoryAvailabilitySearchCriteria(ctx, validProducts, true);
    const productAvailabilities = await getEstimatedAvailabilityAsync({ callerContext: ctx }, searchCriteria);

    if (productAvailabilities && productAvailabilities) {
        return mapAggregatedProductInventoryInformation(ctx, productAvailabilities);
    }

    ctx.trace('[getAvailabilitiesForWishlistItems] unable to get availabilities for product');
    return <IProductInventoryInformation[]>[];
}

export const getAvailabilitiesForWishlistItemsDataAction = createObservableDataAction({
    id: '@msdyn365-commerce-modules/wishlist/wishlist-items/get-product-availabilities-wishlist-items',
    action: <IAction<IProductInventoryInformation[]>>getAvailabilitiesForWishlistItems,
    input: createInput
});

export default getAvailabilitiesForWishlistItemsDataAction;
