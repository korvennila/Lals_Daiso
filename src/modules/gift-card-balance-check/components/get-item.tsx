/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { GiftCard } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import { INodeProps } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface IGetItemInput {
    giftCard: GiftCard;
    resources: {
        enteredGiftCardLabel: string;
        giftCardAvailableBalanceLabel: string;
    };
    getFormattedPrice(price?: number, currencyCode?: string): string;
}

export interface IItem {
    itemProps: INodeProps;
    id?: string;
    selectedGiftCard: React.ReactNode;
    removeButton?: React.ReactNode;
}

/**
 * GiftCardItem component.
 * @param root0
 * @param root0.giftCard
 * @param root0.getFormattedPrice
 * @param root0.resources
 * @param root0.resources.enteredGiftCardLabel
 * @param root0.resources.giftCardAvailableBalanceLabel
 * @extends {React.PureComponent<IGiftCardItemProps>}
 */
export const getItem = ({
    giftCard,
    getFormattedPrice,
    resources: { enteredGiftCardLabel, giftCardAvailableBalanceLabel }
}: IGetItemInput): IItem => {
    const balance = getFormattedPrice(giftCard.Balance, giftCard.CardCurrencyCode);
    const giftCardLast4Digit = (giftCard.Id || '').substr(-4);

    const itemProps = {
        className: 'ms-gift-card-balance-check__item'
    };

    const selectedGiftCard = (
        <span className='ms-gift-card-balance-check__item-text'>
            {giftCardAvailableBalanceLabel}
            {` `}
            <span className='ms-gift-card-balance-check__balance'>{balance}</span>
            {` `}({enteredGiftCardLabel}
            {` `}
            {giftCardLast4Digit})
        </span>
    );

    return {
        itemProps,
        id: giftCard && giftCard.Id,
        selectedGiftCard
    };
};
