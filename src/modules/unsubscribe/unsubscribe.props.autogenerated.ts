/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IUnsubscribe contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IUnsubscribeConfig extends Msdyn365.IModuleConfig {
    showText?: string;
    unsubscribeRedirectionLink?: IUnsubscribeRedirectionLinkData;
}

export interface IUnsubscribeResources {
    textBoxPlaceholder: string;
    submitButtonText: string;
    emailRequiredText: string;
    emailValidateText: string;
    unsubscriptionSuccessMessage: string;
    unsubscriptionAlreadySenteMessage: string;
    unsubscriptionFailureMessage: string;
}

export interface IUnsubscribeRedirectionLinkData {
    linkText?: string;
    linkUrl: Msdyn365.ILinkData;
    ariaLabel?: string;
    openInNewTab?: boolean;
}

export interface IUnsubscribeProps<T> extends Msdyn365.IModule<T> {
    resources: IUnsubscribeResources;
    config: IUnsubscribeConfig;
}
