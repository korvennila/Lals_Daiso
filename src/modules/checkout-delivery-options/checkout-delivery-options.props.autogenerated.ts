/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ICheckoutDeliveryOptions contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export const enum filterDeliveryModeOption {
    none = 'none',
    filterOutNonCarrierDeliveryMode = 'filterOutNonCarrierDeliveryMode'
}

export const enum useDefaultDeliveryOption {
    none = 'none',
    displaySelectedDeliveryOption = 'displaySelectedDeliveryOption',
    notDisplaySelectedDeliveryOption = 'notDisplaySelectedDeliveryOption'
}

export interface ICheckoutDeliveryOptionsConfig extends Msdyn365.IModuleConfig {
    heading?: IHeadingData;
    filterDeliveryModeOption?: filterDeliveryModeOption;
    useDefaultDeliveryOption?: useDefaultDeliveryOption;
    className?: string;
    clientRender?: boolean;
}

export interface ICheckoutDeliveryOptionsResources {
    deliveryOptionsNotFound: string;
    genericErrorMessage: string;
    errorMessageTitle: string;
    ariaLabelText: string;
    priceFree: string;
    saveBtnLabel: string;
    editBtnLabel: string;
    cancelBtnLabel: string;
    deliveryOptionAriaLabel: string;
}

export const enum HeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IHeadingData {
    text: string;
    tag?: HeadingTag;
}

export interface ICheckoutDeliveryOptionsProps<T> extends Msdyn365.IModule<T> {
    resources: ICheckoutDeliveryOptionsResources;
    config: ICheckoutDeliveryOptionsConfig;
}
