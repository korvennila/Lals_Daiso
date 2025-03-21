/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { IInvoiceSummaryLines, InvoiceSummary } from '@msdyn365-commerce-modules/invoice-payment-summary';
import get from 'lodash/get';
import * as React from 'react';

import { ICheckoutData } from '../checkout.data';
import { ICheckoutProps } from '../checkout.props.autogenerated';

export interface IInvoicePaymentSummary {
    heading?: React.ReactNode;
    lines?: IInvoiceSummaryLines;
}
export const getInvoicePaymentSummary = (input: ICheckoutProps<ICheckoutData>): IInvoicePaymentSummary => {
    const {
        data: { checkout },
        resources: { totalAmountLabel, invoiceLabel, invoiceSummaryTitle },
        context,
        typeName,
        id,
        telemetry
    } = input;

    const checkoutCart = get(checkout, 'result.checkoutCart');
    const cart = get(checkout, 'result.checkoutCart.cart');

    return {
        heading: <h2 className='msc-invoice-summary__heading'>{invoiceSummaryTitle}</h2>,
        lines: checkoutCart?.hasInvoiceLine
            ? InvoiceSummary({
                  orderTotalLabel: totalAmountLabel,
                  invoiceLabel,
                  cart,
                  context,
                  typeName,
                  telemetry,
                  id,
                  checkoutState: checkout.result
              })
            : undefined
    };
};
