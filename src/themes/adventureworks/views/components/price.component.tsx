/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { IComponent, IComponentProps, msdyn365Commerce } from '@msdyn365-commerce/core';
import { ProductPrice, ProductType, SalesAgreementPriceLine, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import { Button, format, ICollapseProps } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import * as React from 'react';

const defaultPrice: number = 0;
const freePrice: number = 0;

/**
 * Interface for price component resources.
 * @param {string} priceRangeSeparator - The price range separator.
 */
export interface IPriceComponentResources {
    priceRangeSeparator?: string;
    salesAgreementPricePrompt?: string;
    salesAgreementExpirationDatePrompt?: string;
    salesAgreementCommittedQuantityPrompt?: string;
    salesAgreementRemainingQuantityPrompt?: string;
}

/**
 * Interface for price component props.
 * @param {boolean} isPriceMinMaxEnabled - Whether the price range feature is enabled or not.
 * @param {IPriceComponentResources} priceResources - The price range resources.
 */
export interface IPriceComponentProps extends IComponentProps<{ price: ProductPrice }> {
    className?: string;
    product?: SimpleProduct;
    savingsText?: string;
    freePriceText?: string;
    originalPriceText?: string;
    currentPriceText?: string;
    isPriceMinMaxEnabled?: boolean;
    isSalesAgreementPriceFeatureEnabled?: boolean;
    salesAgreementLineId?: number;
    priceResources?: IPriceComponentResources;
    salesAgreementDetailCollapseProps?: ICollapseProps;
    currencyCode?: string;
    salesAgreementDetailOnClick?(event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>): void;
}

/**
 * The interface of price component.
 */
export interface IPriceComponent extends IComponent<IPriceComponentProps> {}

const priceComponentActions = {};

/**
 * Get the original price from price component props.
 * @param props - The IPriceComponentProps.
 * @returns The original price.
 */
const getOriginalPrice = (props: IPriceComponentProps): number => {
    return props.data.price.AdjustedPrice ?? props.data.price.TradeAgreementPrice ?? props.data.price.BasePrice ?? defaultPrice;
};

const getActivePrice = (props: IPriceComponentProps): number => {
    if (showPriceRangeForMasterProduct(props) && props.data.price.MinVariantPrice !== undefined) {
        return props.data.price.MinVariantPrice;
    }

    if (props.data.price.CustomerContextualPrice !== undefined) {
        return props.data.price.CustomerContextualPrice;
    }

    return getOriginalPrice(props);
};

/**
 * Get the formatted currency.
 * @param props - The props.
 * @param price - The price.
 * @param shouldUseFreePriceText - The shouldUseFreePriceText.
 * @returns The formatted currency.
 */
const formatCurrency = (
    props: IPriceComponentProps,
    price: number | undefined,
    shouldUseFreePriceText: boolean | undefined,
    currencyCode?: string | undefined
): string => {
    if (price === undefined) {
        return '';
    }

    if (shouldUseFreePriceText && price === freePrice && props.freePriceText) {
        return props.freePriceText;
    }

    return props.context.cultureFormatter.formatCurrency(price, currencyCode);
};

const showPriceRangeForMasterProduct = (props: IPriceComponentProps): boolean => {
    return (
        (props.isPriceMinMaxEnabled ?? false) &&
        (props.product?.ProductTypeValue === ProductType.Master || props.product?.ProductTypeValue === ProductType.KitMaster) &&
        props.data.price.MinVariantPrice !== undefined &&
        props.data.price.MaxVariantPrice !== undefined
    );
};

/**
 * ShowStrikethroughPricing.
 * @param props - The props.
 * @returns True if showStrikethroughPricing, false otherwise.
 */
const showStrikethroughPricing = (props: IPriceComponentProps): boolean => {
    const originalSalesPrice = getOriginalPrice(props);
    const activeSalesPrice = showPriceRangeForMasterProduct(props)
        ? props.data.price.MinVariantPrice
        : props.data.price.CustomerContextualPrice;

    if (activeSalesPrice && originalSalesPrice) {
        return activeSalesPrice < originalSalesPrice;
    }

    return false;
};

/**
 * Render current price.
 * @param props - The props.
 * @returns The JSX.Element.
 */
const renderCurrentPrice = (props: IPriceComponentProps): JSX.Element => {
    const maxVariantPrice: string = formatCurrency(props, props.data.price.MaxVariantPrice, false, props.currencyCode);
    const minVariantPrice: string = formatCurrency(props, props.data.price.MinVariantPrice, false, props.currencyCode);
    if (
        props.isPriceMinMaxEnabled &&
        props.data.price.MaxVariantPrice &&
        props.data.price.MinVariantPrice &&
        props.data.price.MaxVariantPrice > props.data.price.MinVariantPrice
    ) {
        return (
            <span className='msc-price__pricerange' itemProp='price'>
                <span className='msc-price__minprice' itemProp='price'>
                    {minVariantPrice}
                </span>
                <span className='msc-price__separator' itemProp='price'>
                    {props.priceResources?.priceRangeSeparator}
                </span>
                <span className='msc-price__maxprice' itemProp='price'>
                    {maxVariantPrice}
                </span>
            </span>
        );
    }

    return (
        <span className='msc-price__actual' itemProp='price'>
            {formatCurrency(props, getActivePrice(props), true, props.currencyCode)}
        </span>
    );
};

/**
 * Render active sales price with original sales price.
 * @param props - The props.
 * @returns The JSX.Element.
 */
const renderCurrentPriceWithOriginalPrice = (props: IPriceComponentProps): JSX.Element => {
    const initialPrice: string = formatCurrency(props, getOriginalPrice(props), true);

    return (
        <>
            <span className='sr-only'>
                {` `}
                {props.originalPriceText}
                {` `}
                {initialPrice}
                {` `}
                {props.currentPriceText}
                {` `}
                {renderCurrentPrice(props)}
            </span>
            <span className='msc-price__strikethrough' aria-hidden='true'>
                {initialPrice}
                {` `}
            </span>
            <span aria-hidden='true'>{renderCurrentPrice(props)}</span>
            {props.savingsText && <span className='msc-price__savings'>{props.savingsText}</span>}
        </>
    );
};

const renderSalesAgreementDetail = (props: IPriceComponentProps): JSX.Element => {
    // In most cases there should be only one sales agreement line.
    // If there are more than one, only the first one will be shown.
    const firstPriceLine: SalesAgreementPriceLine = (props.data.price.AttainablePriceLines ?? [])[0] as SalesAgreementPriceLine;
    return (
        <p className={classnames('msc-price__salesagreementdetail', props.className)}>
            <p>
                {/* Available date */}
                {` · ${format(
                    props.priceResources?.salesAgreementExpirationDatePrompt ?? '',
                    props.context.cultureFormatter.formatDate(firstPriceLine.EffectiveDate as Date),
                    props.context.cultureFormatter.formatDate(firstPriceLine.ExpirationDate as Date)
                )}`}
            </p>
            <p>
                {/* Quantity commitment */}
                {` · ${format(props.priceResources?.salesAgreementCommittedQuantityPrompt ?? '', firstPriceLine.CommittedQuantity)}`}
            </p>
            <p>
                {/* Remaining quantity to qualify */}
                {` · ${format(props.priceResources?.salesAgreementRemainingQuantityPrompt ?? '', firstPriceLine.RemainingQuantity)}`}
            </p>
        </p>
    );
};

/**
 * Price.
 * @param props - The props.
 * @returns The JSX.Element.
 */
const Price: React.FC<IPriceComponentProps> = (props: IPriceComponentProps): JSX.Element | null => {
    // CustomerContextualPrice could be zero
    if (props.data.price.CustomerContextualPrice === undefined) {
        return null;
    }

    // Determine if contract price is avaiable/applied by:
    //   isFeatureEnabled and SA price != 0, for PDP.
    //   SA line id != 0, for cart line.
    if (props.isSalesAgreementPriceFeatureEnabled && props.data.price.SalesAgreementPrice !== 0) {
        const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
        const toggle = () => {
            setIsExpanded(!isExpanded);
        };
        return (
            <span className={classnames('msc-price', props.className)}>
                <span className={classnames('msc-price__salesagreementprice', props.className)}>
                    <p className='msc-price__actual' itemProp='price'>
                        {formatCurrency(props, props.data.price.SalesAgreementPrice ?? props.data.price.CustomerContextualPrice, true)}
                    </p>
                    <Button
                        className={isExpanded ? 'msc-price__salesagreementprompt_expanded' : 'msc-price__salesagreementprompt_collapsed'}
                        aria-label={props.priceResources?.salesAgreementPricePrompt}
                        onClick={toggle}
                        aria-expanded={isExpanded}
                        tabIndex={0}
                    >
                        {props.priceResources?.salesAgreementPricePrompt}
                    </Button>
                    {isExpanded && renderSalesAgreementDetail(props)}
                </span>
            </span>
        );
    }

    return (
        <span className={classnames('msc-price', props.className)}>
            {showStrikethroughPricing(props) ? renderCurrentPriceWithOriginalPrice(props) : renderCurrentPrice(props)}
        </span>
    );
};

/**
 * The PriceComponent.
 */
export const PriceComponent: React.FunctionComponent<IPriceComponentProps> = msdyn365Commerce.createComponentOverride<IPriceComponent>('Price', {
    component: Price,
    ...priceComponentActions
});


export default PriceComponent;