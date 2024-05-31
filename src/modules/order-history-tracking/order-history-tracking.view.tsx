/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { IOrderHistoryTrackingViewProps } from './order-history-tracking';

export default (props: IOrderHistoryTrackingViewProps) => {
    const { config, handleTrackOrder, orderHistory, orderIdInputRef } = props;
    return (
        <div className='order-history-tracking'>
            <h2>{config.showText}</h2>
            <input type='text' ref={orderIdInputRef} name='order-number' placeholder='Order Number' />
            <button onClick={handleTrackOrder}>Track Order</button>
            {orderHistory && (
                <div id='orderHistoryResponse'>
                    {orderHistory ? <pre>{JSON.stringify(orderHistory, null, 2)}</pre> : <p>No order history found.</p>}
                </div>
            )}
        </div>
    );
};
