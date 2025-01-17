/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { PriceComponent } from '@msdyn365-commerce/components';
import * as React from 'react';

import { IGetOrderSummaryInput, IOrderSummary, IPriceContext } from '@msdyn365-commerce-modules/order-management';

interface ISummaryLineProps {
    priceContext?: IPriceContext;
    name: string;
    label: string;
    value?: number;
    priceCurrency?: string;
}

const OrderSummaryLine: React.SFC<ISummaryLineProps> = ({ name, label, value = 0, priceContext, priceCurrency }) => (
    <p className={`ms-order-details__order-summary-line-${name}`}>
        <span className='ms-order-details__order-summary-label'>{label}</span>
        {priceContext ? (
            <PriceComponent
                {...priceContext}
                className='ms-order-details__order-summary-price'
                data={{ price: { CustomerContextualPrice: value } }}
                currencyCode={priceCurrency}
            />
        ) : (
            <span className='ms-order-details__order-summary-price'>{value}</span>
        )}
    </p>
);

export const getOrderDetailsOrderSummary = ({
    order,
    priceContext,
    earnedPoints,
    resource: {
        orderSummaryHeading,
        orderSummaryItemsTotalLabel,
        orderSummaryShippingFeeLabel,
        orderSummaryTaxLabel,
        orderSummaryGrandTotalLabel,
        pointsEarnedLabel
    },
    canShip,
    isTaxIncludedInPrice,
    isShowTaxBreakUp
}: IGetOrderSummaryInput): IOrderSummary => {
    const subTotal = isTaxIncludedInPrice && isShowTaxBreakUp ? order.SubtotalAmountWithoutTax : order.SubtotalAmount;
    const taxOnShippingCharge = order.TaxOnShippingCharge !== undefined ? order.TaxOnShippingCharge : 0;
    const shippingChargeAmount = order.ShippingChargeAmount !== undefined ? order.ShippingChargeAmount : 0;

    // isTaxIncludedInPrice    isShowTaxBreakup     useProperties
    //   False                   False/True             shippingChargeAmount
    //   True                    True                   shippingChargeAmount
    //   True                    false                  shippingChargeAmount + taxOnShippingCharge
    const shippingCharge =
        isTaxIncludedInPrice && !isShowTaxBreakUp ? shippingChargeAmount + taxOnShippingCharge : order.ShippingChargeAmount;
    return {
        orderSummaryProps: { className: 'ms-order-details__order-summary' },
        heading: <p className='ms-order-details__order-summary-heading'>{orderSummaryHeading}</p>,
        subtotal: (
            <OrderSummaryLine
                name='subtotal'
                label={orderSummaryItemsTotalLabel}
                value={subTotal}
                priceContext={priceContext}
                priceCurrency={order.CurrencyCode}
            />
        ),
        shipping: canShip ? (
            <OrderSummaryLine
                name='shipping'
                label={orderSummaryShippingFeeLabel}
                value={shippingCharge}
                priceContext={priceContext}
                priceCurrency={order.CurrencyCode}
            />
        ) : (
            ''
        ),
        tax: isShowTaxBreakUp ? (
            <OrderSummaryLine
                name='tax-amount'
                label={orderSummaryTaxLabel}
                value={order.TaxAmount}
                priceContext={priceContext}
                priceCurrency={order.CurrencyCode}
            />
        ) : (
            ''
        ),
        totalAmount: (
            <OrderSummaryLine
                name='total-amount'
                label={orderSummaryGrandTotalLabel}
                value={order.TotalAmount}
                priceContext={priceContext}
                priceCurrency={order.CurrencyCode}
            />
        ),
        earnedPoints: earnedPoints ? <OrderSummaryLine name='earned-points' label={pointsEarnedLabel} value={earnedPoints} /> : undefined
    };
};
