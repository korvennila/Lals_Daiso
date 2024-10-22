/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { PriceComponent } from '@msdyn365-commerce/components';
import { TenderLine } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import * as React from 'react';

import { IPaymentMethods, IPaymentMethodsInput } from '@msdyn365-commerce-modules/order-management';

export const getOrderDetailsPaymentMethods = ({
    priceContext,
    tenderLines,
    tenderIdOperationIdMap,
    resource: {
        paymentMethodsTitle,
        creditCardEndingLabel,
        giftCardEndingLabel,
        amountCoveredLabel,
        loyaltyCardUsedLabel,
        cashUsedLabel,
        customerAccountUsedLabel
    },
    priceCurrency
}: IPaymentMethodsInput): IPaymentMethods => {
    const OPERATIONS = {
        PayCard: 201,
        PayGiftCertificate: 214,
        PayLoyalty: 207,
        PayCash: 200,
        PayCustomerAccount: 202
    };

    const getLastFourDigit = (digits = '') => (digits ? digits.substr(-4) : '');

    const getCard = (tenderLine: TenderLine, showAmount: boolean = false) => {
        const cardLastFourDigit = getLastFourDigit(tenderLine.MaskedCardNumber);

        // @ts-expect-error
        const isValidCardNumber = cardLastFourDigit && !isNaN(cardLastFourDigit);
        const amount = (tenderLine.AuthorizedAmount || 0) > 0 ? tenderLine.AuthorizedAmount : tenderLine.Amount;
        const showAmountCovered = !!(showAmount && amount && amount > 0);

        return (
            <div className='ms-order-details__payment-methods-line' key={tenderLine.TenderTypeId}>
                <p className='ms-order-details__payment-methods-card'>
                    {`${tenderLine.CardTypeId} ${isValidCardNumber ? `${creditCardEndingLabel} ${cardLastFourDigit}` : ''}`}
                </p>
                {showAmountCovered && (
                    <p className='ms-order-details__payment-methods-card-amount-info'>
                        {amountCoveredLabel}
                        <PriceComponent
                            {...priceContext}
                            className='ms-order-details__payment-methods-card-amount'
                            data={{ price: { CustomerContextualPrice: amount || 0 } }}
                            currencyCode={priceCurrency}
                        />
                    </p>
                )}
            </div>
        );
    };

    const getCustomerAccountPayment = (tenderLine: TenderLine) => (
        <div className='ms-order-details__payment-methods-line' key={tenderLine.TenderTypeId}>
            <p className='ms-order-details__payment-methods-customer-account'>
                {customerAccountUsedLabel}
                {` `}
                {tenderLine.CustomerId}
            </p>
            <p className='ms-order-details__payment-methods-customer-account-info'>
                {amountCoveredLabel}
                <PriceComponent
                    {...priceContext}
                    className='ms-order-details__payment-methods-customer-account-amount'
                    data={{ price: { CustomerContextualPrice: tenderLine.Amount || 0 } }}
                    currencyCode={priceCurrency}
                />
            </p>
        </div>
    );

    const getGiftCertificate = (tenderLine: TenderLine) => (
        <div className='ms-order-details__payment-methods-line' key={tenderLine.TenderTypeId}>
            <p className='ms-order-details__payment-methods-gift-card-number'>
                {giftCardEndingLabel}
                {` `}
                {getLastFourDigit(tenderLine.GiftCardId)}
            </p>
            <p className='ms-order-details__payment-methods-gift-card-amount-info'>
                {amountCoveredLabel}
                <PriceComponent
                    {...priceContext}
                    className='ms-order-details__payment-methods-gift-card-amount'
                    data={{ price: { CustomerContextualPrice: tenderLine.Amount || 0 } }}
                    currencyCode={priceCurrency}
                />
            </p>
        </div>
    );

    const getLoyalty = (tenderLine: TenderLine) => (
        <div className='ms-order-details__payment-methods-line' key={tenderLine.TenderTypeId}>
            <p className='ms-order-details__payment-methods-loyalty-number'>
                {loyaltyCardUsedLabel}
                {` `}
                {tenderLine.LoyaltyCardId}
            </p>
            <p className='ms-order-details__payment-methods-loyalty-amount-info'>
                {amountCoveredLabel}
                <PriceComponent
                    {...priceContext}
                    className='ms-order-details__payment-methods-loyalty-amount'
                    data={{ price: { CustomerContextualPrice: tenderLine.Amount || 0 } }}
                    currencyCode={priceCurrency}
                />
            </p>
        </div>
    );

    const getCash = (tenderLine: TenderLine) => (
        <div className='ms-order-details__payment-methods-line' key={tenderLine.TenderTypeId}>
            <p className='ms-order-details__payment-methods-cash'>{cashUsedLabel}</p>
            <p className='ms-order-details__payment-methods-cash-amount-info'>
                {amountCoveredLabel}
                <PriceComponent
                    {...priceContext}
                    className='ms-order-details__payment-methods-cash-amount'
                    data={{ price: { CustomerContextualPrice: tenderLine.Amount || 0 } }}
                    currencyCode={priceCurrency}
                />
            </p>
        </div>
    );

    return {
        paymentMethodsProps: { className: 'ms-order-details__payment-methods' },
        title: <div className='ms-order-details__payment-methods-title'>{paymentMethodsTitle}</div>,
        methods: tenderLines.reduce((lines: React.ReactNode[], tenderLine) => {
            if (!tenderLine.TenderTypeId) {
                return lines;
            }
            switch (tenderIdOperationIdMap[tenderLine.TenderTypeId]) {
                case OPERATIONS.PayCard:
                    lines.push(getCard(tenderLine, tenderLines.length > 1));
                    break;
                case OPERATIONS.PayGiftCertificate:
                    lines.push(getGiftCertificate(tenderLine));
                    break;
                case OPERATIONS.PayLoyalty:
                    lines.push(getLoyalty(tenderLine));
                    break;
                case OPERATIONS.PayCash:
                    lines.push(getCash(tenderLine));
                    break;
                case OPERATIONS.PayCustomerAccount:
                    lines.push(getCustomerAccountPayment(tenderLine));
                    break;
                default:

                // Do nothing
            }
            return lines;
        }, [])
    };
};
