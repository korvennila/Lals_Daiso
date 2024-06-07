/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as React from 'react';

export interface ISignInText {
    className: string;
    text: string;
}

const SignInText: React.FC<ISignInText> = ({ className, text }) => <span className={className}>{text}</span>;

export default SignInText;
