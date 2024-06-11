/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as React from 'react';

export interface ISignUpLoadingMessage {
    className: string;
    message: string;
}

const SignUpLoadingMessage: React.FC<ISignUpLoadingMessage> = ({ className, message }) => (
    <div className={`${className}__loading-message`}>{message}</div>
);

export default SignUpLoadingMessage;
