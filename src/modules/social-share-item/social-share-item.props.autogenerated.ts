/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ISocialShareItem contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export const enum socialMedia {
    facebook = 'facebook',
    twitter = 'twitter',
    pinterest = 'pinterest',
    mail = 'mail',
    linkedin = 'linkedin',
    whatsapp = 'whatsapp'
}

export interface ISocialShareItemConfig extends Msdyn365.IModuleConfig {
    socialMedia: socialMedia;
    icon: Msdyn365.IImageData;
    className?: string;
    clientRender?: boolean;
}

export interface ISocialShareItemProps<T> extends Msdyn365.IModule<T> {
    config: ISocialShareItemConfig;
}
