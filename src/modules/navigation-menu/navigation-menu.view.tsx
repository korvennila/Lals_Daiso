/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import MsDyn365, { IImageData, IImageSettings, Image } from '@msdyn365-commerce/core';
import { ArrayExtensions, generateImageUrl } from '@msdyn365-commerce-modules/retail-actions';
import {
    getPayloadObject,
    getTelemetryAttributes,
    getTelemetryObject,
    IPayLoad,
    ITelemetryContent,
    Module,
    Node,
    onTelemetryClick
} from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import * as React from 'react';

import { INavigationMenuViewProps } from './navigation-menu';
import { IMenuItemData } from './navigation-menu.data';

interface INavigationState {
    parentMenu?: number;
    activeMenu?: number;
    categoryImage?: IImageData[] | null;
    mobileViewLabelText?: string;
    categoryImageAltText: string;
}

/**
 *
 * NavigationMenuView component.
 * @extends {React.PureComponent<INavigationMenuViewProps>}
 */
export class NavigationMenuView extends React.PureComponent<INavigationMenuViewProps, INavigationState> {
    private static isBackTrack: boolean = false;

    private currentLevel: number = 0;

    private readonly menuNode: React.RefObject<HTMLUListElement>;

    private readonly menuItemRef: React.RefObject<HTMLElement>;

    private readonly telemetryContent: ITelemetryContent;

    private readonly payLoad: IPayLoad;

    constructor(props: INavigationMenuViewProps) {
        super(props);
        this.menuNode = React.createRef();
        this.menuItemRef = React.createRef();
        this.state = { activeMenu: undefined, mobileViewLabelText: '', parentMenu: undefined, categoryImageAltText: '' };
        this._closeSubmenu = this._closeSubmenu.bind(this);
        this.telemetryContent = getTelemetryObject(
            this.props.context.request.telemetryPageName!,
            this.props.friendlyName,
            this.props.telemetry
        );
        this.payLoad = getPayloadObject('click', this.telemetryContent, '', '');
    }

    public componentDidMount(): void {
        if (MsDyn365.isBrowser) {
            document.body.addEventListener('mousedown', this._handleClickOutside);
            document.body.addEventListener('focusout', this._handleFocusOutside);
        }
    }

    public componentDidUpdate(): void {
        if (this.menuItemRef.current?.children[0] && this.props.isMobileView) {
            (this.menuItemRef.current.children[0] as HTMLElement).focus();
        }
    }

    public componentWillUnmount(): void {
        if (MsDyn365.isBrowser) {
            document.body.removeEventListener('mousedown', this._handleClickOutside, false);
            document.body.removeEventListener('focusout', this._handleFocusOutside, false);
        }
    }

    public render(): JSX.Element | null {
        const { isMobileView, MenuList, MobileBackButton, MobileDescriptionContainer, MobileDescriptionLabel, Navigation } = this.props;

        this.currentLevel = 1;
        return (
            <Module
                {...Navigation}
                className={classnames(Navigation.className, isMobileView && this.state.activeMenu !== undefined ? 'child' : 'parent')}
            >
                <Node {...MenuList} ref={this.menuNode} tabIndex='-1'>
                    {isMobileView && this.state.activeMenu !== undefined && (
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

    private _renderDisplay(): JSX.Element[] {
        const { ListItem, menuItemData, isMobileView } = this.props;
        const { activeMenu } = this.state;
        const menuItemList: JSX.Element[] = [];

        if (isMobileView && activeMenu !== undefined && menuItemData.length > 0) {
            let menuItem: IMenuItemData = {};
            for (const menuItemDatum of menuItemData) {
                if (menuItemDatum && menuItemDatum.id === activeMenu) {
                    menuItem = menuItemDatum;
                    !NavigationMenuView.isBackTrack
                        ? this.setState({ parentMenu: undefined })
                        : this.setState({ parentMenu: undefined, mobileViewLabelText: menuItemDatum.linkText });
                    break;
                }
                menuItem = this._getFromSubMenu(menuItemDatum) as IMenuItemData;
                if (menuItem && menuItem.id === activeMenu) {
                    break;
                }
            }

            menuItem &&
                menuItemList.push(
                    <Node key={menuItem.id} {...ListItem}>
                        {' '}
                        {this._createMenuItemList(menuItem)}{' '}
                    </Node>
                );
        } else {
            menuItemData.forEach((item: IMenuItemData, index: number) => {
                menuItemList.push(
                    <Node
                        key={index}
                        {...ListItem}
                        ref={this._shouldAddFocusMenuRef(index, this.state.mobileViewLabelText, item.linkText) ? this.menuItemRef : null}
                    >
                        {this._createMenuItemList(item)}
                    </Node>
                );
            });
        }

        return menuItemList;
    }

    private _getFromSubMenu(item?: IMenuItemData): IMenuItemData | null {
        const subMenus = item && item.subMenu;
        if (subMenus && subMenus.length > 0) {
            for (let i = 0; i <= subMenus.length - 1; i++) {
                if (subMenus[i].id === this.state.activeMenu) {
                    !NavigationMenuView.isBackTrack
                        ? this.setState({ parentMenu: item?.id })
                        : this.setState({ parentMenu: item && item.id, mobileViewLabelText: subMenus[i].linkText });
                    return subMenus[i];
                }
                const found = this._getFromSubMenu(subMenus[i]);
                if (found) {
                    return found;
                }
            }
        }
        this.props.context.telemetry.error('Submenu content is empty, module wont render.');
        return null;
    }

    private _createMenuItemList(menuItemData: IMenuItemData): JSX.Element | null {
        if (menuItemData && menuItemData.subMenu && menuItemData.subMenu.length > 0) {
            if (this.props.isMobileView && this.state.activeMenu !== undefined) {
                return this._renderSubMenu(menuItemData.subMenu, menuItemData.id, false);
            }
            return (
                <>
                    {this._renderButtonMenuItem(menuItemData)}
                    {this._renderSubMenu(menuItemData.subMenu, menuItemData.id, false)}
                </>
            );
        } else if (menuItemData && menuItemData.linkText && menuItemData.linkURL && menuItemData.linkURL.length > 0) {
            return this._renderLinkMenuItem(menuItemData, menuItemData.id, false, true);
        } else if (menuItemData && menuItemData.linkText && !menuItemData.linkURL) {
            return this._renderSpanMenuItem(menuItemData, menuItemData.id, true);
        }
        this.props.context.telemetry.error('Navigation menu content is empty, module wont render.');
        return null;
    }

    private _renderSubMenu(subMenus?: IMenuItemData[], activeMenu?: number, IsSubMenu?: boolean): JSX.Element | null {
        const { isMobileView, ListItem } = this.props;
        const enableMultiSupportMenu = this.props.config.enableMultilevelMenu || false;
        const multiLevelSupportedMenu = this.props.config.menuLevelSupport || 3;

        // Const isParentMenu:boolean= false;
        if (activeMenu && this.state.activeMenu !== activeMenu) {
            this.props.context.telemetry.error('Navigation Active menu content is empty, module wont render.');
            return null;
        }

        if (!subMenus || subMenus.length === 0) {
            this.props.context.telemetry.error('Navigation Submenu content is empty, module wont render.');
            return null;
        }

        let levelClassName: string = '';
        const menuOptions =
            subMenus &&
            subMenus.map((option: IMenuItemData, idx: number) => {
                const hasOptions = option.subMenu && option.subMenu.length > 0;
                let menuItem: JSX.Element | null;
                if (hasOptions && isMobileView) {
                    menuItem = this._renderButtonMenuItem(option, activeMenu, idx);
                } else {
                    menuItem = option.linkURL ? this._renderLinkMenuItem(option, idx) : this._renderSpanMenuItem(option);
                }

                let subMenu;
                const haveSubmenu = hasOptions && enableMultiSupportMenu && this.currentLevel <= Math.round(multiLevelSupportedMenu) - 1;
                if (haveSubmenu) {
                    this.currentLevel++;
                    levelClassName = enableMultiSupportMenu ? `level-${this.currentLevel.toString()}` : '';
                    subMenu = this._renderSubMenu(option.subMenu, isMobileView ? option.id : undefined, true);
                }
                return (
                    <Node
                        {...ListItem}
                        key={option.id}
                        className={classnames(ListItem.className, haveSubmenu && 'havesubmenu')}
                        ref={this._shouldAddFocusMenuRef(idx, this.state.mobileViewLabelText, option.linkText) ? this.menuItemRef : null}
                    >
                        {menuItem}
                        {subMenu}
                    </Node>
                );
            });
        return this._renderMenu(levelClassName, menuOptions, activeMenu, IsSubMenu);
    }

    private _renderButtonMenuItem(option: IMenuItemData, activeMenu?: number, index?: number): JSX.Element | null {
        const { Button } = this.props;
        return (
            <Node
                key={index}
                {...Button}
                onClick={this._handleDropdownToggle(option, activeMenu)}
                onFocus={this._closeSubmenu}
                aria-haspopup={!(this.state.activeMenu && this.state.activeMenu === option.id)}
                aria-expanded={!!(this.state.activeMenu && this.state.activeMenu === option.id)}
                data-parent={activeMenu}
            >
                {option.linkText}
            </Node>
        );
    }

    private _renderLinkMenuItem(
        option: IMenuItemData,
        index?: number,
        hoverEffect: boolean = true,
        isParent: boolean = false
    ): JSX.Element | null {
        const { Link } = this.props;
        const linkText = option.linkText ? option.linkText : '';
        const imagesource = option.imageSource ? option.imageSource : '';
        this.payLoad.contentAction.etext = linkText;
        const attributes = getTelemetryAttributes(this.telemetryContent, this.payLoad);
        return (
            <Node
                {...Link}
                key={index}
                onFocus={isParent && this._closeSubmenu}
                target={option.shouldOpenNewTab ? '_blank' : undefined}
                onMouseOver={hoverEffect && this._updateCategoryImage(imagesource, option)}
                href={option.linkURL}
                {...attributes}
                onClick={onTelemetryClick(this.telemetryContent, this.payLoad, linkText)}
            >
                {option.linkText}
            </Node>
        );
    }

    private _renderPromotionalLink(linkText?: string, linkUrl?: string): JSX.Element | null {
        const { Link } = this.props;
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

    private _renderSpanMenuItem(option: IMenuItemData, index?: number, isParent: boolean = false): JSX.Element | null {
        const { Span } = this.props;
        return (
            <Node key={index} {...Span} onFocus={isParent && this._closeSubmenu}>
                {option.linkText}
            </Node>
        );
    }

    private _renderMenu(level: string, menuOptions: JSX.Element[], currentItem?: number, submenu?: boolean): JSX.Element | null {
        const { DivContainer, MenuList, ImageDivContainer, showCategoryImage, showPromotionalContent, isMobileView } = this.props;
        const categoryImageDisplay =
            !isMobileView &&
            (showCategoryImage || showPromotionalContent) &&
            !ArrayExtensions.hasElements(this.state.categoryImage) &&
            !submenu;
        const promotionalContentDisplay =
            !isMobileView && showPromotionalContent && ArrayExtensions.hasElements(this.state.categoryImage) && !submenu;
        const DivContainerClass = this.currentLevel > 2 || categoryImageDisplay ? DivContainer!.className : 'ms-nav__deafult';
        this.currentLevel = 1;
        return (
            <Node {...DivContainer} className={DivContainerClass}>
                <Node
                    {...MenuList}
                    className={classnames(
                        MenuList.className,
                        level,
                        categoryImageDisplay && 'havecateImage',
                        categoryImageDisplay &&
                            this.props.config.menuLevelSupport &&
                            this.props.config.menuLevelSupport > 2 &&
                            'navmenu-multi-level'
                    )}
                >
                    {menuOptions}
                </Node>
                {categoryImageDisplay &&
                    this.state.categoryImage &&
                    this.state.categoryImage.map(item => (
                        <Node {...ImageDivContainer} key={item.src} className={ImageDivContainer!.className}>
                            {this.state.categoryImage && this._getCategoryImage(item)}
                            {promotionalContentDisplay && this._renderPromotionalLink(item.altText, item.additionalProperties?.linkUrl)}
                        </Node>
                    ))}
            </Node>
        );
    }

    private readonly _updateCategoryImage = (categoryImageSrc: string, option: IMenuItemData) => () => {
        const linkText = option && option.linkText ? option.linkText : '';
        const promotionalImage: IImageData[] = [{ src: categoryImageSrc, altText: linkText }];

        // Read category and promotional image in one array
        if (ArrayExtensions.hasElements(option.promotionalContent)) {
            option.promotionalContent.map(item => {
                if (item && item.image) {
                    const imageSrc = item.image.src;
                    const promotionalItemImageSettings = item.image.imageSettings;
                    promotionalImage.push({
                        src: imageSrc,
                        altText: item.text,
                        imageSettings: promotionalItemImageSettings,
                        additionalProperties: { linkUrl: item.linkUrl.destinationUrl }
                    });
                }
            });
        }
        this.setState({
            categoryImage: promotionalImage.length > 0 ? promotionalImage : [{ src: 'empty' }],
            categoryImageAltText: linkText
        });
    };

    private readonly _handleDropdownToggle = (data: IMenuItemData, parentId?: number) => () => {
        if (!this.props.isMobileView) {
            this.setState({
                activeMenu: this.state.activeMenu && this.state.activeMenu === data.id! ? undefined : data.id!,
                parentMenu: parentId
            });
            if (this.props.showCategoryImage) {
                this._updateCategoryImage(data.imageSource!, data)();
            }
        } else {
            NavigationMenuView.isBackTrack = false;
            this.setState({
                activeMenu: data.id,
                mobileViewLabelText: data.linkText!,
                parentMenu: parentId
            });
        }
    };

    private readonly _handleGoBack = () => () => {
        NavigationMenuView.isBackTrack = true;
        this.setState({ activeMenu: this.state.parentMenu });
    };

    /**
     * Method to handle click outside of menu.
     * @param event -HTML event.
     */
    private readonly _handleClickOutside = (event: MouseEvent) => {
        if (this.menuNode.current && !this.menuNode.current.contains(event.target as Node)) {
            this.setState({
                activeMenu: undefined,
                mobileViewLabelText: '',
                categoryImage: null
            });
        }
    };

    /**
     * Method to handle click outside of menu.
     * @param event -HTML event.
     */
    private readonly _handleFocusOutside = (event: FocusEvent) => {
        if (this.menuNode.current && !this.menuNode.current.contains(event.relatedTarget as Node)) {
            this._closeSubmenu();
        }
    };

    /**
     * Checks to assign a ref for focus.
     * @param index -Sub menu list index.
     * @param mobileViewLabelText -Parent user clicked Sub menu list.
     * @param optionLinkText -Sub menu list.
     * @returns Ref.
     */
    private readonly _shouldAddFocusMenuRef = (index: number, mobileViewLabelText?: string, optionLinkText?: string) => {
        if (!NavigationMenuView.isBackTrack && index === 0) {
            return true;
        }
        if (!optionLinkText || !mobileViewLabelText) {
            return false;
        }
        return mobileViewLabelText === optionLinkText;
    };

    private _closeSubmenu(): void {
        if (!this.props.isMobileView) {
            this.setState({ activeMenu: undefined, categoryImage: null, mobileViewLabelText: '' });
        }
    }

    private readonly _getCategoryImage = (categoryImage?: IImageData): React.ReactNode | null => {
        if (!categoryImage || !categoryImage.src) {
            return null;
        }

        const categoryImageUrl = generateImageUrl(`${categoryImage.src}`, this.props.context.actionContext.requestContext.apiSettings);
        const defaultImageSettings: IImageSettings = {
            viewports: {
                xs: { q: 'w=300&h=250&m=8', w: 0, h: 0 },
                sm: { q: 'w=300&h=250&m=8', w: 0, h: 0 },
                md: { q: 'w=300&h=250&m=8', w: 0, h: 0 },
                lg: { q: 'w=300&h=250&m=8', w: 0, h: 0 }
            },
            lazyload: true
        };
        if (categoryImageUrl !== undefined) {
            return (
                <Image
                    requestContext={this.props.context.actionContext.requestContext}
                    className='ms-nav-image__item'
                    {...categoryImage}
                    gridSettings={this.props.context.request.gridSettings!}
                    imageSettings={categoryImage.imageSettings ?? this.props.config.categoryImageSettings ?? defaultImageSettings}
                    loadFailureBehavior='hide'
                    role='tabpanel'
                    id='categoryImageTag__categoryImage'
                    altText={categoryImage.altText}
                />
            );
        }
        return null;
    };
}

export default NavigationMenuView;
