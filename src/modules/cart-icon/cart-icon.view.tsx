/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { ICartIconViewProps } from './cart-icon';
import { IFlyoutCartLineItemViewProps } from './components/flyout-cart-line-items';

const _renderCartlines = (cartLines: IFlyoutCartLineItemViewProps[] | undefined, props: ICartIconViewProps): JSX.Element[] | null => {
    if (!cartLines) {
        props.context.telemetry.error('Cartlines content is empty, module wont render');
        return null;
    }
    return cartLines.map((cartLine, index) => {
        return (
            <Node {...props.miniCartItemWrapper} key={index}>
                {cartLine.cartline}
                {cartLine.storeLocation}
                {cartLine.remove}
            </Node>
        );
    });
};

const CartIconView: React.FC<ICartIconViewProps> = (props: ICartIconViewProps) => (
    <Node {...props.miniCartWrapper} {...props.renderModuleAttributes(props)}>
        {props.cartIcon}
        {props.FlyoutContainer ? (
            <Node {...props.FlyoutContainer}>
                {props.flyoutTitle}
                {props.checkoutBlockedDueToUnavailableFunds}
                <Node {...props.CartlinesWrapper}>{_renderCartlines(props.cartlines, props)}</Node>
                {props.totalPrice}
                {props.checkoutAsSignInUserButton}
                {props.checkoutAsGuestButton}
                {props.goToCartButton}
            </Node>
        ) : (
            false
        )}
    </Node>
);

export default CartIconView;
