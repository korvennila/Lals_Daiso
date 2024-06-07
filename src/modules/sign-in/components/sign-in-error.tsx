/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import classnames from 'classnames';
import * as React from 'react';

export interface ISignInErrorProps {
    id?: string;
    className: string;
    type?: string;
    message?: string;
}

const SignInError: React.FC<ISignInErrorProps> = ({ id, className, type = 'page', message }) => {
    const errorClassName = `${className}__${type}-error`;

    return (
        <div id={id} className={classnames(errorClassName, 'error', `${type}Level`)} role='alert' aria-live='assertive' aria-hidden='true'>
            <p className={`${errorClassName}-text`}>{message}</p>
        </div>
    );
};

export default SignInError;
