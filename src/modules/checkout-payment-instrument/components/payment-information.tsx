/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Address, TenderLine, TokenizedPaymentCard } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import { Button } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface IPaymentInformationProps {
    resources: {
        changePaymentButtonText: string;
        cardTitle: string;
        cardNumberLabel: string;
        expiresDateLabel: string;
        addressTitle: string;
    };
    tokenizedPaymentCard?: TokenizedPaymentCard;
    tenderLine?: TenderLine;
    billingAddress?: Address;
    canEdit?: boolean;
    onEdit?(): void;
}

/**
 * PaymentInformation SFC.
 * @param root0
 * @param root0.resources
 * @param root0.resources.changePaymentButtonText
 * @param root0.resources.cardTitle
 * @param root0.resources.cardNumberLabel
 * @param root0.resources.expiresDateLabel
 * @param root0.resources.addressTitle
 * @param root0.tokenizedPaymentCard
 * @param root0.tenderLine
 * @param root0.billingAddress
 * @param root0.onEdit
 * @param root0.canEdit
 * @extends {React.SFC<IPaymentInformationProps>}
 */
const PaymentInformation: React.SFC<IPaymentInformationProps> = ({
    resources: { changePaymentButtonText, cardTitle, cardNumberLabel, expiresDateLabel, addressTitle },
    tokenizedPaymentCard,
    tenderLine,
    billingAddress,
    onEdit,
    canEdit
}) => {
    const { NameOnCard = '', CardTypeId, CardTokenInfo = {}, ExpirationMonth = 0, ExpirationYear = 0 } = tokenizedPaymentCard || {};
    const { MaskedCardNumber = '' } = CardTokenInfo || tenderLine || {};
    const cardLastNDigit = MaskedCardNumber.substr(-4);

    // @ts-expect-error
    const isValidCardNumber = !isNaN(cardLastNDigit) && cardLastNDigit !== '';
    const { Name, Street, StreetNumber, City, State, ZipCode, ThreeLetterISORegionName, Phone } = billingAddress || {};

    return (
        <div className='ms-checkout-payment-instrument__show'>
            <p className='ms-checkout-payment-instrument__card-title'>{cardTitle}</p>
            <p className='ms-checkout-payment-instrument__card-name'>{NameOnCard}</p>
            {CardTypeId && <p className='ms-checkout-payment-instrument__card-type-id'>{CardTypeId}</p>}
            {isValidCardNumber && (
                <p className='ms-checkout-payment-instrument__card-number'>
                    {cardNumberLabel} {` `} {cardLastNDigit}
                </p>
            )}
            {(ExpirationMonth > 0 || ExpirationYear > 0) && (
                <p className='ms-checkout-payment-instrument__card-expiration'>
                    {expiresDateLabel} {` `} {ExpirationMonth}/{ExpirationYear}
                </p>
            )}
            {billingAddress && (
                <>
                    <p className='ms-checkout-payment-instrument__billing-address-title'>{addressTitle}</p>
                    <p className='ms-checkout-payment-instrument__billing-address-1'>
                        {Name}
                        {` `}
                        {Street}
                    </p>
                    {StreetNumber && <p className='ms-checkout-payment-instrument__billing-address-2'>{StreetNumber}</p>}
                    <p className='ms-checkout-payment-instrument__billing-address-3'>
                        {City},{State}
                        {` `}
                        {ZipCode}
                        {` `}
                        {ThreeLetterISORegionName}
                        {` `}
                        {Phone}
                    </p>
                </>
            )}
            {canEdit && (
                <Button className='ms-checkout-payment-instrument__btn-edit' title={changePaymentButtonText} color='link' onClick={onEdit}>
                    {changePaymentButtonText}
                </Button>
            )}
        </div>
    );
};

export default React.memo(PaymentInformation);
