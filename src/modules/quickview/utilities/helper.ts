/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { IRequestContext } from '@msdyn365-commerce/core';

/**
 * Gets correct alt text for image based on configuration of site.
 * @param context Current request context.
 * @param shouldUseCmsAltText Should use CMS alt text.
 * @param productName Product name.
 * @param imageAltText Alt-text from CMS image.
 */
export function getAltText(
    context: IRequestContext,
    shouldUseCmsAltText: boolean,
    productName?: string,
    imageAltText?: string
): string | undefined {
    if (!context?.app?.config?.OmniChannelMedia) {
        return productName;
    }
    if (shouldUseCmsAltText) {
        return imageAltText;
    }
    return productName;
}
