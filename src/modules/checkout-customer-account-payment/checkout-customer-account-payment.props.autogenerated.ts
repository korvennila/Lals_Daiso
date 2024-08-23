/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ICheckoutCustomerAccountPayment contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface ICheckoutCustomerAccountPaymentConfig extends Msdyn365.IModuleConfig {
    clientRender?: boolean;
    isCheckoutCustomerAccountPaymentRequired?: boolean;
    voucherInvalidErrorMessage?: string;
    voucherAlreadyUsedErrorMessage?: string;
    storeCreditsHeadingLabel?: string;
}

export interface ICheckoutCustomerAccountPaymentResources {
    addPaymentButtonLabel: string;
    inputAmountLabel: string;
    inputAmountSummaryLabel: string;
    inputAmountAriaLabel: string;
    customerSinceLabel: string;
    accountCreditLabel: string;
    invalidAmountMessage: string;
    invalidAmountExceedAmountDueMessage: string;
    invalidAmountNegativeMessage: string;
    invalidAmountForOBOMessage: string;
    creditDetailsSectionLabel: string;
    availableCreditLabel: string;
    orderTotalLabel: string;
    creditExcessLabel: string;
    appliedCustomerAccountPaymentLabel: string;
    removeCustomerAccountPaymentLabel: string;
    accountCreditDetails: string;
    errorMessageTitle: string;
    customerAccountCreditErrorMessage: string;
    voucherInvalidErrorMessage: string;
    voucherAlreadyUsedErrorMessage: string;
    voucherApplyErrorMessage: string;
}

export interface ICheckoutCustomerAccountPaymentProps<T> extends Msdyn365.IModule<T> {
    resources: ICheckoutCustomerAccountPaymentResources;
    config: ICheckoutCustomerAccountPaymentConfig;
}
