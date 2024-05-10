/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { AsyncResult, AttributeValue, MediaLocation, SimpleProduct } from '@msdyn365-commerce/retail-proxy';

export interface IProductSpecificationData {
    product: AsyncResult<SimpleProduct>;
    productSpecificationData: AsyncResult<AttributeValue[]>;
    additionalMediaLocations: AsyncResult<MediaLocation[]>;
}
