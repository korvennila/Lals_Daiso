/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import {
    ISignInItem,
    ISignInLoading,
    ISignInLocalAccount,
    ISignInSocialAccount,
    ISignInSocialItem,
    ISignInB2BAccount,
    ISignInB2BItem,
    ISignInViewProps
} from './custom-sign-in';

const LocalAccount: React.FC<ISignInLocalAccount> = ({ localAccount, items, forgetPassword, disclaimer, error, signInButton }) => {
    return (
        <Node {...localAccount}>
            {items &&
                items.map((item: ISignInItem) => {
                    return (
                        <Node key={item.key} {...item.wrapper}>
                            {item.label}
                            {item.error}
                            {item.input}
                        </Node>
                    );
                })}
            {forgetPassword}
            {disclaimer}
            {error}
            {signInButton}
        </Node>
    );
};

const SocialAccount: React.FC<ISignInSocialAccount> = ({ socialAccounts, items }) => {
    return (
        <Node {...socialAccounts}>
            {items &&
                items.map((item: ISignInSocialItem) => {
                    return (
                        <Node key={item.key} {...item.button}>
                            {item.image}
                            {item.text}
                        </Node>
                    );
                })}
        </Node>
    );
};

const B2BAccount: React.FC<ISignInB2BAccount> = ({ socialAccounts, items }) => {
    return (
        <Node {...socialAccounts}>
            {items &&
                items.map((item: ISignInB2BItem) => {
                    return (
                        item && (
                            <Node key={item.key} {...item.button}>
                                {item.text}
                            </Node>
                        )
                    );
                })}
        </Node>
    );
};

const SignInLoading: React.FC<ISignInLoading> = ({ modal, modalBody, icon, message }) => {
    return (
        <Node {...modal}>
            <Node {...modalBody}>
                {icon}
                {message}
            </Node>
        </Node>
    );
};

const SignInView: React.FC<ISignInViewProps> = props => {
    const {
        signIn,
        viewState,
        loading,
        defaultAADConainer,
        aadConainer,
        signInSection,
        signUpSection,
        signInSectionHeading,
        signInLocalAccount,
        signInSocialAccount,
        signUpSectionHeading,
        signInB2BAccount,
        signUpDescription,
        signUpLink
    } = props;

    return (
        <Module {...signIn}>
            {viewState.isShowLoading && <Node {...defaultAADConainer} />}
            {viewState.isShowLoading && <SignInLoading {...loading} />}
            <Node {...aadConainer}>
                <Node {...signInSection}>
                    {signInSectionHeading}
                    {LocalAccount(signInLocalAccount)}
                    {SocialAccount(signInSocialAccount)}
                    {B2BAccount(signInB2BAccount)}
                </Node>
                <Node {...signUpSection}>
                    {signUpSectionHeading}
                    {signUpDescription}
                    {signUpLink}
                </Node>
            </Node>
        </Module>
    );
};

export default SignInView;
