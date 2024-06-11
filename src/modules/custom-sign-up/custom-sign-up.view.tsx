/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import {
    ISignUpEmailVerification,
    ISignUpGivenNameVerification,
    ISignUpItem,
    ISignUpLoading,
    ISignUpLocalAccount,
    ISignUpSurnameVerification,
    ISignUpViewProps
} from './custom-sign-up';

const SignUpItem: React.FC<ISignUpItem> = ({ wrapper, label, errorMessage, input }) => {
    return (
        <Node {...wrapper}>
            {label}
            {errorMessage}
            {input}
        </Node>
    );
};

const SignUpEmailVerification: React.FC<ISignUpEmailVerification> = ({ email, buttonWrapper, buttons, successMessage, errorMessage }) => {
    return (
        <>
            {successMessage &&
                successMessage.map((message: React.ReactNode) => {
                    return <>{message}</>;
                })}
            <SignUpItem {...email} />
            {errorMessage &&
                errorMessage.map((message: React.ReactNode) => {
                    return <>{message}</>;
                })}
            <Node {...buttonWrapper}>
                {buttons &&
                    buttons.map((button: React.ReactNode) => {
                        return <>{button}</>;
                    })}
            </Node>
        </>
    );
};

/**
 * Handles validation of sign-up givenName.
 * @param event - Content editable event.
 * @param event.givenName - Event Given Name.
 * @param event.errorMessage - Event Error Message.
 * @returns - Error Message for Given Name.
 */
const SignUpGivenNameVerificationComponent: React.FC<ISignUpGivenNameVerification> = ({ givenName, errorMessage }) => {
    return (
        <>
            <SignUpItem {...givenName} />
            {errorMessage.map((message: React.ReactNode) => {
                return <>{message}</>;
            })}
        </>
    );
};

/**
 * Handles validation of signUp surname.
 * @param event - Content editable event.
 * @param event.surname - Event surname.
 * @param event.errorMessage - Event Error Message.
 * @returns - Error Message for surname.
 */
const SignUpSurnameVerificationComponent: React.FC<ISignUpSurnameVerification> = ({ surname, errorMessage }) => {
    return (
        <>
            <SignUpItem {...surname} />
            {errorMessage.map((message: React.ReactNode) => {
                return <>{message}</>;
            })}
        </>
    );
};

const LocalAccount: React.FC<ISignUpLocalAccount> = ({
    localAccount,
    items,
    emailVerification,
    givenNameVerification,
    surnameVerification,
    buttons,
    errorMessage,
    disclaimer
}) => {
    return (
        <Node {...localAccount}>
            {items &&
                items.map((item: ISignUpItem) => {
                    if (item.key === 'email' && emailVerification.isRequired) {
                        return (
                            <Node key={item.key} {...emailVerification.verificationControlWrapper}>
                                <SignUpItem {...item} />
                                <SignUpEmailVerification {...emailVerification} />
                            </Node>
                        );
                    }
                    if (item.key === 'givenName' && givenNameVerification.isRequired) {
                        return (
                            <Node key={item.key} {...givenNameVerification.verificationControlWrapper}>
                                <SignUpItem {...item} />
                                <SignUpGivenNameVerificationComponent {...givenNameVerification} />
                            </Node>
                        );
                    }
                    if (item.key === 'surname' && surnameVerification.isRequired) {
                        return (
                            <Node key={item.key} {...surnameVerification.verificationControlWrapper}>
                                <SignUpItem {...item} />
                                <SignUpSurnameVerificationComponent {...surnameVerification} />
                            </Node>
                        );
                    }
                    // eslint-disable-next-line react/jsx-key
                    return <SignUpItem {...item} />;
                })}
            {errorMessage &&
                errorMessage.map((error: React.ReactNode, index: number) => {
                    return <React.Fragment key={index}>{error}</React.Fragment>;
                })}
            {buttons &&
                buttons.map((button: React.ReactNode, index: number) => {
                    return <React.Fragment key={index}>{button}</React.Fragment>;
                })}
            {disclaimer}
        </Node>
    );
};

const SignUpLoading: React.FC<ISignUpLoading> = ({ modal, modalBody, icon, message }) => {
    return (
        <Node {...modal}>
            <Node {...modalBody}>
                {icon}
                {message}
            </Node>
        </Node>
    );
};

const SignUpView: React.FC<ISignUpViewProps> = props => {
    const { signUp, viewState, loading, defaultAADConainer, aadConainer, heading, signUpLocalAccount } = props;

    return (
        <Module {...signUp}>
            {viewState.isShowLoading && <Node {...defaultAADConainer} />}
            {viewState.isShowLoading && <SignUpLoading {...loading} />}
            <Node {...aadConainer}>
                {heading}
                {LocalAccount(signUpLocalAccount)}
            </Node>
        </Module>
    );
};

export default SignUpView;
