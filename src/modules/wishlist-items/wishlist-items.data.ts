/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { FullProduct } from '@msdyn365-commerce/commerce-entities';
import { ICartState } from '@msdyn365-commerce/global-state';
import { AsyncResult, CartConfiguration, CommerceList, Customer, FeatureState } from '@msdyn365-commerce/retail-proxy';
import { IProductInventoryInformation } from '@msdyn365-commerce-modules/retail-actions';

export interface IWishlistItemsData {
    cart: AsyncResult<ICartState>;
    products: AsyncResult<FullProduct[]> | AsyncResult<FullProduct>[];
    wishlists: AsyncResult<CommerceList[]>;
    productAvailability: AsyncResult<IProductInventoryInformation[]>;
    customerInformation: AsyncResult<Customer>;
    featureState: AsyncResult<FeatureState[]>;
    cartConfiguration?: AsyncResult<CartConfiguration>;
}
