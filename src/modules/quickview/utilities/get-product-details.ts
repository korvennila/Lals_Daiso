/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { IActionContext } from '@msdyn365-commerce/core';
import { getCartStateData, GetCartStateDataInput } from '@msdyn365-commerce/global-state';
import { ProductDimension } from '@msdyn365-commerce/retail-proxy';
import {
    getDimensionsForSelectedVariant,
    GetDimensionsForSelectedVariantInput,
    getPriceForSelectedVariant,
    getProductAvailabilitiesForSelectedVariant,
    getRatingsSummary,
    GetRatingsSummaryInput,
    getRnrEndpointId,
    getRnrPartnerId,
    getSelectedVariant,
    PriceForSelectedVariantInput,
    ProductAvailabilitiesForSelectedVariantInput,
    SelectedVariantInput
} from '@msdyn365-commerce-modules/retail-actions';

import { IProductDetails } from '@msdyn365-commerce-modules/buybox';

/**
 * Calls the Retail API and returns the product details.
 * @param productId
 * @param channelId
 * @param ctx
 * @param selectedDimensions - Dimensions previously selected for the product variant.
 */
export async function getProductDetails(
    productId: number,
    channelId: number,
    ctx: IActionContext,
    selectedDimensions?: ProductDimension[]
): Promise<IProductDetails> {
    const productDetails: IProductDetails = {};

    if (productId > 0 && channelId > 0) {
        const tenantId = getRnrPartnerId(ctx);
        const serviceEndPoint = getRnrEndpointId(ctx);

        // Get Product Details
        await getSelectedVariant(new SelectedVariantInput(productId, channelId, selectedDimensions, 'get', ctx.requestContext), ctx)
            .then(async productResult => {
                if (productResult) {
                    productDetails.product = productResult;
                }
            })
            .catch(error => {
                ctx.telemetry.exception(error);
            });

        // Get Product Availability
        await getProductAvailabilitiesForSelectedVariant(new ProductAvailabilitiesForSelectedVariantInput(productId, channelId), ctx)
            .then(productAvailabilities => {
                if (productAvailabilities) {
                    productDetails.productAvailableQuantity = productAvailabilities;
                }
            })
            .catch(error => {
                ctx.telemetry.exception(error);
            });

        // Get Product Price
        await getPriceForSelectedVariant(new PriceForSelectedVariantInput(productId, channelId, undefined), ctx)
            .then(productPrice => {
                if (productPrice) {
                    productDetails.productPrice = productPrice;
                }
            })
            .catch(error => {
                ctx.telemetry.exception(error);
            });

        // Get product dimensions
        await getDimensionsForSelectedVariant(
            new GetDimensionsForSelectedVariantInput(productId, channelId, selectedDimensions, ctx.requestContext),
            ctx
        )
            .then(productDimensions => {
                if (productDimensions) {
                    productDetails.productDimensions = productDimensions;
                }
            })
            .catch(error => {
                ctx.telemetry.exception(error);
            });

        // Get Cart State
        await getCartStateData(new GetCartStateDataInput(ctx.requestContext.apiSettings, ctx.requestContext), ctx)
            .then(cartState => {
                productDetails.cart = cartState;
            })
            .catch(error => {
                ctx.telemetry.exception(error);
            });

        // Get Product Ratings
        if (tenantId && serviceEndPoint) {
            await getRatingsSummary(new GetRatingsSummaryInput(productId.toString(), tenantId, serviceEndPoint), ctx)
                .then(ratingsSummaryData => {
                    if (ratingsSummaryData) {
                        productDetails.ratingsSummary = ratingsSummaryData;
                    }
                })
                .catch(error => {
                    ctx.telemetry.exception(error);
                });
        }
    }

    return productDetails;
}
