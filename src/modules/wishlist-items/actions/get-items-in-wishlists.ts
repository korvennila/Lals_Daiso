/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { FullProduct } from '@msdyn365-commerce/commerce-entities';
import {
    CacheType,
    createObservableDataAction,
    IAction,
    IActionContext,
    IActionInput,
    ICreateActionContext
} from '@msdyn365-commerce/core';
import { CommerceListLine } from '@msdyn365-commerce/retail-proxy';
import { getByCustomerAsync } from '@msdyn365-commerce/retail-proxy/dist/DataActions/CommerceListsDataActions.g';
import { FullProductInput, getFullProducts, getProductDetailsCriteriaFromActionInput } from '@msdyn365-commerce-modules/retail-actions';

/**
 * Input class for getActiveWishlistItems data action.
 */
export class ActiveWishlistInput implements IActionInput {
    public getCacheKey = () => 'ActiveWishlistItems';

    public getCacheObjectType = () => 'ActiveWishlistItems';

    public dataCacheType = (): CacheType => 'none';
}

const createInput = (inputData: ICreateActionContext) => {
    return new ActiveWishlistInput();
};

/**
 * Calls the Retail API and returns a CommerceList object based on the passed GetCartInput.
 * @param input
 * @param ctx
 */
export async function getActiveWishlistItems(input: ActiveWishlistInput, ctx: IActionContext): Promise<FullProduct[]> {
    // If no cart ID is provided in input, we need to create a cart object
    if (!input) {
        throw new Error('[getActiveWishlistItems]No valid Input was provided, failing');
    }

    if (ctx.requestContext.user.isAuthenticated) {
        const wishlists = await getByCustomerAsync(
            {
                callerContext: ctx,
                queryResultSettings: {}
            },
            null
        );

        if (wishlists && wishlists.length > 0) {
            const productInputs: FullProductInput[] = [];
            wishlists.forEach(currWishlist => {
                if (currWishlist.CommerceListLines) {
                    currWishlist.CommerceListLines.forEach((commerceListLine: CommerceListLine) => {
                        if (commerceListLine.ProductId) {
                            productInputs.push(
                                new FullProductInput(
                                    commerceListLine.ProductId,
                                    ctx.requestContext.apiSettings,
                                    getProductDetailsCriteriaFromActionInput(ctx),
                                    ctx.requestContext
                                )
                            );
                        }
                    });
                }
            });

            if (productInputs.length > 0) {
                return getFullProducts(productInputs, ctx)
                    .then(products => {
                        if (products) {
                            return products;
                        }
                        return <FullProduct[]>[];
                    })
                    .catch(error => {
                        ctx.trace(error);
                        ctx.telemetry.error(error.message);
                        ctx.telemetry.debug('[getActiveWishlistItems]Unable to hydrate cart with product information');
                        throw new Error('[getActiveWishlistItems]Unable to hydrate cart with product information');
                    });
            }
            ctx.trace('No productIds found for wishlist');
        } else {
            ctx.trace('[getActiveWishlistItems]Not able to get wishlists for the customer');
            return <FullProduct[]>[];
        }
    }
    ctx.trace('[getActiveWishlistItems]User token not found for wishlists');
    return <FullProduct[]>[];
}

export const getActiveWishlistItemsDataAction = createObservableDataAction({
    id: '@msdyn365-commerce-modules/wishlist/wishlist-items/get-items-in-wishlist',
    action: <IAction<FullProduct[]>>getActiveWishlistItems,
    input: createInput
});

export default getActiveWishlistItemsDataAction;
