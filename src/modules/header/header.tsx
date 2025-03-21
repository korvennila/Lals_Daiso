/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { CartIconComponent, WishListIconComponent } from '@msdyn365-commerce/components';
import * as MsDyn365 from '@msdyn365-commerce/core';
import { ICartState } from '@msdyn365-commerce/global-state';
import { Customer } from '@msdyn365-commerce/retail-proxy';
import { ErrorNotification, NotificationsManager } from '@msdyn365-commerce-modules/notifications-core';
import { ArrayExtensions } from '@msdyn365-commerce-modules/retail-actions';
import {
    Button,
    format,
    getPayloadObject,
    getTelemetryAttributes,
    getTelemetryObject,
    IModuleProps,
    INodeProps,
    ITelemetryContent,
    KeyCodes,
    Modal,
    ModalBody,
    ModalHeader,
    onTelemetryClick,
    Popover,
    TelemetryConstant
} from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import { computed, reaction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { isChannelTypeB2B } from '@msdyn365-commerce/core';
import { HeaderPreferredStore, Logo, NavIcon } from './components';
import { IHeaderData } from './header.data';
import { IHeaderProps, IHeaderResources, IMyAccountLinksData } from './header.props.autogenerated';

export interface IHeaderState {
    mobileMenuCollapsed: boolean;
    signinPopoverOpen: boolean;
    hasSigninerror?: boolean;
}

export interface IHeaderViewProps extends IHeaderProps<IHeaderData>, IHeaderState {
    logo: React.ReactNode;
    wishListIconDesktop: React.ReactNode;
    wishListIconMobile: React.ReactNode;
    cartIcon: React.ReactNode;
    navIcon: React.ReactNode;
    className: string;
    menuBar: React.ReactNode[];
    search: React.ReactNode[];
    siteOptions: React.ReactNode[];
    HeaderTag: IModuleProps;
    HeaderContainer: INodeProps;
    MobileMenuContainer: INodeProps;
    MobileMenuHeader: React.ReactNode;
    MobileMenuBodyContainer: INodeProps;
    MobileMenuLinksContainer: INodeProps;
    HeaderTopBarContainer: INodeProps;
    Divider: INodeProps;

    AccountInfoDropdownParentContainer?: INodeProps;
    AccountInfoDropdownPopoverConentContainer?: INodeProps;
    accountInfoDropdownButton?: React.ReactNode;

    signOutLink?: React.ReactNode;
    signInLink?: React.ReactNode;
    switchCustomerLink?: React.ReactNode;
    isOBORequest?: boolean;
    accountLinks?: React.ReactNode[];
    preferredStore?: React.ReactNode;
    currentDistributor?: React.ReactNode;
}

/**
 *
 * Header component.
 * @extends {React.PureComponent<IHeaderProps<IHeaderData>>}
 */
@observer
class Header extends React.PureComponent<IHeaderProps<IHeaderData>, IHeaderState> {
    private readonly popOverRef: React.RefObject<HTMLButtonElement>;

    private readonly telemetryContent: ITelemetryContent;

    private cart: ICartState | undefined;

    private isB2BSite: boolean = false;

    /**
     * The signed-in user name displayed in the header bar
     */
    @computed public get displayName(): Readonly<string | undefined> {
        return (
            (MsDyn365.isOboRequest(this.props.context.request) ? this.workerName : this.customerName) ||
            this.props.context.request?.user?.name
        );
    }

    /**
     * OBO scenario. The name of worker who shops on behalf of customer.
     */
    @computed public get workerName(): Readonly<string | undefined> {
        const worker = this.props.data.employee?.result;
        return worker?.Name;
    }

    @computed public get customerName(): Readonly<string | undefined> {
        const customer = this.props.data.accountInformation?.result;
        if (MsDyn365.isOboRequest(this.props.context.request)) {
            // For OBO scenario, display full customer name because multiple customers may have the same first name.
            return customer ? customer.Name : undefined;
        } else {
            return customer ? customer.FirstName || customer.Name : undefined;
        }
    }

    public constructor(props: IHeaderProps<IHeaderData>) {
        super(props);
        this.popOverRef = React.createRef();
        this._toggleNavbar = this._toggleNavbar.bind(this);
        this._togglePopover = this._togglePopover.bind(this);
        this._keydown = this._keydown.bind(this);
        this.state = {
            mobileMenuCollapsed: true,
            signinPopoverOpen: false,
            hasSigninerror: false
        };
        this.telemetryContent = getTelemetryObject(
            this.props.context.request.telemetryPageName!,
            this.props.friendlyName,
            this.props.telemetry
        );
        this.isB2BSite = isChannelTypeB2B(this.props.context.request);
    }

    public componentDidMount(): void {
        if (MsDyn365.msdyn365Commerce.isBrowser) {
            window.addEventListener('keydown', this._keydown);
        }
        reaction(
            () => {
                this.props.data.cart.result;
            },
            () => {
                this.cart = this.props.data.cart.result;
            }
        );

        const {
            context: {
                request: { user }
            },
            resources: {
                signUpCustomerNotFoundTitle,
                signUpMultipleCustomerFoundTitle,
                signInCustomerNotAuthorizedTitle,
                closeNotificationLabel
            }
        } = this.props;

        const signinNotificationError = this._getSigninNotification(
            user,
            signUpMultipleCustomerFoundTitle,
            signUpCustomerNotFoundTitle,
            signInCustomerNotAuthorizedTitle
        );
        if (signinNotificationError !== undefined && this.state.hasSigninerror === false) {
            // For signup show simple error notification.
            NotificationsManager.instance().addNotification(new ErrorNotification(signinNotificationError, closeNotificationLabel));
        }
    }

    public componentWillUnmount(): void {
        if (MsDyn365.msdyn365Commerce.isBrowser) {
            window.removeEventListener('keydown', this._keydown, false);
        }
    }

    public render(): JSX.Element | null {
        const {
            id,
            typeName,
            data: { accountInformation, wishlists },
            context: {
                request: { user }
            },
            context,
            resources: { cartLabel, cartQtyLabel }
        } = this.props;
        const { logoLink, logoImage, shouldShowWishlistCount } = this.props.config;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- app config is generic
        const disableTooltip = this.props.context.app.config.disableTooltip || false;
        const headerToggleClass = this.state.mobileMenuCollapsed ? '' : 'ms-header-open';
        const headerClassName = classnames('ms-header', this.props.config.className, headerToggleClass);
        const navbarKey = 'header-nav-mobile';
        const customer = accountInformation && accountInformation.result;
        const cartIconSlot = this._getSlot('cartIcon');
        const menuBarSlot = this._getSlot('menuBar');
        const searchSlot = this._getSlot('search');
        let wishlistCount = 0;
        const siteOptionsSlot = this._getSlot('siteOptions');
        const preferredStoreSlot = this._getSlot('storeSelector');
        const currentDistributorSlot = this._getSlot('distributorSelector');
        if (wishlists !== undefined) {
            if (
                !wishlists.result ||
                !ArrayExtensions.hasElements(wishlists.result) ||
                !wishlists.result[0].CommerceListLines ||
                !ArrayExtensions.hasElements(wishlists.result[0].CommerceListLines)
            ) {
                wishlistCount = 0;
            } else {
                wishlistCount = wishlists.result[0].CommerceListLines.length;
            }
        }
        const viewProps: IHeaderViewProps = {
            ...(this.props as IHeaderProps<IHeaderData>),
            ...this.state,
            logo: (
                <Logo
                    {...{
                        link: logoLink,
                        image: logoImage,
                        className: 'ms-header__logo',
                        gridSettings: this.props.context.request.gridSettings,
                        requestContext: this.props.context.request,
                        telemetryContent: this.telemetryContent,
                        typeName: this.props.typeName
                    }}
                />
            ),
            wishListIconDesktop: (
                <WishListIconComponent
                    className='ms-header__wishlist-desktop'
                    showButtonTooltip={!disableTooltip}
                    wishlistTooltipText={this.props.resources.wishlistTooltipText}
                    context={context}
                    id={id}
                    typeName={typeName}
                    telemetryContent={this.telemetryContent}
                    data={{}}
                    wishlistCount={wishlistCount}
                    wishlistCountLabel={this.props.resources.wishlistCountLabel}
                    isDispayWishlistCount={shouldShowWishlistCount}
                />
            ),
            wishListIconMobile: (
                <WishListIconComponent
                    className='ms-header__wishlist-mobile'
                    showButtonTooltip={!disableTooltip}
                    wishlistTooltipText={this.props.resources.wishlistTooltipText}
                    context={context}
                    id={id}
                    typeName={typeName}
                    telemetryContent={this.telemetryContent}
                    data={{}}
                    wishlistCount={wishlistCount}
                    wishlistCountLabel={this.props.resources.wishlistCountLabel}
                    isDispayWishlistCount={shouldShowWishlistCount}
                />
            ),
            cartIcon: ArrayExtensions.hasElements(cartIconSlot) ? (
                cartIconSlot[0]
            ) : (
                <CartIconComponent
                    cartLabel={cartLabel}
                    cartQtyLabel={cartQtyLabel}
                    context={context}
                    id={id}
                    typeName={typeName}
                    telemetryContent={this.telemetryContent}
                    data={{ cart: this.cart }}
                />
            ),
            navIcon: (
                <NavIcon
                    {...{
                        resources: this.props.resources,
                        isExpanded: !this.state.mobileMenuCollapsed,
                        targetId: navbarKey,
                        toggleNavBar: this._toggleNavbar,
                        telemetryContent: this.telemetryContent
                    }}
                />
            ),
            menuBar: ArrayExtensions.hasElements(menuBarSlot) ? menuBarSlot : [],
            search: ArrayExtensions.hasElements(searchSlot) ? searchSlot : [],
            siteOptions: ArrayExtensions.hasElements(siteOptionsSlot) ? siteOptionsSlot : [],
            className: headerClassName,
            HeaderTag: {
                moduleProps: this.props,
                className: classnames(headerClassName),
                'aria-label': this.props.resources.headerAriaLabel,
                tag: 'header'
            },
            HeaderContainer: {
                className: classnames('ms-header__container')
            },
            HeaderTopBarContainer: {
                className: classnames('ms-header__topbar')
            },
            Divider: {
                className: classnames('ms-header__divider')
            },
            MobileMenuContainer: {
                tag: Modal,
                id: navbarKey,
                className: 'ms-header__mobile-hamburger',
                isOpen: !this.state.mobileMenuCollapsed,
                wrapClassName: 'ms-header__modal',
                toggle: this._toggleNavbar
            },
            MobileMenuHeader: <ModalHeader className='ms-header__mobile-hamburger-menu-header' toggle={this._toggleNavbar} />,
            MobileMenuBodyContainer: {
                tag: ModalBody,
                className: 'ms-header__mobile-hamburger-menu-body'
            },
            MobileMenuLinksContainer: {
                className: 'ms-header__mobile-hamburger-menu-links'
            },
            AccountInfoDropdownParentContainer: {
                className: 'ms-header__account-info'
            },
            AccountInfoDropdownPopoverConentContainer: this.displayName
                ? {
                      tag: Popover,
                      id: 'myprofilePopover',
                      className: 'ms-header__account-info-content',
                      placement: 'bottom',
                      isOpen: this.state.signinPopoverOpen,
                      target: this.popOverRef,
                      toggle: this._togglePopover
                  }
                : undefined,
            signInLink: this._getSigninButton(user, this.props.resources),
            signOutLink: this._getSignOutButton(user, this.props.resources),
            isOBORequest: MsDyn365.isOboRequest(this.props.context.request),
            switchCustomerLink: this._getSwitchCustomerButton(user, this.props.resources),
            accountInfoDropdownButton: this._getAccountInfoDropdownButton(user, this.props.resources),
            accountLinks: this._getAccountLinks(customer),
            preferredStore: ArrayExtensions.hasElements(preferredStoreSlot) && <HeaderPreferredStore {...this.props} />,
            currentDistributor: this.isB2BSite && ArrayExtensions.hasElements(currentDistributorSlot) ? currentDistributorSlot : undefined
        };

        return this.props.renderView(viewProps) as React.ReactElement;
    }

    /**
     * Handle link text change.
     * @param linkIndex - Link Index.
     * @returns : Void.
     */
    public handleLinkTextChange = (linkIndex: number) => (event: MsDyn365.ContentEditableEvent): void => {
        if (this.props.config.myAccountLinks?.[linkIndex]) {
            this.props.config.myAccountLinks[linkIndex].linkText = event.target.value;
        }
    };

    /**
     * Get the slot.
     * @param slotName - Name of the slot.
     * @returns The slot.
     */
    private _getSlot(slotName: string): React.ReactNode[] | null {
        const { slots } = this.props;
        return (slots && slots[slotName] && slots[slotName].length && slots[slotName]) || null;
    }

    /**
     * Renders the sign in button.
     * @param user - Request context user.
     * @param resources - Resources.
     * @returns React Node.
     */
    private _getSigninButton(user: MsDyn365.IRequestContextUser | undefined, resources: IHeaderResources): React.ReactNode | undefined {
        const payLoad = getPayloadObject('click', this.telemetryContent, TelemetryConstant.SignIn);
        const attributes = getTelemetryAttributes(this.telemetryContent, payLoad);
        return (
            !this.displayName && (
                <Button
                    className='ms-header__signin-button'
                    title={resources.signInLinkText}
                    href={user?.signInUrl}
                    aria-label={resources.signInLinkAriaText}
                    onClick={onTelemetryClick(this.telemetryContent, payLoad, 'Sign in')}
                    {...attributes}
                >
                    <span className='ms-header__signin-button-text' aria-hidden>
                        {resources.signInLinkText}
                    </span>
                </Button>
            )
        );
    }

    /**
     * Renders the sign out button.
     * @param user - Request context user.
     * @param resources - Resources.
     * @returns React Node.
     */
    private _getSignOutButton(user: MsDyn365.IRequestContextUser | undefined, resources: IHeaderResources): React.ReactNode | undefined {
        const payLoad = getPayloadObject('click', this.telemetryContent, TelemetryConstant.SignOut);
        const attributes = getTelemetryAttributes(this.telemetryContent, payLoad);
        return (
            this.displayName && (
                <Button
                    className='ms-header__signout-button'
                    title={resources.signOutLinkText}
                    href={user?.signOutUrl ?? ''}
                    aria-label={resources.signOutLinkAriaText}
                    onClick={onTelemetryClick(this.telemetryContent, payLoad, 'Sign out')}
                    {...attributes}
                >
                    <span className='ms-header__signout-button-text' aria-hidden>
                        {resources.signOutLinkText}
                    </span>
                </Button>
            )
        );
    }

    /**
     * Renders the sign out button.
     * @param user - Request context user.
     * @param resources - Resources.
     * @returns React Node.
     */
    private _getSwitchCustomerButton(
        user: MsDyn365.IRequestContextUser | undefined,
        resources: IHeaderResources
    ): React.ReactNode | undefined {
        const payLoad = getPayloadObject('click', this.telemetryContent, TelemetryConstant.SwitchCustomer);
        const attributes = getTelemetryAttributes(this.telemetryContent, payLoad);
        const isOBOAccountSelected =
            MsDyn365.isOboRequest(this.props.context.request) && this.props.context.request.cookies.getAccountSelectionCookie();
        return (
            this.displayName &&
            isOBOAccountSelected && (
                <a
                    aria-label={resources.switchCustomerLinkAriaText}
                    className='ms-signin-info__account-link-button'
                    title={resources.switchCustomerLinkText}
                    href={this.getBusinessPartnerSelectionUrl()}
                    role='link'
                    onClick={() => this.props.context.request.cookies.removeAccountSelectionCookie()}
                    {...attributes}
                >
                    <div className='ms-header__switchcustomer-button-text'>
                        <div className='ms-header__shoppingas-text'>{format(resources.shoppingAsText, this.customerName)}</div>
                        <div>{resources.switchCustomerLinkText}</div>
                    </div>
                </a>
            )
        );
    }

    private getBusinessPartnerSelectionUrl(): string | undefined {
        const route = MsDyn365.getUrlSync('businessPartnerSelection', this.props.context.actionContext);
        if (!route || !MsDyn365.msdyn365Commerce.isBrowser) {
            return undefined;
        }

        // MsDyn365.getUrlSync persists some params in the route and remove other params.
        // Among the persisted params, we need to remove catalogid.
        const persistedParamToRemove = ['catalogid'];
        const url = new URL(route, window.location.href);
        persistedParamToRemove.forEach(param => url.searchParams.delete(param));
        return url.href;
    }

    private _getSigninNotification(
        user: MsDyn365.IRequestContextUser | undefined,
        signUpMultipleCustomerFoundTitle: string,
        signUpCustomerNotFoundTitle: string,
        signInCustomerNotAuthorizedTitle: string
    ): string | undefined {
        if (!user?.retailServerErrorCode) {
            return undefined;
        }

        const { signUpCustomerNotFound, signUpMultipleCustomerFound, signInCustomerNotAuthorized } = this.props.config;
        const notFoundError = 'Microsoft_Dynamics_Commerce_Runtime_CustomerNotFound_WhenAutoLinking';
        const multipleAccountError = 'Microsoft_Dynamics_Commerce_Runtime_MultipleCustomerAccountsFoundWithSameEmailAddress';
        const accountAuthorizationError = 'Microsoft_Dynamics_Commerce_Runtime_AuthorizationFailed';

        if (user?.retailServerErrorCode === notFoundError) {
            return signUpCustomerNotFound !== undefined ? signUpCustomerNotFound : signUpCustomerNotFoundTitle;
        } else if (user?.retailServerErrorCode === multipleAccountError) {
            return signUpMultipleCustomerFound !== undefined ? signUpMultipleCustomerFound : signUpMultipleCustomerFoundTitle;
        } else if (user?.retailServerErrorCode === accountAuthorizationError) {
            return signInCustomerNotAuthorized !== undefined ? signInCustomerNotAuthorized : signInCustomerNotAuthorizedTitle;
        }
        return user?.retailServerErrorMessage;
    }

    private _getAccountInfoDropdownButton(
        user: MsDyn365.IRequestContextUser | undefined,
        resources: IHeaderResources
    ): React.ReactNode | undefined {
        const payLoad = getPayloadObject('click', this.telemetryContent, TelemetryConstant.MyProfile);
        const attributes = getTelemetryAttributes(this.telemetryContent, payLoad);
        return (
            this.displayName && (
                <Button
                    innerRef={this.popOverRef}
                    className='ms-header__profile-button'
                    aria-describedby='myprofilePopover'
                    onClick={this._togglePopover}
                    color='link'
                    aria-label={this.displayName}
                    aria-expanded={this.state.signinPopoverOpen}
                    {...attributes}
                >
                    <div className='ms-profile-button-text'>
                        <div>{this.displayName}</div>
                        {MsDyn365.isOboRequest(this.props.context.request) && this.customerName && (
                            <div>{format(resources.shoppingAsText, this.customerName)}</div>
                        )}
                    </div>
                </Button>
            )
        );
    }

    private _getAccountLinks(customer: Customer | undefined): React.ReactNode[] | undefined {
        const { myAccountLinks } = this.props.config;
        const payLoad = getPayloadObject('click', this.telemetryContent, '');
        if (!this.displayName || !myAccountLinks || !ArrayExtensions.hasElements(myAccountLinks)) {
            return undefined;
        }
        return myAccountLinks.map((cta: IMyAccountLinksData, index: number) => {
            payLoad.contentAction.etext = cta.linkText;
            const attributes = getTelemetryAttributes(this.telemetryContent, payLoad);
            const editableLink: MsDyn365.ILinksData = {
                ariaLabel: cta.ariaLabel,
                className: 'ms-signin-info__account-link-button',
                linkText: cta.linkText,
                linkUrl: cta.linkUrl.destinationUrl,
                openInNewTab: cta.openInNewTab,
                role: 'link',
                additionalProperties: attributes
            };

            return (
                <MsDyn365.Link
                    key={index}
                    link={editableLink}
                    editProps={{ onTextChange: this.handleLinkTextChange(index), requestContext: this.props.context.request }}
                />
            );
        });
    }

    private _toggleNavbar(): void {
        this.setState({
            mobileMenuCollapsed: !this.state.mobileMenuCollapsed
        });
    }

    private _togglePopover(): void {
        this.setState({
            signinPopoverOpen: !this.state.signinPopoverOpen
        });
    }

    private _keydown(event: KeyboardEvent): void {
        if (event.keyCode === KeyCodes.Escape) {
            this.setState({ mobileMenuCollapsed: true });
        }
    }
}

export default Header;
