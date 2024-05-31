/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IUnsubscribe contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IUnsubscribeConfig extends Msdyn365.IModuleConfig {
    showText?: string;
}

export interface IUnsubscribeResources {
    resourceKey: string;
}

export interface IUnsubscribeProps<T> extends Msdyn365.IModule<T> {
    resources: IUnsubscribeResources;
    config: IUnsubscribeConfig;
}
