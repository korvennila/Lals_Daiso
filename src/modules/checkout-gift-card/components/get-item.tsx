/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { IGiftCardExtend } from '@msdyn365-commerce/global-state';
import { Button, INodeProps } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface IGetItemInput {
    giftCard: IGiftCardExtend;
    canRemove: boolean;
    resources: {
        enteredGiftCardLabel: string;
        giftCardAvailableBalanceLabel: string;
        removeGiftCardButton: string;
    };
    getFormattedPrice(price?: number, currencyCode?: string): string;
    onRemoveGiftCard(giftCardNumber: string): void;
}

export interface IItem {
    itemProps: INodeProps;
    id?: string;
    selectedGiftCard: React.ReactNode;
    removeButton?: React.ReactNode;
}

/**
 * On remove function.
 * @param onRemoveGiftCard -Gift card number function.
 * @param giftCard -Gift card values.
 * @returns Call of onRemoveGiftCard function.
 */
const onRemoveHandler = (onRemoveGiftCard: (giftCardNumber: string) => void, giftCard: IGiftCardExtend) => (): void => {
    onRemoveGiftCard(giftCard.Id ?? '');
};

/**
 * GiftCardItem component.
 * @param root0
 * @param root0.giftCard
 * @param root0.getFormattedPrice
 * @param root0.canRemove
 * @param root0.onRemoveGiftCard
 * @param root0.resources
 * @param root0.resources.enteredGiftCardLabel
 * @param root0.resources.giftCardAvailableBalanceLabel
 * @param root0.resources.removeGiftCardButton
 * @extends {React.PureComponent<IGiftCardItemProps>}
 */
export const getItem = ({
    giftCard,
    getFormattedPrice,
    canRemove,
    onRemoveGiftCard,
    resources: { enteredGiftCardLabel, giftCardAvailableBalanceLabel, removeGiftCardButton }
}: IGetItemInput): IItem => {
    const balance = getFormattedPrice(giftCard.Balance, giftCard.CardCurrencyCode);
    const giftCardLast4Digit = (giftCard.Id || '').substr(-4);

    const itemProps = {
        className: 'ms-checkout-gift-card__item'
    };

    const selectedGiftCard = (
        <span className='ms-checkout-gift-card__item-text'>
            {enteredGiftCardLabel}
            {` `}
            {giftCardLast4Digit}
            {' ('}
            {giftCardAvailableBalanceLabel}
            {` `}
            <span className='ms-checkout-gift-card__balance'>{balance}</span>
            {')'}
        </span>
    );

    const removeButton = canRemove && (
        <Button className='ms-checkout-gift-card__btn-remove' onClick={onRemoveHandler(onRemoveGiftCard, giftCard)}>
            {removeGiftCardButton}
        </Button>
    );

    return {
        itemProps,
        id: giftCard.Id,
        selectedGiftCard,
        removeButton
    };
};
