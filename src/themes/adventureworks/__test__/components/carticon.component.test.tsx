/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { buildMockCoreContext, buildMockModuleProps, IComponentProps, ICoreContext } from '@msdyn365-commerce/core';
import { ICartState } from '@msdyn365-commerce/global-state';
import { Cart } from '@msdyn365-commerce/retail-proxy';
import { ITelemetryContent } from '@msdyn365-commerce-modules/utilities';
import { render } from 'enzyme';
import * as React from 'react';

import CartIcon, { ICartIconData } from '../../views/components/carticon.component';

describe('CartIcon', () => {
    const mockCoreContext: ICoreContext = buildMockCoreContext({ app: { config: { hideRating: false } } }) as ICoreContext;
    const telemetryContent = { pageName: 'Homepage', moduleName: 'Add to Cart', telemetry: mockCoreContext.telemetry } as ITelemetryContent;
    const moduleProps: IComponentProps<ICartIconData> = buildMockModuleProps({}, {}) as IComponentProps<ICartIconData>;

    // @ts-expect-error partial mock
    const subcart: Readonly<Cart> = {
        IsRequiredAmountPaid: false,
        IsReturnByReceipt: false,
        IsSuspended: false,
        LoyaltyCardId: '55182',
        MerchantProperties: [],
        Name: 'CART',
        NetPrice: 1580,
        OrderNumber: 'ORDER NUMBER',
        OtherChargeAmount: 0,
        OverriddenDepositAmount: undefined,
        OverriddenDepositWithoutCarryoutAmount: undefined,
        PeriodicDiscountsCalculateScopeValue: 0,
        PrepaymentAmountInvoiced: 0,
        PrepaymentAmountPaid: 0,
        PrepaymentAppliedOnPickup: 0,
        PromotionLines: [],
        QuotationExpiryDate: undefined,
        ReasonCodeLines: [],
        ReceiptEmail: 'email',
        ReceiptTransactionTypeValue: 1,
        RefundableTenderLines: [],
        RequestedDeliveryDate: undefined,
        RequiredDepositAmount: 0,
        RequiredDepositWithoutCarryoutAmount: 0,
        ReturnTransactionHasLoyaltyPayment: false,
        SalesId: '0',
        ShippingAddress: undefined,
        ShippingChargeAmount: 0,
        StaffId: '0',
        SubtotalAmount: 1580,
        SubtotalAmountWithoutTax: 1580,
        SubtotalSalesAmount: 1580,
        SuspendedCartId: '1',
        TaxAmount: 0,
        TaxOnCancellationCharge: 0,
        TaxOverrideCode: '1',
        TaxViewLines: [],
        TenderLines: [],
        TerminalId: '',
        TotalAmount: 1580,
        TotalCarryoutSalesAmount: 1580,
        TotalCustomerOrderSalesAmount: 0,
        TotalItems: 2,
        TotalManualDiscountAmount: 0,
        TotalManualDiscountPercentage: 0,
        TotalReturnAmount: 0,
        TotalSalesAmount: 1580,
        TransactionTypeValue: -1,
        Version: 22223736,
        WarehouseId: 'DC-CENTRAL'
    };
    it('renders correctly with change event', () => {
        // @ts-expect-error partial mock
        const cart: ICartState = {
            totalItemsInCart: 2,
            isProductAddedToCart: true,
            isEmpty: false,
            hasInvoiceLine: false,
            cart: subcart
        };
        const mockProps = {
            ...moduleProps,
            className: 'CartLineItem',
            cartLabel: 'Shopping bag',
            cartQtyLabel: '0',
            telemetryContent,
            id: 'data',
            typeName: 'data',
            data: {
                cart
            }
        };
        const component = render(<CartIcon {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
    it('renders correctly with change event1', () => {
        // @ts-expect-error partial mock
        const cart: ICartState = {
            totalItemsInCart: 2,
            isProductAddedToCart: true,
            isEmpty: false,
            hasInvoiceLine: true
        };
        const mockProps = {
            ...moduleProps,
            className: 'CartLineItem',
            cartLabel: 'Shopping bag',
            cartQtyLabel: '0',
            telemetryContent,
            id: 'data',
            typeName: 'data',
            data: {
                cart
            }
        };
        const component = render(<CartIcon {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
    it('renders correctly with change event2', () => {
        const mockProps = {
            ...moduleProps,
            className: 'CartLineItem',
            cartLabel: 'Shopping bag',
            cartQtyLabel: '0',
            telemetryContent,
            id: 'data',
            typeName: 'data',
            data: {
                cart: undefined
            }
        };
        const component = render(<CartIcon {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
    it('renders correctly with change event3', () => {
        // @ts-expect-error partial mock
        const cart: ICartState = {
            totalItemsInCart: 120,
            isProductAddedToCart: true,
            isEmpty: false,
            hasInvoiceLine: false,
            cart: subcart
        };
        const mockProps = {
            ...moduleProps,
            className: 'CartLineItem',
            cartLabel: 'Shopping bag',
            cartQtyLabel: '0',
            telemetryContent,
            id: 'data',
            typeName: 'data',
            data: {
                cart
            }
        };
        const component = render(<CartIcon {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
});
