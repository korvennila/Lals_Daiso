/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { AsyncResult, Customer, FeatureState } from '@msdyn365-commerce/retail-proxy';
import { AttributeDefinition } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';

export interface IAccountProfileData {
    customerInformation: AsyncResult<Customer>;
    attributeDefinitions: AsyncResult<AttributeDefinition[]>;
    featureState: AsyncResult<FeatureState[]>;
}
