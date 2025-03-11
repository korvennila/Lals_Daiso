/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { ICheckoutState } from '@msdyn365-commerce/global-state';
import { AsyncResult, CardPaymentAcceptPoint, ChannelDeliveryOptionConfiguration, FeatureState } from '@msdyn365-commerce/retail-proxy';

export interface ICheckoutPaymentInstrumentData {
    checkout: AsyncResult<ICheckoutState>;
    cardPaymentAcceptPoint: AsyncResult<CardPaymentAcceptPoint>;
    channelDeliveryOptionConfig: AsyncResult<ChannelDeliveryOptionConfiguration>;
    featureState: AsyncResult<FeatureState[]>;
}
