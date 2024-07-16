/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { commerceApiRequest, getCatalogId, IActionContext, IImageData, IImageSettings } from '@msdyn365-commerce/core';
import { MediaLocation, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import { getMediaLocationsForSelectedVariant, MediaLocationsForSelectedVariantInput } from '@msdyn365-commerce-modules/retail-actions';
import { getAltText } from './helper';

export async function getValidProductImages(
    productId: number,
    channelId: number,
    actionContext: IActionContext,
    imageSettings: IImageSettings,
    selectedProduct?: SimpleProduct
): Promise<IImageData[]> {
    const catalogId = getCatalogId(actionContext.requestContext);
    const actionInput = new MediaLocationsForSelectedVariantInput(productId, channelId, selectedProduct, catalogId);

    return getMediaLocationsForSelectedVariant(actionInput, actionContext)
        .then(mediaLocations => {
            if (mediaLocations) {
                return Promise.all(mediaLocations.map(async mediaLocation => validateMediaLocaionAsync(mediaLocation, imageSettings))).then(
                    pairs => {
                        return pairs.filter(pair => pair[1]).map(pair => pair[0]);
                    }
                );
            }
            return [];
        })
        .catch(error => {
            actionContext.telemetry.exception(error);
            actionContext.telemetry.debug('Unable to get Media Locations for Selected Variant');
            return [];
        });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unused-vars-experimental -- .
async function validateMediaLocaionAsync(mediaLocation: MediaLocation, imageSettings?: IImageSettings): Promise<[IImageData, boolean]> {
    const imageData = {
        src: mediaLocation.Uri || '',
        altText: mediaLocation.AltText || ''
    };

    if (imageData.src === '') {
        return [imageData, false];
    }

    return new Promise<[IImageData, boolean]>(resolve => {
        try {
            const http = new XMLHttpRequest();
            http.open('HEAD', imageData.src, true);

            http.addEventListener('load', () => {
                resolve([imageData, http.status === 200 || http.status === 201]);
            });

            http.addEventListener('error', () => {
                resolve([imageData, false]);
            });

            http.send();
        } catch {
            resolve([imageData, false]);
        }
    });
}

/**
 * Gets product variant images on dimension change of buy-box module for Omni scenario.
 * @param productId Product record id.
 * @param shouldUseCmsAltText Alt-text source to use.
 * @param channelId Current channel id.
 * @param actionContext Current action context.
 * @param productName Product name.
 * @param selectedProduct Currently selected variant product.
 * @returns List of images.
 */

export async function getProductImages(
    productId: number,
    shouldUseCmsAltText: boolean,
    channelId: number,
    actionContext: IActionContext,
    productName?: string,
    selectedProduct?: SimpleProduct
): Promise<IImageData[]> {
    const catalogId = getCatalogId(actionContext.requestContext);
    if (actionContext.requestContext?.params?.isPreview) {
        const response = await commerceApiRequest(actionContext.requestContext, 'msdyn365-ochannel-product-info', 'post', {
            productId: productId,
            channelId: channelId,
            catalogId: catalogId
        });
        if (response.status !== 200) {
            actionContext.telemetry.debug('Unable to get Media Locations for Selected Variant for preview scenario');
            return [];
        }
        const previewImageData = response?.data as MediaLocation[];
        if (previewImageData) {
            return previewImageData.map(mediaLocation => {
                return {
                    src: mediaLocation.Uri ?? '',
                    altText: getAltText(actionContext.requestContext, shouldUseCmsAltText, productName, mediaLocation.AltText),
                    additionalProperties: mediaLocation.IsApplicableForChildEntities
                        ? {
                              isApplicableForChildEntities: 'true'
                          }
                        : undefined
                };
            });
        }
        return [];
    }
    const actionInput = new MediaLocationsForSelectedVariantInput(productId, channelId, selectedProduct, catalogId);
    return getMediaLocationsForSelectedVariant(actionInput, actionContext)
        .then(mediaLocations => {
            if (mediaLocations) {
                return mediaLocations.map(mediaLocation => {
                    return {
                        src: mediaLocation.Uri ?? '',
                        altText: getAltText(actionContext.requestContext, shouldUseCmsAltText, productName, mediaLocation.AltText),
                        additionalProperties: mediaLocation.IsApplicableForChildEntities
                            ? {
                                  isApplicableForChildEntities: 'true'
                              }
                            : undefined
                    };
                });
            }
            return [];
        })
        .catch(error => {
            actionContext.telemetry.exception(error);
            actionContext.telemetry.debug('Unable to get Media Locations for Selected Variant');
            return [];
        });
}
