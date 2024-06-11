/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { PropsWithChildren } from 'react';

import SignUpButton, { ISignUpButton } from '../custom-sign-up-button';

describe('sign up input', () => {
    it('render component', () => {
        const result = SignUpButton({} as PropsWithChildren<ISignUpButton>);
        expect(result).toBeDefined();
    });
});
