/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { IGiftCardExtend } from '@msdyn365-commerce/global-state';
import { INodeProps } from '@msdyn365-commerce-modules/utilities';

import { getItem, IItem } from './get-item';

interface IGetListInput {
    giftCards?: IGiftCardExtend[];
    canRemove: boolean;
    resources: {
        enteredGiftCardLabel: string;
        giftCardAvailableBalanceLabel: string;
        removeGiftCardButton: string;
    };
    getFormattedPrice(price?: number, currencyCode?: string): string;
    onRemoveGiftCard(giftCardNumber: string): void;
}

export interface IList {
    listProps: INodeProps;
    list: IItem[];
}

export const getList = ({ giftCards, canRemove, resources, getFormattedPrice, onRemoveGiftCard }: IGetListInput): IList | undefined => {
    if (!giftCards || giftCards.length === 0) {
        return undefined;
    }

    const listProps = {
        className: 'ms-checkout-gift-card__list'
    };

    const list = giftCards.map(giftCard =>
        getItem({
            canRemove,
            getFormattedPrice,
            giftCard,
            onRemoveGiftCard,
            resources
        })
    );

    return {
        listProps,
        list
    };
};
