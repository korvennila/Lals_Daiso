/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { ISubscribeViewProps } from './subscribe';

/**
 * Override form action and button action below.
 * @param event - The form event.
 */
const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
};

/**
 * View component.
 * @param props - The view properties.
 * @returns - Returns nothing.
 */
export const subscribeView: React.FC<ISubscribeViewProps> = props => {
    const { subscribe, subscribeContainer, heading, text, subscribeForm, emailInput, submitButton } = props;
    return (
        <Module {...subscribe}>
            <Node {...subscribeContainer} className={subscribeContainer.className}>
                {heading}
                {text}
                <Node {...subscribeForm} onSubmit={onSubmit} className={subscribeForm?.className ?? ''}>
                    <Node {...emailInput} className={emailInput?.className ?? ''} />
                    <Node {...submitButton} className={submitButton?.className ?? ''}>
                        {props.submitButtonLabelText}
                    </Node>
                </Node>
            </Node>
        </Module>
    );
};

export default subscribeView;
