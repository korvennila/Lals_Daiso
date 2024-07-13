/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IOurStores contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IOurStoresConfig extends Msdyn365.IModuleConfig {
    showText?: string;
}

export interface IOurStoresResources {
    resourceKey: string;
}

export interface IOurStoresProps<T> extends Msdyn365.IModule<T> {
    resources: IOurStoresResources;
    config: IOurStoresConfig;
}
