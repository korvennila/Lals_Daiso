/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { ICheckoutCustomerAccountPaymentViewProps, IAccountPaymentEditViewForm, IAccountPaymentSummaryViewForm } from './index';

export const SummaryForm: React.FC<IAccountPaymentSummaryViewForm> = ({
    formProps,
    label,
    paymentAmount,
    addPaymentButton,
    appliedLine,
    bottomBorder
}) => (
    <Node {...formProps}>
        <>
            {label}
            {paymentAmount}
            {addPaymentButton}
            {appliedLine}
            {bottomBorder}
        </>
    </Node>
);

export const EditForm: React.FC<IAccountPaymentEditViewForm & { errorAlert: React.ReactNode }> = ({
    formProps,
    inputLabel,
    inputAmount,
    addPaymentButton,
    // customerName,
    // customerAccountNumber,
    // customerSince,
    // accountCredit,
    alert,
    // accountDetails,
    appliedLine,
    bottomBorder,
    errorAlert
}) => (
    <Node {...formProps}>
        <>
            <Node className='msc-store-credits-titleContainer'>
                {inputLabel}
                <span className='msc-store-credits-accordion-toggle'>
                    <i className='msc-toggle-icon'></i>
                </span>
            </Node>
            <Node className='msc-store-credits-container'>
                {errorAlert}
                {alert}
                {inputAmount}
                {addPaymentButton}
                {appliedLine}
                {bottomBorder}
            </Node>
        </>
    </Node>
);

const CheckoutCustomerAccountView: React.FC<ICheckoutCustomerAccountPaymentViewProps> = props => {
    const {
        checkoutCustomerAccount,
        checkoutErrorRef,
        //summaryView,
        editView,
        moduleState,
        alert
    } = props;
    return (
        <Module {...checkoutCustomerAccount} ref={checkoutErrorRef}>
            {/* {alert} */}
            {/* {moduleState.isReady && summaryView && <SummaryForm {...summaryView} />} */}
            {!moduleState.isReady && editView && <EditForm errorAlert={alert} {...editView} />}
        </Module>
    );
};

export default CheckoutCustomerAccountView;
