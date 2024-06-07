/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { PropsWithChildren } from 'react';

import SignUpError, { ISignUpErrorProps } from '../sign-up-error';

describe('sign up input', () => {
    it('render component', () => {
        const result = SignUpError({
            id: '2',
            className: 'test',
            type: 'page',
            message: 'test'
        } as PropsWithChildren<ISignUpErrorProps>);

        expect(result).toBeDefined();
    });

    it('render component without type', () => {
        const result = SignUpError({
            id: '2',
            className: 'test',
            message: 'test'
        } as PropsWithChildren<ISignUpErrorProps>);

        expect(result).toBeDefined();
    });
});
