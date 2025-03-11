/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ICheckoutPaymentInstrument contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface ICheckoutPaymentInstrumentConfig extends Msdyn365.IModuleConfig {
    heading?: IHeadingData;
    iFrameHeightOverride?: number;
    paymenTenderType?: string;
    isPrimaryPayment?: boolean;
    showBillingAddress?: boolean;
    paymentStyleOverride?: string;
    shouldCheckConnectorId?: boolean;
    shouldPassLocaleToiFrame?: boolean;
    className?: string;
    clientRender?: boolean;
}

export interface ICheckoutPaymentInstrumentResources {
    cardTitle: string;
    cardNumberLabel: string;
    expiresDateLabel: string;
    changePaymentButtonText: string;
    cancelButtonText: string;
    submitButtonText: string;
    genericErrorMessage: string;
    cardTypeErrorMessage: string;
    termsAndConditionErrorMessage: string;
    defaultSubmitErrorMessage: string;
    unableToRetrieveCardPaymentAcceptResultErrorMessage: string;
    errorMessageTitle: string;
    iframeAriaLabel: string;
    loadingMessage: string;
    addressTitle: string;
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

export interface ICheckoutPaymentInstrumentProps<T> extends Msdyn365.IModule<T> {
    resources: ICheckoutPaymentInstrumentResources;
    config: ICheckoutPaymentInstrumentConfig;
}
