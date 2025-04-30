/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { ICartState, ICheckoutState } from '@msdyn365-commerce/global-state';
import { AsyncResult, Customer } from '@msdyn365-commerce/retail-proxy';

export interface ICheckoutGuestProfileData {
    checkout: AsyncResult<ICheckoutState>;
    cart: AsyncResult<ICartState>;
    accountInformation?: AsyncResult<Customer>;
}
