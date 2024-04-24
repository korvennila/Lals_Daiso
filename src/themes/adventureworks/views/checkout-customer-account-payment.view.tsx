/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { ICheckoutCustomerAccountPaymentViewProps } from '@msdyn365-commerce-modules/checkout/src/modules/checkout-customer-account-payment/checkout-customer-account-payment';
import { IAccountPaymentEditViewForm } from '@msdyn365-commerce-modules/checkout/src/modules/checkout-customer-account-payment/components/get-account-payment-form-edit-mode';
import { IAccountPaymentSummaryViewForm } from '@msdyn365-commerce-modules/checkout/src/modules/checkout-customer-account-payment/components/get-account-payment-form-summary-mode';

export const SummaryForm: React.FC<IAccountPaymentSummaryViewForm> = ({
    formProps,
    label,
    addPaymentButton,
    appliedLine,
    bottomBorder,
    paymentAmountInput
}) => (
    <Node {...formProps}>
        <>
            {label}
            {paymentAmountInput}
            {addPaymentButton}
            {appliedLine}
            {bottomBorder}
        </>
    </Node>
);

export const EditForm: React.FC<IAccountPaymentEditViewForm> = ({
    formProps,
    inputLabel,
    inputAmount,
    addPaymentButton,
    customerName,
    customerAccountNumber,
    customerSince,
    accountCredit,
    alert,
    accountDetails,
    appliedLine,
    bottomBorder
}) => (
    <Node {...formProps}>
        <>
            {customerName}
            {customerAccountNumber}
            {customerSince}
            {accountCredit}
            {accountDetails}
            {inputLabel}
            {alert}
            {inputAmount}
            {addPaymentButton}
            {appliedLine}
            {bottomBorder}
        </>
    </Node>
);

const CheckoutCustomerAccountView: React.FC<ICheckoutCustomerAccountPaymentViewProps> = props => {
    const { checkoutCustomerAccount, checkoutErrorRef, summaryView, editView, moduleState, alert } = props;
    return (
        <Module {...checkoutCustomerAccount} ref={checkoutErrorRef}>
            {alert}
            {moduleState.isReady && summaryView && <SummaryForm {...summaryView} />}
            {!moduleState.isReady && editView && <EditForm {...editView} />}
        </Module>
    );
};

export default CheckoutCustomerAccountView;
