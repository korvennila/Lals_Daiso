/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as React from 'react';

export interface ISignInLoadingMessage {
    className: string;
    message: string;
}

const SignInLoadingMessage: React.FC<ISignInLoadingMessage> = ({ className, message }) => (
    <div className={`${className}__loading-message`}>{message}</div>
);

export default SignInLoadingMessage;
