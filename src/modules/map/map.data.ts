/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { AsyncResult } from '@msdyn365-commerce/retail-proxy';
import { IStoreSelectorStateManager } from '@msdyn365-commerce-modules/bopis-utilities';
import { IDistributorSelectorStateManager } from '@msdyn365-commerce-modules/distributor-utilities';

export interface IMapData {
    actionResponse: { text: string };
    distributorSelectorStateManager?: AsyncResult<IDistributorSelectorStateManager>;
    storeSelectorStateManager: AsyncResult<IStoreSelectorStateManager>;
}
