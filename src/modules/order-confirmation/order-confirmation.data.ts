/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import {
    AsyncResult,
    ChannelDeliveryOptionConfiguration,
    Customer,
    FeatureState,
    LoyaltyCard,
    ProductDeliveryOptions,
    SalesOrder,
    SimpleProduct,
    TenderType
} from '@msdyn365-commerce/retail-proxy';

export interface IOrderConfirmationData {
    orderHydration: AsyncResult<{
        salesOrder: SalesOrder;
        products: SimpleProduct[];
        deliveryOptions?: AsyncResult<ProductDeliveryOptions[]>;
    }>;
    tenderTypes: AsyncResult<TenderType[]>;
    loyaltyCard: AsyncResult<LoyaltyCard>;
    featureState: AsyncResult<FeatureState[]>;
    channelDeliveryOptionConfig: AsyncResult<ChannelDeliveryOptionConfiguration>;
    accountInformation?: AsyncResult<Customer>;
}
