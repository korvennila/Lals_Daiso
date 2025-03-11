/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { ICheckoutPaymentInstrumentViewProps, ICheckoutPaymentOverlayModal } from './checkout-payment-instrument';

const OverlayModal: React.FC<ICheckoutPaymentOverlayModal> = ({ modal }) => {
    return <Node {...modal} />;
};

const CheckoutPaymentInstrumentView: React.FC<ICheckoutPaymentInstrumentViewProps> = ({
    checkoutPaymentInstrument,
    checkoutErrorRef,
    className,
    id,
    waiting,
    alert,
    paymentInformation,
    addPaymentForm,
    overlayModal,
    ...restProps
}) => (
    <Module {...checkoutPaymentInstrument} ref={checkoutErrorRef}>
        {waiting}
        {alert}
        {paymentInformation}
        {addPaymentForm}
        {overlayModal && <OverlayModal {...overlayModal} />}
    </Module>
);

export default CheckoutPaymentInstrumentView;
