/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { ICartState } from '@msdyn365-commerce/global-state';
import {
    AsyncResult,
    CartConfiguration,
    ChannelDeliveryOptionConfiguration,
    Customer,
    CustomerBalances,
    FeatureState,
    OrgUnitLocation,
    ProductCatalog
} from '@msdyn365-commerce/retail-proxy';

export interface ICartIconData {
    cart: AsyncResult<ICartState>;
    orgUnitLocations: AsyncResult<OrgUnitLocation[]> | undefined;
    channelDeliveryOptionConfig: AsyncResult<ChannelDeliveryOptionConfiguration>;
    customerInformation: AsyncResult<Customer>;
    featureState: AsyncResult<FeatureState[]>;
    catalogs?: AsyncResult<ProductCatalog[]> | undefined;
    customerBalances?: AsyncResult<CustomerBalances> | undefined;
    cartConfiguration?: AsyncResult<CartConfiguration>;
}
