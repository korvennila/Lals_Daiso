/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { PriceComponent } from '@msdyn365-commerce/components';
import { RetailOperation, TenderLine } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import * as React from 'react';

import { IPaymentMethods, IPaymentMethodsInput } from '@msdyn365-commerce-modules/order-management';

export const getOrderConfirmationPaymentMethods = ({
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
    }
}: IPaymentMethodsInput): IPaymentMethods => {
    const getLastFourDigit = (digits = '') => digits.substr(-4);

    const getCard = (tenderLine: TenderLine, showAmount: boolean = false) => {
        const cardLastFourDigit = getLastFourDigit(tenderLine.MaskedCardNumber);

        // @ts-expect-error
        const isValidCardNumber = cardLastFourDigit && !isNaN(cardLastFourDigit);
        const amount = (tenderLine.AuthorizedAmount || 0) > 0 ? tenderLine.AuthorizedAmount : tenderLine.Amount;
        const showAmountCovered = !!(showAmount && amount && amount > 0);

        return (
            <div className='ms-order-confirmation__payment-methods-line' key={tenderLine.TenderTypeId}>
                <p className='ms-order-confirmation__payment-methods-card'>
                    {`${tenderLine.CardTypeId} ${isValidCardNumber ? `${creditCardEndingLabel} ${cardLastFourDigit}` : ''}`}
                </p>
                {showAmountCovered && (
                    <p className='ms-order-confirmation__payment-methods-card-amount-info'>
                        {amountCoveredLabel}
                        <PriceComponent
                            {...priceContext}
                            className='ms-order-confirmation__payment-methods-card-amount'
                            data={{ price: { CustomerContextualPrice: amount || 0 } }}
                        />
                    </p>
                )}
            </div>
        );
    };

    const getGiftCertificate = (tenderLine: TenderLine) => (
        <div className='ms-order-confirmation__payment-methods-line' key={tenderLine.TenderTypeId}>
            <p className='ms-order-confirmation__payment-methods-gift-card-number'>
                {giftCardEndingLabel}
                {` `}
                {getLastFourDigit(tenderLine.GiftCardId)}
            </p>
            <p className='ms-order-confirmation__payment-methods-gift-card-amount-info'>
                {amountCoveredLabel}
                <PriceComponent
                    {...priceContext}
                    className='ms-order-confirmation__payment-methods-gift-card-amount'
                    data={{ price: { CustomerContextualPrice: tenderLine.Amount || 0 } }}
                />
            </p>
        </div>
    );

    const getLoyalty = (tenderLine: TenderLine) => (
        <div className='ms-order-confirmation__payment-methods-line' key={tenderLine.TenderTypeId}>
            <p className='ms-order-confirmation__payment-methods-loyalty-number'>
                {loyaltyCardUsedLabel}
                {` `}
                {tenderLine.LoyaltyCardId}
            </p>
            <p className='ms-order-confirmation__payment-methods-loyalty-amount-info'>
                {amountCoveredLabel}
                <PriceComponent
                    {...priceContext}
                    className='ms-order-confirmation__payment-methods-loyalty-amount'
                    data={{ price: { CustomerContextualPrice: tenderLine.Amount || 0 } }}
                />
            </p>
        </div>
    );

    const getCash = (tenderLine: TenderLine) => (
        <div className='ms-order-confirmation__payment-methods-line' key={tenderLine.TenderTypeId}>
            <p className='ms-order-confirmation__payment-methods-cash'>{cashUsedLabel}</p>
            <p className='ms-order-confirmation__payment-methods-cash-amount-info'>
                {amountCoveredLabel}
                <PriceComponent
                    {...priceContext}
                    className='ms-order-confirmation__payment-methods-cash-amount'
                    data={{ price: { CustomerContextualPrice: tenderLine.Amount || 0 } }}
                />
            </p>
        </div>
    );

    /**
     * Get customer account payment information.
     * @param tenderLine - The customer account payment tender line.
     * @returns The customer account payment HTML.
     */
    const getCustomerAccountPayment = (tenderLine: TenderLine) => (
        <div className='ms-order-confirmation__payment-methods-line' key={tenderLine.TenderTypeId}>
            <p className='ms-order-confirmation__payment-methods-customer-account'>
                {customerAccountUsedLabel}
                {` `}
                {tenderLine.CustomerId}
            </p>
            <p className='ms-order-confirmation__payment-methods-customer-account-info'>
                {amountCoveredLabel}
                <PriceComponent
                    {...priceContext}
                    className='ms-order-confirmation__payment-methods-customer-account-amount'
                    data={{ price: { CustomerContextualPrice: tenderLine.Amount ?? 0 } }}
                />
            </p>
        </div>
    );

    return {
        paymentMethodsProps: { className: 'ms-order-confirmation__payment-methods' },
        title: <div className='ms-order-confirmation__payment-methods-title'>{paymentMethodsTitle}</div>,
        methods: tenderLines.reduce((lines: React.ReactNode[], tenderLine) => {
            if (!tenderLine.TenderTypeId) {
                return lines;
            }
            switch (tenderIdOperationIdMap[tenderLine.TenderTypeId]) {
                case RetailOperation.PayCard:
                    lines.push(getCard(tenderLine, tenderLines.length > 1));
                    break;
                case RetailOperation.PayGiftCertificate:
                    lines.push(getGiftCertificate(tenderLine));
                    break;
                case RetailOperation.PayLoyalty:
                    lines.push(getLoyalty(tenderLine));
                    break;
                case RetailOperation.PayCash:
                    lines.push(getCash(tenderLine));
                    break;
                case RetailOperation.PayCustomerAccount:
                    lines.push(getCustomerAccountPayment(tenderLine));
                    break;
                default:

                // Do nothing
            }
            return lines;
        }, [])
    };
};
