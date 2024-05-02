/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ISocialShare moduleDefinition Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';
import * as React from 'react';

export const enum orientation {
    vertical = 'vertical',
    horizontal = 'horizontal'
}

export interface ISocialShareConfig {
    caption?: string;
    orientation?: orientation;
    className?: string;
    clientRender?: boolean;
}

export interface ISocialShareProps<T> extends Msdyn365.IModule<T> {
    config: ISocialShareConfig;
    slots: {
        socialShareItems: React.ReactNode[];
    };
}
