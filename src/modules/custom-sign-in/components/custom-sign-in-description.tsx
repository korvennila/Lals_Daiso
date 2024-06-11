/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as React from 'react';

export interface ISignInDescription {
    className: string;
    description: string;
}

const SignInDescription: React.FC<ISignInDescription> = ({ className, description }) => <p className={className}>{description}</p>;

export default SignInDescription;
