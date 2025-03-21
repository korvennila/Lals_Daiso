/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { IUnsubscribeViewProps } from './unsubscribe';

export default (props: IUnsubscribeViewProps) => {
    return (
        <div className='unsubscribe'>
            <h2>{props.config.showText}</h2>
            <input
                type='email'
                ref={props.emailInputRef}
                placeholder={props.resources.textBoxPlaceholder}
                value={props.email}
                onChange={props.onEmailChange}
            />
            {props.validationError && <p className='error'>{props.validationError}</p>}
            {props.apiCalled && props.unsubscribeResponse && (
                <div id='unsubscribeResponse'>
                    <p>{props.unsubscribeResponse}</p>
                </div>
            )}
            <button onClick={props.handleUnsubscribe}>{props.resources.submitButtonText}</button>
        </div>
    );
};
