/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as React from 'react';

interface ICustomerAccountPaymentTitleProps {
    title: string;
}

const CustomerAccountTitle: React.FC<ICustomerAccountPaymentTitleProps> = ({ title }) => (
    <label className='ms-checkout-customer-account-payment__title'>{title}</label>
);

export default CustomerAccountTitle;
