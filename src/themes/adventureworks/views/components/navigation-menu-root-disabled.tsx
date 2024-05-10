/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as Msdyn365 from '@msdyn365-commerce/core';
import { IMenuItemData, MenuTypeIndexId } from '@msdyn365-commerce-modules/navigation-menu';
import { ArrayExtensions, StringExtensions } from '@msdyn365-commerce-modules/retail-actions';
import {
    addThrottledEvent,
    Button,
    Collapse,
    Drawer,
    getPayloadObject,
    getTelemetryAttributes,
    getTelemetryObject,
    ICollapseProps,
    IPayLoad,
    isMobile,
    ITelemetryContent,
    Module,
    Node,
    onTelemetryClick,
    VariantType
} from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import { computed } from 'mobx';
import * as React from 'react';

import { getCategoryImage, INavigationMenuViewRootProps, INavigationState, NavMenuConstants } from './navigation-menu-utilities';

/**
 *
 * NavigationMenuRootDisabled component.
 * @extends {React.PureComponent<INavigationMenuViewProps>}
 */
export class NavigationMenuRootDisabled extends React.PureComponent<INavigationMenuViewRootProps, INavigationState> {
    private static isBackTrack: boolean = false;

    private readonly supportedLevel: number = NavMenuConstants.four;

    private currentLevel: number = NavMenuConstants.zero;

    private readonly menuNode: React.RefObject<HTMLElement>;

    private readonly menuItemRef: React.RefObject<HTMLElement>;

    private readonly escapeKey: number = NavMenuConstants.escapeKey;

    private readonly telemetryContent: ITelemetryContent;

    private readonly promotionalImage: Msdyn365.IImageData[] = [];

    private readonly payLoad: IPayLoad;

    private readonly attributes?: Msdyn365.IDictionary<string>;

    private customResizeThrottledEventHandler?: (event: Event) => void;

    public constructor(props: INavigationMenuViewRootProps) {
        super(props);
        this.menuNode = React.createRef();
        this.menuItemRef = React.createRef();
        const { menuItemData } = this.props.navProps;
        if (ArrayExtensions.hasElements(menuItemData) && ArrayExtensions.hasElements(menuItemData[0].subMenu)) {
            const imagesource = menuItemData[0].subMenu[0].imageSource ? menuItemData[0].subMenu[0].imageSource : '';
            const linkText = menuItemData[0].subMenu[0].linkText ? menuItemData[0].subMenu[0].linkText : '';
            this.promotionalImage = [{ src: imagesource, altText: linkText }];

            // Read category and promotional image in one array
            if (ArrayExtensions.hasElements(menuItemData[0].subMenu[0].promotionalContent)) {
                menuItemData[0].subMenu[0].promotionalContent.map(item => {
                    const imageSource = item.image.src;
                    this.promotionalImage.push({
                        src: imageSource,
                        altText: item.text,
                        additionalProperties: { linkUrl: item.linkUrl.destinationUrl }
                    });
                    return null;
                });
            }
        }

        this.state = {
            activeMenu: undefined,
            mobileViewLabelText: '',
            parentMenu: undefined,
            drawerKeyValue: {},
            isOnlyMobile: this.isOnlyMobile,
            categoryImage: this.promotionalImage,
            isNavOpen: false
        };
        this.telemetryContent = getTelemetryObject(
            this.props.navProps.context.request.telemetryPageName!,
            this.props.navProps.friendlyName,
            this.props.navProps.telemetry
        );
        this.payLoad = getPayloadObject('click', this.telemetryContent, '', '');
        this.attributes = getTelemetryAttributes(this.telemetryContent, this.payLoad);
    }

    @computed public get isOnlyMobile(): boolean {
        return isMobile({ variant: VariantType.Browser, context: this.props.navProps.context.request }) === 'xs';
    }

    public componentDidMount(): void {
        this.customResizeThrottledEventHandler = addThrottledEvent(window, 'resize', this._customUpdateViewport as EventListener);
        document.addEventListener('keydown', (this._escFunction as unknown) as EventListener, false);
        this._customUpdateViewport();
        document.body.addEventListener('mousedown', this._handleClickOutside);
    }

    public componentDidUpdate(): void {
        if (this.menuItemRef.current?.children[0] && this.props.navProps.isMobileView) {
            (this.menuItemRef.current.children[0] as HTMLElement).focus();
        }
    }

    public componentWillUnmount(): void {
        window.removeEventListener('resize', this.customResizeThrottledEventHandler!, false);
        document.body.removeEventListener('mousedown', this._handleClickOutside, false);
    }

    public render(): JSX.Element | null {
        this.currentLevel = 1;
        const navbarKey = 'header-nav-mobile';
        return (
            <Node className='nav-menu-container' ref={this.menuNode}>
                {this.state.isOnlyMobile ? (
                    this._renderMobileMenu()
                ) : (
                    <>
                        <Button
                            className='ms-header__nav-icon'
                            onClick={this._toggleNavBar}
                            aria-controls={navbarKey}
                            title={this.props.navProps.resources.hamburgerAriaLabel}
                            aria-label={this.props.navProps.resources.hamburgerAriaLabel}
                            {...this.attributes}
                        />
                        {this._renderCollapseMenu()}
                    </>
                )}
            </Node>
        );
    }

    /**
     * Function to handle nav bar toggle.
     */
    private readonly _toggleNavBar = (): void => {
        this.setState(previousState => ({
            activeMenu: 1,
            isNavOpen: !previousState.isNavOpen
        }));
    };

    private _renderCollapseMenu(): JSX.Element | null {
        return (
            <Collapse className='ms-header__collapsible-hamburger' isOpen={this.state.isNavOpen}>
                {this.state.isOnlyMobile ? this._renderMobileMenu() : this._renderDesktopMenu()}
            </Collapse>
        );
    }

    private _renderMobileMenu(): JSX.Element {
        const { MenuList, MobileBackButton, MobileDescriptionContainer, MobileDescriptionLabel, Navigation } = this.props.navProps;

        this.currentLevel = 1;
        return (
            <Module
                {...Navigation}
                className={classnames(
                    Navigation.className,
                    this.state.isOnlyMobile && this.state.activeMenu !== undefined ? 'child' : 'parent'
                )}
            >
                <Node {...MenuList} tabIndex='-1'>
                    {this.state.isOnlyMobile && this.state.activeMenu !== undefined && (
                        <Node {...MobileDescriptionContainer}>
                            <Node {...MobileBackButton} onClick={this._handleGoBack()} />
                            <Node {...MobileDescriptionLabel}>{this.state.mobileViewLabelText}</Node>
                        </Node>
                    )}
                    {this._renderDisplay()}
                </Node>
            </Module>
        );
    }

    private _renderDesktopMenu(): JSX.Element {
        const { MenuList, Navigation } = this.props.navProps;

        return (
            <Module {...Navigation} className={classnames(Navigation.className, 'ms-nav__disable-top-menu')}>
                <Node {...MenuList} tabIndex='-1'>
                    {this._renderDisplay()}
                    <div className='ms-nav-close-button'>
                        <button className='btn nav-menu-close' aria-label='Close' onClick={this._closeNavMenu} />
                    </div>
                </Node>
            </Module>
        );
    }

    private _renderDrawerLink(item: IMenuItemData): JSX.Element | null {
        if (item.linkURL && !StringExtensions.isNullOrWhitespace(item.linkURL)) {
            return this._renderLinkMenuItem(item);
        } else if (!item.linkURL) {
            return this._renderSpanMenuItem(item);
        }
        return null;
    }

    private _renderDisplay(): JSX.Element[] {
        const { ListItem } = this.props.navProps;
        const menuItemData: IMenuItemData[] = this.props.navProps.menuItemData;
        const { activeMenu } = this.state;
        const menuItemList: JSX.Element[] = [];

        if (ArrayExtensions.hasElements(menuItemData)) {
            menuItemData[0].id = 1;
        }

        if (this.state.isOnlyMobile && activeMenu !== undefined && ArrayExtensions.hasElements(menuItemData)) {
            const menuItem = this._getFromSubMenu(undefined, menuItemData);

            if (menuItem) {
                menuItemList.push(
                    <Node key={menuItem.id} {...ListItem}>
                        {` `}
                        {this._createMenuItemList(menuItem)} {` `}
                    </Node>
                );
            }
        } else {
            for (const [index, item] of menuItemData.entries()) {
                menuItemList.push(
                    <Node
                        key={item.id}
                        {...ListItem}
                        ref={this._shouldAddFocusMenuRef(index, this.state.mobileViewLabelText, item.linkText) ? this.menuItemRef : null}
                    >
                        {this._createMenuItemList(item)}
                    </Node>
                );
            }
        }

        return menuItemList;
    }

    private _getFromSubMenu(parentMenuId?: number, menu?: IMenuItemData[]): IMenuItemData | null {
        if (!menu) {
            return null;
        }

        for (let index = 0; index <= menu.length - NavMenuConstants.one; index++) {
            const item: IMenuItemData = menu[Number(index)];

            if (item.id === this.state.activeMenu) {
                if (!NavigationMenuRootDisabled.isBackTrack) {
                    this.setState({ parentMenu: parentMenuId });
                } else {
                    this.setState({ parentMenu: parentMenuId, mobileViewLabelText: item.linkText });
                }
                return item;
            }
            const found = this._getFromSubMenu(item.id, item.subMenu);
            if (found) {
                return found;
            }
        }
        return null;
    }

    private _createMenuItemList(menuItemData: IMenuItemData): JSX.Element | null {
        if (ArrayExtensions.hasElements(menuItemData.subMenu)) {
            if (this.state.isOnlyMobile && this.state.activeMenu !== undefined) {
                return this._renderSubMenu(menuItemData.subMenu, menuItemData.id, false);
            }

            return (
                <>
                    {this._renderButtonMenuItem(menuItemData)}
                    {this._renderSubMenu(menuItemData.subMenu, menuItemData.id)}
                </>
            );
        } else if (menuItemData.linkURL && !StringExtensions.isNullOrWhitespace(menuItemData.linkURL)) {
            return this._renderLinkMenuItem(menuItemData, menuItemData.id);
        } else if (!menuItemData.linkURL && !(this.state.isOnlyMobile && this.state.activeMenu !== undefined)) {
            return this._renderSpanMenuItem(menuItemData);
        }

        return null;
    }

    private _renderSubMenu(subMenuArray?: IMenuItemData[], activeMenu?: number, isSubMenu?: boolean): JSX.Element | null {
        let subMenus: IMenuItemData[] | undefined = subMenuArray;
        if (activeMenu === NavMenuConstants.rootMenu) {
            subMenus = subMenuArray!.filter(subMenuItem => subMenuItem.id && subMenuItem.id >= MenuTypeIndexId.Retail);
        }

        const { ListItem } = this.props.navProps;
        const isEnableMultiSupportMenu = this.props.navProps.config.enableMultilevelMenu ?? false;
        const multiLevelSupportedMenu = this.props.navProps.config.menuLevelSupport ?? NavMenuConstants.three;

        if (activeMenu && this.state.activeMenu !== activeMenu) {
            this.props.navProps.context.telemetry.error('Navigation Active menu content is empty, module wont render.');
            return null;
        }

        if (!subMenus || !ArrayExtensions.hasElements(subMenus)) {
            this.props.navProps.context.telemetry.error('Navigation Submenu content is empty, module wont render.');
            return null;
        }

        let levelClassName: string = '';
        const menuOptions = subMenus.map((option: IMenuItemData, index: number) => {
            const hasOptions = option.subMenu && ArrayExtensions.hasElements(option.subMenu);
            let menuItem: JSX.Element | null;
            if (hasOptions && this.state.isOnlyMobile) {
                menuItem = this._renderButtonMenuItem(option, activeMenu, index);
            } else if (this.currentLevel === NavMenuConstants.one || !hasOptions) {
                menuItem = this.getMenuItem(option, index);
            } else {
                menuItem = null;
            }
            let subMenu;
            const isHavingSubmenu =
                hasOptions && isEnableMultiSupportMenu && this.currentLevel <= Math.round(multiLevelSupportedMenu) - NavMenuConstants.one;

            if (hasOptions && !this.state.isOnlyMobile) {
                if (this.currentLevel >= NavMenuConstants.two) {
                    subMenu = this._renderSubMenuDrawer(option);
                } else if (this.currentLevel <= this.supportedLevel) {
                    this.currentLevel++;
                    levelClassName = `level-${this.currentLevel.toString()}`;
                    subMenu = this._renderSubMenu(option.subMenu, undefined, true);
                }
            }

            if (isHavingSubmenu && this.state.isOnlyMobile) {
                this.currentLevel++;
                levelClassName = isEnableMultiSupportMenu ? `level-${this.currentLevel.toString()}` : '';
                subMenu = this._renderSubMenu(option.subMenu, option.id, true);
            }
            const imagesource = option.imageSource ? option.imageSource : '';
            return (
                <Node
                    {...ListItem}
                    key={option.id}
                    onMouseOver={this.currentLevel === NavMenuConstants.one && this._updateCategoryImage(imagesource, option)}
                    className={classnames(ListItem.className, isHavingSubmenu && 'havesubmenu')}
                    ref={this._shouldAddFocusMenuRef(index, this.state.mobileViewLabelText, option.linkText) ? this.menuItemRef : null}
                >
                    {menuItem}
                    {subMenu}
                </Node>
            );
        });
        return this._renderMenu(levelClassName, menuOptions, isSubMenu);
    }

    private getMenuItem(option: IMenuItemData, index: number): JSX.Element | null {
        let menuItem: JSX.Element | null;
        if (this.currentLevel === NavMenuConstants.one) {
            menuItem = option.linkURL ? this._renderLinkMenuItemLevelOne(option, index) : this._renderSpanMenuItem(option);
        } else {
            menuItem = option.linkURL ? this._renderLinkMenuItem(option, index) : this._renderSpanMenuItem(option);
        }
        return menuItem;
    }

    private _renderSubMenuDrawer(menuItem: IMenuItemData): JSX.Element | null {
        const levelClassName = `level-${this.currentLevel.toString()}`;
        const toggleButtonText = menuItem.linkText;
        const keyValue = this.state.drawerKeyValue;
        const buttonText = toggleButtonText !== undefined ? toggleButtonText : '';
        const keys = keyValue;
        const multiLevelSupportedMenu = this.props.navProps.config.menuLevelSupport ?? NavMenuConstants.three;

        let isDrawerOpen = false;
        if (keys[menuItem.id!]) {
            isDrawerOpen = true;
        }
        const colProps: ICollapseProps = { timeout: 0, isOpen: isDrawerOpen };

        return (
            <Drawer
                collapseProps={colProps}
                key={menuItem.id}
                className={classnames('ms-nav__drawer_desktop', levelClassName)}
                openGlyph='ms-nav__drawer-open'
                closeGlyph='ms-nav__drawer-close'
                glyphPlacement='start'
                toggleButtonText={buttonText}
                onToggle={this._bindDesktopCategoryClick(menuItem.id, isDrawerOpen)}
            >
                <div>
                    {menuItem.subMenu!.map((menuSubItem: IMenuItemData) => {
                        if (ArrayExtensions.hasElements(menuSubItem.subMenu)) {
                            this.currentLevel++;
                            if (this.currentLevel < multiLevelSupportedMenu) {
                                return this._renderSubMenuDrawer(menuSubItem);
                            }
                        }
                        return this._renderDrawerLink(menuSubItem);
                    })}
                </div>
            </Drawer>
        );
    }

    /**
     * Method to handle escape key event.
     * @param menuId -Number.
     * @param isDrawerOpen -Boolean.
     * @returns Void.
     */
    private readonly _bindDesktopCategoryClick = (menuId: number | undefined, isDrawerOpen: boolean) => (): void => {
        const { drawerKeyValue } = this.state;
        const newPair = { [menuId!]: !isDrawerOpen };
        this.setState({ drawerKeyValue: { ...drawerKeyValue, ...newPair } });
    };

    private _renderButtonMenuItem(option: IMenuItemData, activeMenu?: number, index?: number): JSX.Element | null {
        return (
            <Node
                key={index}
                {...this.props.navProps.Button}
                onClick={this._handleDropdownToggle(option, activeMenu)}
                aria-haspopup={!(this.state.activeMenu && this.state.activeMenu === option.id)}
                aria-expanded={!!(this.state.activeMenu && this.state.activeMenu === option.id)}
                data-parent={activeMenu}
                aria-label={this.state.isOnlyMobile ? option.ariaLabel : undefined}
            >
                {option.linkText}
            </Node>
        );
    }

    private _renderLinkMenuItem(option: IMenuItemData, index?: number): JSX.Element | null {
        const { Link } = this.props.navProps;
        const linkText = option.linkText ? option.linkText : '';
        this.payLoad.contentAction.etext = linkText;
        const attributes = getTelemetryAttributes(this.telemetryContent, this.payLoad);
        return (
            <Node
                {...Link}
                key={index}
                href={option.linkURL}
                {...attributes}
                target={option.shouldOpenNewTab ? '_blank' : undefined}
                onClick={onTelemetryClick(this.telemetryContent, this.payLoad, linkText)}
            >
                {option.linkText}
            </Node>
        );
    }

    private _renderLinkMenuItemLevelOne(option: IMenuItemData, index?: number, isHoverEffect: boolean = true): JSX.Element | null {
        const { Link } = this.props.navProps;
        const linkText = option.linkText ? option.linkText : '';
        const imagesource = option.imageSource ? option.imageSource : '';
        this.payLoad.contentAction.etext = linkText;
        const attributes = getTelemetryAttributes(this.telemetryContent, this.payLoad);
        return (
            <Node
                {...Link}
                key={index}
                onMouseOver={isHoverEffect && this._updateCategoryImage(imagesource, option)}
                href={option.linkURL}
                {...attributes}
                onClick={onTelemetryClick(this.telemetryContent, this.payLoad, linkText)}
            >
                {option.linkText}
            </Node>
        );
    }

    private _renderPromotionalLink(linkText?: string, linkUrl?: string): JSX.Element | null {
        const { Link } = this.props.navProps;
        this.payLoad.contentAction.etext = linkText;
        const attributes = getTelemetryAttributes(this.telemetryContent, this.payLoad);
        if (linkText && linkUrl) {
            return (
                <Node {...Link} href={linkUrl} {...attributes} onClick={onTelemetryClick(this.telemetryContent, this.payLoad, linkText)}>
                    {linkText}
                </Node>
            );
        }
        return null;
    }

    private _renderSpanMenuItem(option: IMenuItemData, index?: number): JSX.Element | null {
        const { Span } = this.props.navProps;
        return (
            <Node key={index} {...Span}>
                {option.linkText}
            </Node>
        );
    }

    private _renderMenu(level: string, menuOptions: JSX.Element[], isSubmenu?: boolean): JSX.Element | null {
        const { DivContainer, MenuList, ImageDivContainer, showCategoryImage, showPromotionalContent } = this.props.navProps;
        const isCategoryImageDisplay =
            !this.state.isOnlyMobile &&
            showCategoryImage &&
            this.state.categoryImage !== null &&
            this.state.categoryImage !== undefined &&
            !isSubmenu;
        const isPromotionalContentDisplay =
            !this.state.isOnlyMobile && showPromotionalContent && ArrayExtensions.hasElements(this.state.categoryImage) && !isSubmenu;
        const divContainerClass =
            this.currentLevel > NavMenuConstants.two || isCategoryImageDisplay ? DivContainer!.className : 'ms-nav__deafult';
        this.currentLevel = NavMenuConstants.one;
        const menuLevelSupportClassName =
            isCategoryImageDisplay &&
            this.props.navProps.config.menuLevelSupport &&
            this.props.navProps.config.menuLevelSupport > NavMenuConstants.two &&
            'navmenu-multi-level';

        const categoryImages = this.state.categoryImage?.filter(image => !StringExtensions.isNullOrWhitespace(image.src));
        const imagesContainerKey = categoryImages?.map(item => item.src).join('-');
        return (
            <Node {...DivContainer} className={divContainerClass}>
                <Node
                    {...MenuList}
                    className={classnames(MenuList.className, level, isCategoryImageDisplay && 'havecateImage', menuLevelSupportClassName)}
                >
                    {menuOptions}
                </Node>
                <div className='category-image-container' key={imagesContainerKey}>
                    {isCategoryImageDisplay &&
                        ArrayExtensions.hasElements(categoryImages) &&
                        categoryImages.map(item => (
                            <Node {...ImageDivContainer} className={ImageDivContainer!.className} key={item.src}>
                                {getCategoryImage(this.props, item.src ?? '', item.altText!.toString())}
                                {isPromotionalContentDisplay &&
                                    this._renderPromotionalLink(item.altText, item.additionalProperties?.linkUrl)}
                            </Node>
                        ))}
                </div>
                <div className='menu-custom-close-button'>
                    <p title='Close'>x</p>
                </div>
            </Node>
        );
    }

    /**
     * Handle Category image update.
     * @param categoryImageSource - Image source.
     * @param option - Menu Item data.
     * @returns Returns empty.
     */
    private readonly _updateCategoryImage = (categoryImageSource: string, option: IMenuItemData) => () => {
        const linkText = option.linkText ? option.linkText : '';
        const promotionalImage: Msdyn365.IImageData[] = [{ src: categoryImageSource, altText: linkText }];

        // Read category and promotional image in one array
        if (ArrayExtensions.hasElements(option.promotionalContent)) {
            for (const item of option.promotionalContent) {
                const imageSource = item.image.src;
                promotionalImage.push({
                    src: imageSource,
                    altText: item.text,
                    additionalProperties: { linkUrl: item.linkUrl.destinationUrl }
                });
            }
        }
        this.setState({
            categoryImage: ArrayExtensions.hasElements(promotionalImage) ? promotionalImage : [{ src: 'empty' }]
        });
    };

    /**
     * Handle dropdown toggle.
     * @param data - Menu Item data.
     * @param parentId - Number.
     * @returns Returns empty.
     */
    private readonly _handleDropdownToggle = (data: IMenuItemData, parentId?: number) => () => {
        if (!this.state.isOnlyMobile) {
            this.setState({
                activeMenu: data.id,
                parentMenu: parentId
            });
            if (this.props.navProps.showCategoryImage) {
                this._updateCategoryImage(data.imageSource!, data)();
            }
        } else {
            NavigationMenuRootDisabled.isBackTrack = false;
            this.setState({
                activeMenu: data.id,
                mobileViewLabelText: data.linkText!,
                parentMenu: parentId
            });
        }
    };

    /**
     * Handle back navigation for menu items for mobile view.
     * @returns Returns empty.
     */
    private readonly _handleGoBack = () => () => {
        NavigationMenuRootDisabled.isBackTrack = true;
        this.setState(previousState => ({ activeMenu: previousState.parentMenu }));
    };

    /**
     * Function to close the nav menu on click on body.
     * @param event - MouseEvent.
     */
    private readonly _handleClickOutside = (event: MouseEvent) => {
        if (this.menuNode.current && !this.menuNode.current.contains(event.target as Node)) {
            if (!this.state.isOnlyMobile) {
                this.setState({ activeMenu: 1, mobileViewLabelText: '', isNavOpen: false });
            } else {
                this.setState({ activeMenu: undefined, mobileViewLabelText: '', isNavOpen: false });
            }
        }
    };

    /**
     * Checks to assign a ref for focus.
     * @param index -Sub menu list index.
     * @param mobileViewLabelText -Mobile view label text.
     * @param optionLinkText -Sub menu item link text.
     * @returns Boolean.
     */
    private readonly _shouldAddFocusMenuRef = (index: number, mobileViewLabelText?: string, optionLinkText?: string) => {
        const firstIndex: number = 0;
        if (!NavigationMenuRootDisabled.isBackTrack && index === firstIndex) {
            return true;
        }
        if (!optionLinkText || !mobileViewLabelText) {
            return false;
        }
        return mobileViewLabelText === optionLinkText;
    };

    /**
     * Function to handle nav menu close.
     */
    private readonly _closeNavMenu = (): void => {
        if (!this.state.isOnlyMobile) {
            this.setState({ activeMenu: 1, mobileViewLabelText: '', isNavOpen: false });
        } else {
            this.setState({ activeMenu: undefined, mobileViewLabelText: '', isNavOpen: false });
        }
        (this.menuNode.current?.children[0] as HTMLElement).focus();
    };

    /**
     * Function to close the nav menu on esc key.
     * @param event - Event.
     */
    private readonly _escFunction = (event: React.KeyboardEvent) => {
        if (event.keyCode === this.escapeKey && !this.state.isOnlyMobile && this.state.isNavOpen) {
            this.setState({ activeMenu: 1, mobileViewLabelText: '', isNavOpen: false });
            (this.menuNode.current?.children[0] as HTMLElement).focus();
        }
    };

    /**
     * Custom update viewport.
     */
    private readonly _customUpdateViewport = (): void => {
        this.setState({ isOnlyMobile: this.isOnlyMobile });
    };
}

export default NavigationMenuRootDisabled;
