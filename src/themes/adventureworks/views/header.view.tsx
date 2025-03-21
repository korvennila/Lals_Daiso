/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import MsDyn365 from '@msdyn365-commerce/core';
import { IHeaderViewProps, Logo } from '@msdyn365-commerce-modules/header';
import { ArrayExtensions } from '@msdyn365-commerce-modules/retail-actions';
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import * as React from 'react';

import { IHeaderProps } from '../definition-extensions/header.ext.props.autogenerated';

/**
 * GridSizes.
 */
export type GridSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 *
 * HeaderView component.
 * @extends {React.PureComponent<IHeaderViewProps>}
 */
export class HeaderView extends React.PureComponent<IHeaderViewProps & IHeaderProps<{}>> {
    private readonly menuNode: React.RefObject<HTMLDivElement>;

    public constructor(props: IHeaderViewProps & IHeaderProps<{}>) {
        super(props);
        this.menuNode = React.createRef();
    }

    public componentDidMount(): void {
        if (this.props.config.useStickyHeader) {
            // Set header update methods to trigger on scroll
            if (MsDyn365.isBrowser) {
                window.addEventListener('scroll', () => {
                    this._configureStickyHeader();
                });
            }
            this._configureStickyHeader();
        }
    }

    public render(): JSX.Element | null {
        // eslint-disable-next-line @typescript-eslint/naming-convention -- Cannot change the prop names as props are from business logic.
        const {
            HeaderTag,
            HeaderContainer,
            HeaderTopBarContainer,
            Divider,
            MobileMenuContainer,
            MobileMenuBodyContainer,
            MobileMenuLinksContainer
        } = this.props;

        return (
            <Module {...HeaderTag}>
                <Node {...HeaderContainer}>
                    <Node {...HeaderTopBarContainer}>
                        {this.props.logo}
                        {this._renderMobileLogo()}
                        <div className='desktop-navicon-container' ref={this.menuNode}>
                            {this._renderReactFragment(this.props.menuBar)}
                        </div>
                        <div className='mobile-navicon-container'>{this.props.navIcon}</div>
                        {this._renderReactFragment(this.props.search)}
                        {this.props.preferredStore}
                        {this.props.currentDistributor}
                        {this._renderAccountBlock(this.props)}
                        <Node {...Divider} />
                        {this.props.wishListIconDesktop}
                        {this.props.cartIcon}
                        {this._renderReactFragment(this.props.siteOptions)}
                    </Node>
                    <Node {...MobileMenuContainer}>
                        <Node {...MobileMenuBodyContainer}>
                            {this.props.MobileMenuHeader}
                            {this._renderReactFragment(this.props.menuBar)}
                            <Node {...MobileMenuLinksContainer}>
                                {this.props.accountLinks ? this.props.accountLinks.map(link => link) : false}
                                {this.props.siteOptions}
                                {this.props.wishListIconMobile}
                                {this.props.signInLink}
                                {this.props.signOutLink}
                            </Node>
                        </Node>
                    </Node>
                </Node>
            </Module>
        );
    }

    /**
     * Function to update header.
     */
    private readonly _configureStickyHeader = (): void => {
        // Get heights of cookie and promotion banners
        const defaultValue = 0;
        const headerAlertsContainer: HTMLElement | null = document.querySelector('.ms-promo-banner');
        const bannerHeights = headerAlertsContainer ? headerAlertsContainer.offsetHeight : defaultValue;

        // Triggers opacity change of header
        const headerElement = document.querySelector('header .default-container');
        if (headerElement) {
            if (MsDyn365.isBrowser && document.documentElement.scrollTop > defaultValue) {
                headerElement.classList.add('lock-opaque');
                headerElement.classList.add('fixed');
            } else {
                headerElement.classList.remove('lock-opaque');
                headerElement.classList.remove('fixed');
            }
        }

        // Update sticky header position and opacity
        const stickyHeader: HTMLElement | null = document.querySelector('.desktop-navicon-container');
        const headerLogo: HTMLElement | null = document.querySelector('.ms-header__logo');

        if (stickyHeader && headerLogo) {
            // Fix center sticky header
            const navStickyPos = headerLogo.offsetHeight + bannerHeights;
            if (MsDyn365.isBrowser && document.documentElement.scrollTop > navStickyPos) {
                stickyHeader.classList.add('fixed');
            } else {
                stickyHeader.classList.remove('fixed');
            }
        }
    };

    private _renderMobileLogo(): JSX.Element | null {
        const { config, context, typeName } = this.props;
        return (
            <Logo
                {...{
                    link: config.logoLink,
                    image: config.mobileLogoImage ?? {},
                    className: 'ms-header__mobile-logo',
                    gridSettings: context.request.gridSettings,
                    requestContext: context.request,
                    typeName
                }}
            />
        );
    }

    /**
     * Function to render account block.
     * @param props - IHeaderViewProps.
     * @returns Returns JSX.Element | null.
     */
    private readonly _renderAccountBlock = (props: IHeaderViewProps): JSX.Element | null => {
        // eslint-disable-next-line @typescript-eslint/naming-convention -- Cannot change the prop names as props are from business logic.
        const {
            AccountInfoDropdownParentContainer,
            AccountInfoDropdownPopoverConentContainer,
            accountInfoDropdownButton,
            signInLink
        } = props;
        if (AccountInfoDropdownParentContainer) {
            const accountClassName = classnames(AccountInfoDropdownParentContainer.className, 'account-desktop');
            if (AccountInfoDropdownPopoverConentContainer) {
                return (
                    <Node {...AccountInfoDropdownParentContainer} className={accountClassName}>
                        {accountInfoDropdownButton}
                        <Node {...AccountInfoDropdownPopoverConentContainer}>{this._renderAccountDropdownLinks(props)}</Node>
                    </Node>
                );
            } else if (signInLink) {
                return (
                    <Node {...AccountInfoDropdownParentContainer} className={accountClassName}>
                        {signInLink}
                    </Node>
                );
            }
        }
        return null;
    };

    private readonly _renderAccountDropdownLinks = (props: IHeaderViewProps): JSX.Element | null => {
        const { isOBORequest, switchCustomerLink, accountLinks, signOutLink } = props;
        if (isOBORequest) {
            return (
                <>
                    {switchCustomerLink}
                    {signOutLink}
                    {accountLinks ? <Node className='ms-profile-button-splitter' /> : false}
                    {accountLinks ? accountLinks.map((link: React.ReactNode) => link) : false}
                </>
            );
        } else {
            return (
                <>
                    {accountLinks ? accountLinks.map((link: React.ReactNode) => link) : false}
                    {signOutLink}
                </>
            );
        }
    };

    /**
     * Function to render react fragment.
     * @param items - React nodes.
     * @returns Returns JSX.Element | null.
     */
    private readonly _renderReactFragment = (items: React.ReactNode[]): JSX.Element | null => {
        return (
            <>
                {ArrayExtensions.hasElements(items)
                    ? items.map((slot: React.ReactNode) => {
                          return <>{slot}</>;
                      })
                    : null}
            </>
        );
    };
}

export default HeaderView;
