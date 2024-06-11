/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as React from 'react';

export interface ISignUpLoadingIcon {
    className: string;
}

const SignUpLoadingIcon: React.FC<ISignUpLoadingIcon> = ({ className }) => <div className={`${className}__loading-icon`} />;

export default SignUpLoadingIcon;
