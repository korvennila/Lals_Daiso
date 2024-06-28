/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { IActionContext } from '@msdyn365-commerce/core';
import { ICartState } from '@msdyn365-commerce/global-state';
import { ProductDeliveryOptions, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import {
    ActiveCartProductsInput,
    getActiveCartProductsAction,
    getAvailabilitiesForCartLineItems,
    getDeliveryOptionsForCartLineItems,
    IProductInventoryInformation,
    ProductAvailabilitiesForCartLineItems,
    ProductDeliveryOptionsForCartLineItems
} from '@msdyn365-commerce-modules/retail-actions';

/**
 * IMiniCartData entity interface.
 */
export interface IMiniCartData {
    products?: SimpleProduct[];
    productAvailabilites?: IProductInventoryInformation[];
    deliveryOptions?: ProductDeliveryOptions[];
}

export const createInput = () => {
    return new ActiveCartProductsInput();
};

/**
 * Calls the Retail API and returns a mini cart data.
 * @param ctx
 * @param cartState
 */
export async function getMiniCartData(ctx: IActionContext, cartState: ICartState): Promise<IMiniCartData> {
    const miniCartData: IMiniCartData = {};

    const cart = cartState.cart;

    // If there are cart lines, make call to get products
    // If there are invocie linese, then there is no products, so don't make call to get products
    if (cart && cart.CartLines && cart.CartLines.length > 0 && !cartState.hasInvoiceLine) {
        await getActiveCartProductsAction(new ActiveCartProductsInput(), ctx)
            .then(products => {
                if (products) {
                    miniCartData.products = products;
                }
            })
            .catch(error => {
                ctx.telemetry.exception(error);
                throw new Error('[getActiveCartWithProdcuts]Unable to hydrate cart with product information');
            });

        await getAvailabilitiesForCartLineItems(new ProductAvailabilitiesForCartLineItems(ctx.requestContext.apiSettings), ctx)
            .then(availableQuantity => {
                if (availableQuantity) {
                    miniCartData.productAvailabilites = availableQuantity;
                }
            })
            .catch(error => {
                ctx.telemetry.exception(error);
                throw new Error('[getActiveCartWithProdcuts]Unable to hydrate cart with product information');
            });

        await getDeliveryOptionsForCartLineItems(new ProductDeliveryOptionsForCartLineItems(ctx.requestContext.apiSettings), ctx)
            .then(deliveryOptions => {
                if (deliveryOptions) {
                    miniCartData.deliveryOptions = deliveryOptions;
                }
            })
            .catch(error => {
                ctx.telemetry.exception(error);
                throw new Error('[getActiveCartWithProdcuts]Unable to hydrate cart with product information');
            });
    }

    return miniCartData;
}
