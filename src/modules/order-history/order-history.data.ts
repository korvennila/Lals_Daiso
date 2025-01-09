/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import {
    AsyncResult,
    ChannelDeliveryOptionConfiguration,
    ChannelIdentity,
    Customer,
    FeatureState,
    OrgUnitLocation
} from '@msdyn365-commerce/retail-proxy';

export interface IOrderHistoryData {
    channels: AsyncResult<{
        channelIdentities: ChannelIdentity[];
    }>;
    orgUnitLocations: AsyncResult<{
        orgUnitLocations: OrgUnitLocation[];
    }>;
    customerInformation: AsyncResult<Customer>;
    featureState: AsyncResult<FeatureState[]>;
    channelDeliveryOptionConfig: AsyncResult<ChannelDeliveryOptionConfiguration>;
}
