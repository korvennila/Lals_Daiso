/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ICodOrderConfirmation contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface ICodOrderConfirmationConfig extends Msdyn365.IModuleConfig {
    showText?: string;
}

export interface ICodOrderConfirmationResources {
    resourceKey: string;
}

export interface ICodOrderConfirmationProps<T> extends Msdyn365.IModule<T> {
    resources: ICodOrderConfirmationResources;
    config: ICodOrderConfirmationConfig;
}
