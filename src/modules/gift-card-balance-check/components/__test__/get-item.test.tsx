/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { getItem, IGetItemInput } from '../get-item';

describe('GetItem', () => {
    it('should render correctly without gift card id', () => {
        const props = {
            giftCard: {
                Id: ''
            },
            resources: {
                enteredGiftCardLabel: 'giftCardLevel',
                giftCardAvailableBalanceLabel: 'giftCardAvailableBalance'
            },
            getFormattedPrice: jest.fn()
        } as IGetItemInput;
        const instance = getItem(props);

        expect(instance).toBeDefined();
    });
});
