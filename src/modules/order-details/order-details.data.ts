/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import {
    AsyncResult,
    ChannelDeliveryOptionConfiguration,
    ChannelIdentity,
    FeatureState,
    LoyaltyCard,
    Customer,
    OrderOriginator,
    OrgUnitLocation,
    ProductCatalog,
    ProductDeliveryOptions,
    SalesOrder,
    SimpleProduct,
    TenderType
} from '@msdyn365-commerce/retail-proxy';

export interface IOrderDetailsData {
    orderHydration: AsyncResult<{
        salesOrder: SalesOrder;
        products: SimpleProduct[];
        deliveryOptions?: ProductDeliveryOptions[];
        isSameSiteType?: boolean;
    }>;
    tenderTypes: AsyncResult<TenderType[]>;
    loyaltyCard: AsyncResult<LoyaltyCard>;
    channels: AsyncResult<{
        channelIdentities: ChannelIdentity[];
    }>;
    orgUnitLocations: AsyncResult<{
        orgUnitLocations: OrgUnitLocation[];
    }>;
    featureState: AsyncResult<FeatureState[]>;
    channelDeliveryOptionConfig: AsyncResult<ChannelDeliveryOptionConfiguration>;
    catalogs?: AsyncResult<ProductCatalog[]> | undefined;
    customerInformation?: AsyncResult<Customer>;
    orderOriginators?: AsyncResult<OrderOriginator[]>;
}
