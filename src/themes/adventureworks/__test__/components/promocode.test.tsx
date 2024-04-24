/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { buildMockCoreContext } from '@msdyn365-commerce/core';
import { mount, render } from 'enzyme';
import * as React from 'react';

import PromoCode from '../../views/components/promocode.component';

/*
1. Renders correctly with promo-code
2. Renders correctly without promo-code
3. applies promo-code correctly
4. removed promo-code correctly
*/

describe('Promo code', () => {
    const mockCoreContext = buildMockCoreContext({});
    const flushPromises = async () => new Promise(setImmediate);
    it('renders correctly with promo-code', () => {
        const cart = {
            cart: {
                Id: '1234',
                CartLines: [
                    {
                        LineId: '1234'
                    },
                    {
                        LineId: '2345'
                    }
                ],
                Coupons: [
                    {
                        Code: 'WeeklyAd'
                    },
                    {
                        Code: 'Take20'
                    }
                ]
            }
        };
        const promoCode = render(
            <PromoCode
                // @ts-expect-error only mock partial data
                cart={cart}
                promoCodeHeadingText='Promo code'
                removePromoAriaLabelFormat='{0} {1}'
                promoPlaceholderText='Enter promo code'
                promoCodeApplyButtonText='Apply'
                collapseTimeOut={350}
                removePromoText='Remove'
                id='id'
                typeName='PromoCode'
                context={mockCoreContext}
            />
        );
        expect(promoCode).toMatchSnapshot();
    });
    it('renders correctly without promo-code', () => {
        const cart = {
            cart: {
                Id: '1234',
                CartLines: [
                    {
                        LineId: '1234'
                    },
                    {
                        LineId: '2345'
                    }
                ]
            }
        };
        const promoCode = render(
            <PromoCode
                // @ts-expect-error partial mock
                cart={cart}
                promoCodeHeadingText='Promo code'
                removePromoAriaLabelFormat='{0} {1}'
                promoPlaceholderText='Enter promo code'
                promoCodeApplyButtonText='Apply'
                collapseTimeOut={350}
                removePromoText='Remove'
                id='id'
                typeName='PromoCode'
                context={mockCoreContext}
            />
        );
        expect(promoCode).toMatchSnapshot();
    });

    it('applies promo code correctly when it is not applied on cart', () => {
        const spyAddPromoCode = jest.fn().mockImplementation(async () => Promise.resolve({}));
        const cart = {
            cart: {
                Id: '1234',
                CartLines: [
                    {
                        LineId: '1234'
                    },
                    {
                        LineId: '2345'
                    }
                ]
            },
            addPromoCode: spyAddPromoCode
        };
        const promoCode = mount(
            <PromoCode
                // @ts-expect-error partial mock
                cart={cart}
                promoCodeHeadingText='Promo code'
                removePromoAriaLabelFormat='{0} {1}'
                promoPlaceholderText='Enter promo code'
                promoCodeApplyButtonText='Apply'
                collapseTimeOut={350}
                removePromoText='Remove'
                id='id'
                typeName='PromoCode'
                context={mockCoreContext}
            />
        );
        promoCode.find('.msc-promo-code__input-box').simulate('change', { target: { value: 'WeeklyAd' } });
        promoCode
            .find('.msc-promo-code__apply-btn')
            .first()
            .simulate('click');
        expect(spyAddPromoCode).toHaveBeenCalled();
        promoCode.unmount();
    });

    it('throws error when already applied promo code correctly', async () => {
        const spyAddPromoCode = jest.fn().mockImplementation(async () => Promise.resolve({ status: 'FAILED', substatus: 'ALREADYADDED' }));
        const cart = {
            cart: {
                Id: '1234',
                CartLines: [
                    {
                        LineId: '1234'
                    },
                    {
                        LineId: '2345'
                    }
                ],
                Coupons: [
                    {
                        Code: 'weeklyad'
                    }
                ]
            },
            addPromoCode: spyAddPromoCode
        };
        const promoCode = mount(
            <PromoCode
                // @ts-expect-error partial mock
                cart={cart}
                promoCodeHeadingText='Promo code'
                removePromoAriaLabelFormat='{0} {1}'
                promoPlaceholderText='Enter promo code'
                promoCodeApplyButtonText='Apply'
                duplicatePromoCodeErrorText='duplicate'
                collapseTimeOut={350}
                removePromoText='Remove'
                id='id'
                typeName='PromoCode'
                context={mockCoreContext}
            />
        );
        promoCode.find('.msc-promo-code__input-box').simulate('change', { target: { value: 'weeklyad' } });
        promoCode
            .find('.msc-promo-code__apply-btn')
            .first()
            .simulate('click');
        expect(spyAddPromoCode).toHaveBeenCalled();
        await flushPromises();
        const error = promoCode.find('p');
        expect(error.text()).toBe('duplicate');
        promoCode.unmount();
    });

    it('removes promo-code when clicked on remove button', () => {
        const spyRemovePromoCodes = jest.fn().mockImplementation(async () => Promise.resolve({}));
        const cart = {
            cart: {
                Id: '1234',
                CartLines: [
                    {
                        LineId: '1234',
                        DiscountLines: [
                            {
                                DiscountCode: 'weeklyad',
                                DiscountCost: 10
                            }
                        ]
                    },
                    {
                        LineId: '2345'
                    }
                ],
                Coupons: [
                    {
                        Code: 'weeklyad'
                    }
                ]
            },
            removePromoCodes: spyRemovePromoCodes
        };
        const promoCode = mount(
            <PromoCode
                // @ts-expect-error partial mock
                cart={cart}
                promoCodeHeadingText='Promo code'
                removePromoAriaLabelFormat=''
                promoPlaceholderText='Enter promo code'
                promoCodeApplyButtonText='Apply'
                collapseTimeOut={350}
                removePromoText='Remove'
                id='id'
                typeName='PromoCode'
                context={mockCoreContext}
            />
        );
        promoCode.find('.msc-promo-code__input-box').simulate('change', { target: { value: '' } });
        promoCode
            .find('.msc-promo-code__line__btn-remove')
            .first()
            .simulate('click');
        expect(spyRemovePromoCodes).toHaveBeenCalled();
        promoCode.unmount();
    });
});
