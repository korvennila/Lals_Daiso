/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { IOrderHistoryTrackingViewProps } from './order-history-tracking';

export default (props: IOrderHistoryTrackingViewProps) => {
    const { config, handleTrackOrder, orderHistory, orderIdInputRef, resources, errorMessage } = props;
    return (
        <div className='order-history-tracking'>
            <h2>{config.showText}</h2>
            <input type='text' ref={orderIdInputRef} name='order-number' placeholder={resources.textBoxPlaceholder} />
            {errorMessage && (
                <div className='error-message'>
                    <p>{errorMessage}</p>
                </div>
            )}
            {orderHistory && <div className='orderHistoryResponse'>{orderHistory}</div>}
            <button onClick={handleTrackOrder}>{resources.submitButtonText}</button>
        </div>
    );
};
