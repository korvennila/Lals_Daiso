/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { IProductsDimensionsAvailabilities } from '@msdyn365-commerce/commerce-entities';
import {
    IPriceComponentResources,
    ISwatchItem,
    PriceComponent,
    ProductComponentV2SwatchComponent,
    RatingComponent
} from '@msdyn365-commerce/components';
import {
    getCatalogId,
    IAny,
    IComponent,
    IComponentProps,
    ICoreContext,
    IGeneric,
    IGridSettings,
    IImageData,
    IImageSettings,
    Image,
    msdyn365Commerce
} from '@msdyn365-commerce/core';

import {
    ArrayExtensions,
    convertDimensionTypeToProductDimensionType,
    Dictionary,
    DimensionTypes,
    generateImageUrl,
    getProductPageUrlSync,
    IDimensionsApp,
    StringExtensions,
    validateCatalogId
} from '@msdyn365-commerce-modules/retail-actions';
import {
    format,
    getPayloadObject,
    getTelemetryAttributes,
    ITelemetryContent,
    onTelemetryClick
} from '@msdyn365-commerce-modules/utilities';
import React, { useState } from 'react';

/**
 * AttributeSwatch entity interface.
 */
interface IAttributeSwatch {
    swatchValue?: string;
    swatchImageUrl?: string;
    swatchColorHexCode?: string;
    isDefault?: boolean;
    productImageUrls?: string[];
    extensionProperties?: ICommerceProperty[];
}

/**
 * CommerceProperty entity interface.
 */
interface ICommerceProperty {
    propertyKey?: string;
    value?: IExtensionPropertyValue;
}

/**
 * Extension property value entity interface.
 */
interface IExtensionPropertyValue {
    isBooleanValue?: boolean;
    byteValue?: number;
    dateTimeOffsetValue?: Date;
    decimalValue?: number;
    integerValue?: number;
    longValue?: number;
    stringValue?: string;
}

/**
 * ProductDimension entity interface.
 */
interface IProductDimension {
    dimensionTypeValue: number;
    dimensionValue?: IProductDimensionValue;
    extensionProperties?: ICommerceProperty[];
}

/**
 * ProductDimensionValue entity interface.
 */
interface IProductDimensionValue {
    recordId: number;
    value?: string;
    dimensionId?: string;
    colorHexCode?: string;
    imageUrl?: string;
    refinerGroup?: string;
    extensionProperties?: ICommerceProperty[];
}

/**
 * ProductSearchResult entity interface.
 */
export interface IProductSearchResult {
    itemId?: string;
    name?: string;
    price: number;
    primaryImageUrl?: string;
    recordId: number;
    trackingId?: string;
    averageRating?: number;
    totalRatings?: number;
    description?: string;
    basePrice?: number;
    minVariantPrice?: number;
    maxVariantPrice?: number;
    displayOrder?: number;
    attributeValues?: IAttributeValue[];
    defaultUnitOfMeasure?: string;
    masterProductId?: number;
    extensionProperties?: ICommerceProperty[];
}

/**
 * AttributeValue entity interface.
 */
interface IAttributeValue {
    name?: string;
    keyName?: string;
    unitOfMeasureSymbol?: string;
    dataTypeValue?: number;
    isBooleanValue?: boolean;
    dateTimeOffsetValue?: Date;
    floatValue?: number;
    integerValue?: number;
    textValue?: string;
    currencyValue?: number;
    currencyCode?: string;
    attributeValueId?: number;
    recordId?: number;
    swatches?: IAttributeSwatch[];
    extensionProperties?: ICommerceProperty[];
}

export interface IProductComponentV2Props extends IComponentProps<{ product?: IProductSearchResult }> {
    className?: string;
    imageSettings?: IImageSettings;
    savingsText?: string;
    freePriceText?: string;
    originalPriceText?: string;
    currentPriceText?: string;
    ratingAriaLabel?: string;
    ratingCountAriaLabel?: string;
    allowBack?: boolean;
    telemetryContent?: ITelemetryContent;
    quickViewButton?: React.ReactNode;
    productComparisonButton?: React.ReactNode;
    isEnabledProductDescription?: boolean;
    isPriceMinMaxEnabled?: boolean;
    priceResources?: IPriceComponentResources;
    inventoryLabel?: string;
    dimensionAvailabilities?: IProductsDimensionsAvailabilities[];
    swatchItemAriaLabel?: string;
}

export interface IProductComponentV2 extends IComponent<IProductComponentV2Props> {}

const PriceComponentActions = {};

/**
 * Gets the product page url from the default swatch selected.
 * @param  productData - Product card to be rendered.
 * @returns The default color swatch selected if any.
 */
function getDefaultColorSwatchSelected(productData?: IProductSearchResult): IAttributeSwatch | null {
    if (!productData || !productData.attributeValues) {
        return null;
    }

    const colorAttribute = productData.attributeValues.find(
        attributeValue => attributeValue.keyName?.toLocaleLowerCase() === DimensionTypes.color
    );
    if (!colorAttribute) {
        return null;
    }

    const defaultSwatch = colorAttribute.swatches?.find(item => item.isDefault === true) ?? colorAttribute.swatches?.[0];
    return defaultSwatch ?? null;
}

/**
 * Gets the product image from the default swatch selected.
 * @param  coreContext - Context of the module using the component.
 * @param  productData - Product card to be rendered.
 * @returns The product card image url.
 */
function getProductImageUrlFromDefaultColorSwatch(coreContext: ICoreContext, productData?: IProductSearchResult): string | undefined {
    const siteContext = coreContext as ICoreContext<IDimensionsApp>;
    const dimensionToPreSelectInProductCard = siteContext.app.config.dimensionToPreSelectInProductCard;
    if (dimensionToPreSelectInProductCard === DimensionTypes.none) {
        return productData?.primaryImageUrl;
    }
    const defaultSwatch = getDefaultColorSwatchSelected(productData);
    return defaultSwatch && ArrayExtensions.hasElements(defaultSwatch.productImageUrls)
        ? generateImageUrl(defaultSwatch.productImageUrls[0], coreContext.request.apiSettings)
        : productData?.primaryImageUrl;
}

/**
 * Updates the product url link to product details page.
 * @param  productDetailsPageUrl - Product page url.
 * @param  coreContext - Context of the module using the component.
 * @param  queryString - Querystring to be added to the URL.
 * @returns The update product page url.
 */
function updateProductUrl(productDetailsPageUrl: string, coreContext: ICoreContext, queryString: string): string {
    const sourceUrl = new URL(productDetailsPageUrl, coreContext.request.apiSettings.baseUrl);
    if (sourceUrl.search) {
        sourceUrl.search += `&${queryString}`;
    } else {
        sourceUrl.search += queryString;
    }

    const updatedUrl = new URL(sourceUrl.href);
    return updatedUrl.pathname + sourceUrl.search;
}

/**
 * Gets the react node for product unit of measure display.
 * @param  unitOfMeasure - DefaultUnitOfMeasure property from product.
 * @returns The node representing markup for unit of measure component.
 */
function renderProductUnitOfMeasure(unitOfMeasure?: string): JSX.Element | null {
    if (!unitOfMeasure) {
        return null;
    }
    return (
        <div className='msc-product__unit-of-measure'>
            <span>{unitOfMeasure}</span>
        </div>
    );
}

/**
 * Gets the react node for product availability.
 * @param inventoryAvailabilityLabel - The product information.
 * @returns The node representing markup for product availability.
 */
function renderProductAvailability(inventoryAvailabilityLabel: string | undefined): JSX.Element | null {
    if (!inventoryAvailabilityLabel || inventoryAvailabilityLabel === '') {
        return null;
    }

    return (
        <div className='msc-product__availability'>
            <span>{inventoryAvailabilityLabel}</span>
        </div>
    );
}

/**
 * Renders product comparison button similar to the quick view button.
 * @param productComparisonButton - React element of the button.
 * @param product - Current product info.
 * @param catalogId - Current catalog.
 * @returns React element for the specific product.
 */
function renderProductComparisonButton(
    productComparisonButton: React.ReactNode,
    product: IProductSearchResult,
    catalogId: number
): JSX.Element | undefined {
    validateCatalogId(catalogId);
    return React.cloneElement(productComparisonButton as React.ReactElement, { product, catalogId });
}

/**
 * Gets the product page url from the default swatch selected.
 * @param  coreContext - Context of the module using the component.
 * @param productUrl - Product page url for the product card.
 * @param  productData - Product card to be rendered.
 * @returns The product card image url.
 */
function getProductPageUrlFromDefaultSwatch(
    coreContext: ICoreContext,
    productUrl: string,
    productData?: IProductSearchResult
): string | undefined {
    const siteContext = coreContext as ICoreContext<IDimensionsApp>;
    const dimensionToPreSelectInProductCard = siteContext.app.config.dimensionToPreSelectInProductCard;
    if (dimensionToPreSelectInProductCard === DimensionTypes.none) {
        return productUrl;
    }

    const defaultSwatch = getDefaultColorSwatchSelected(productData);
    if (!defaultSwatch || !defaultSwatch.swatchValue) {
        return productUrl;
    }

    const queryString = `color=${defaultSwatch.swatchValue}`;
    return updateProductUrl(productUrl, coreContext, queryString);
}

const ProductCardV2: React.FC<IProductComponentV2Props> = ({
    data,
    context,
    imageSettings,
    savingsText,
    freePriceText,
    originalPriceText,
    currentPriceText,
    ratingAriaLabel,
    ratingCountAriaLabel,
    allowBack,
    typeName,
    id,
    telemetryContent,
    quickViewButton,
    productComparisonButton,
    isEnabledProductDescription,
    isPriceMinMaxEnabled,
    priceResources,
    inventoryLabel,
    dimensionAvailabilities,
    swatchItemAriaLabel
}) => {
    const product = data.product;

    let productUrl = getProductPageUrlSync(product?.name ?? '', product?.recordId ?? Number.MIN_VALUE, context.actionContext, undefined);
    if (allowBack) {
        productUrl = updateProductUrl(productUrl, context, 'back=true');
    }
    const productImageUrlFromSwatch = getProductImageUrlFromDefaultColorSwatch(context, product) ?? product?.primaryImageUrl;
    const productPageUrlFromSwatch = getProductPageUrlFromDefaultSwatch(context, productUrl, product) ?? productUrl;
    const [productPageUrl, setProductPageUrl] = useState<string>(productPageUrlFromSwatch);
    const [productImageUrl, setProductImageUrl] = useState<string | undefined>(productImageUrlFromSwatch);
    React.useEffect(() => {
        setProductPageUrl(productPageUrlFromSwatch);
        setProductImageUrl(productImageUrlFromSwatch);
    }, [productUrl, productPageUrlFromSwatch, productImageUrlFromSwatch]);
    const [selectedSwatchItems] = useState(new Dictionary<DimensionTypes, ISwatchItem>());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access -- app context is generic
    const enableStockCheck = context.app.config.enableStockCheck;

    /**
     * Updates the product page and Image url based on swatch selected.
     * @param coreContext - Context of the caller.
     * @param swatchItem - Dimension swatch selected.
     */
    const updatePageAndImageUrl = React.useCallback(
        (coreContext: ICoreContext, swatchItem: ISwatchItem) => {
            const dimensionType = swatchItem.dimensionType;
            selectedSwatchItems.setValue(dimensionType, swatchItem);
            if (StringExtensions.isNullOrWhitespace(swatchItem.value)) {
                return;
            }
            const queryString = `${dimensionType}=${swatchItem.value}`;
            let productPageUrlWithSwatch = '';
            if (productPageUrl.includes(dimensionType)) {
                const newUrl = new URL(productPageUrl, coreContext.request.apiSettings.baseUrl);
                newUrl.searchParams.delete(dimensionType);
                productPageUrlWithSwatch = updateProductUrl(newUrl.toString(), context, queryString);
            } else {
                productPageUrlWithSwatch = updateProductUrl(productPageUrl, context, queryString);
            }
            setProductPageUrl(productPageUrlWithSwatch);
            if (dimensionType === DimensionTypes.color) {
                const swatchProductImageUrl = ArrayExtensions.hasElements(swatchItem.productImageUrls)
                    ? swatchItem.productImageUrls[0]
                    : undefined;
                const newImageUrl = generateImageUrl(swatchProductImageUrl, coreContext.request.apiSettings);
                setProductImageUrl(newImageUrl);
            }
        },
        [selectedSwatchItems, context, productPageUrl]
    );

    if (!product) {
        return null;
    }

    /**
     * Checks if rendering the particular dimensions is allowed for product card.
     * @param dimensionType - Dimension to be displayed.
     * @returns Updates the state with new product page url.
     */
    function shouldDisplayDimension(dimensionType: string): boolean {
        const dimensionsContext = context as ICoreContext<IDimensionsApp>;
        const dimensionsToDisplayOnProductCard = dimensionsContext.app.config.dimensionsInProductCard;
        return (
            ArrayExtensions.hasElements(dimensionsToDisplayOnProductCard) &&
            !dimensionsToDisplayOnProductCard.includes(DimensionTypes.none) &&
            dimensionsToDisplayOnProductCard.includes(dimensionType.toLocaleLowerCase() as DimensionTypes)
        );
    }

    /**
     * Gets the react node for product dimension as swatch.
     * @param  attributeValues - Attribute value property from product.
     * @returns The node representing markup for unit of measure component.
     */
    function renderProductDimensions(attributeValues?: IAttributeValue[]): JSX.Element | null {
        if (!attributeValues) {
            return null;
        }

        return (
            <div className='msc-product__dimensions'>
                {attributeValues.map((item: IAttributeValue) => {
                    const dimensionTypeValue = item.keyName?.toLocaleLowerCase() ?? '';
                    if (!shouldDisplayDimension(dimensionTypeValue)) {
                        return null;
                    }

                    const siteContext = context as ICoreContext<IDimensionsApp>;
                    const dimensionToPreSelectInProductCard = siteContext.app.config.dimensionToPreSelectInProductCard;
                    const dimensionType = dimensionTypeValue as DimensionTypes;
                    const swatches =
                        item.swatches?.map<ISwatchItem>(swatchItem => {
                            return {
                                itemId: `${item.recordId ?? ''}-${dimensionTypeValue}-${swatchItem.swatchValue ?? ''}`,
                                value: swatchItem.swatchValue ?? '',
                                dimensionType,
                                colorHexCode: swatchItem.swatchColorHexCode,
                                imageUrl: swatchItem.swatchImageUrl,
                                productImageUrls: swatchItem.productImageUrls,
                                isDefault: swatchItem.isDefault,
                                swatchItemAriaLabel: swatchItemAriaLabel ? format(swatchItemAriaLabel, dimensionType) : '',
                                isDisabled:
                                    enableStockCheck &&
                                    dimensionAvailabilities?.find(
                                        dimensionAvailability => dimensionAvailability.value === (swatchItem.swatchValue ?? '')
                                    )?.isDisabled
                            };
                        }) ?? [];
                    if (
                        dimensionToPreSelectInProductCard !== DimensionTypes.none &&
                        ArrayExtensions.hasElements(swatches) &&
                        !swatches.some(swatch => swatch.isDefault) &&
                        dimensionType === DimensionTypes.color
                    ) {
                        swatches[0].isDefault = true;
                    }
                    return (
                        <ProductComponentV2SwatchComponent
                            context={context}
                            swatches={swatches}
                            onSelectDimension={updatePageAndImageUrl}
                            key={item.recordId}
                        />
                    );
                })}
            </div>
        );
    }

    function renderQuickView(quickview: React.ReactNode, item?: number): JSX.Element | undefined {
        if (quickview === null) {
            return undefined;
        }
        const selectedDimensions: IProductDimension[] = selectedSwatchItems.getValues().map<IProductDimension>(swatches => {
            return {
                dimensionTypeValue: convertDimensionTypeToProductDimensionType(swatches.dimensionType),
                dimensionValue: {
                    recordId: 0,
                    Value: swatches.value
                }
            };
        });
        return React.cloneElement(quickview as React.ReactElement, { selectedProductId: item, selectedDimensions });
    }

    // Construct telemetry attribute to render
    const payLoad = getPayloadObject('click', telemetryContent!, '', product.recordId.toString());

    const attribute = getTelemetryAttributes(telemetryContent!, payLoad);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- -- Do not need type check for appsettings
    const isUnitOfMeasureEnabled = context.app.config && context.app.config.unitOfMeasureDisplayType === 'buyboxAndBrowse';

    return (
        <>
            {isEnabledProductDescription ? (
                <a
                    href={productPageUrl}
                    onClick={onTelemetryClick(telemetryContent!, payLoad, product.name!)}
                    aria-label={renderLabel(
                        product.name,
                        context.cultureFormatter.formatCurrency(product.price),
                        product.averageRating,
                        ratingAriaLabel,
                        product.totalRatings,
                        ratingCountAriaLabel
                    )}
                    className='msc-product'
                    {...attribute}
                >
                    <div className='msc-product__image__description'>
                        <div className='msc-product__image'>
                            {renderProductPlacementImage(
                                imageSettings,
                                context.request.gridSettings,
                                productImageUrl,
                                product.primaryImageUrl,
                                product.name,
                                context
                            )}
                        </div>
                        <div className='msc-product__title_description'>
                            <h5 className='msc-product__title__text'>{product.name}</h5>
                            {renderPrice(
                                context,
                                typeName,
                                id,
                                product.basePrice,
                                product.price,
                                savingsText,
                                freePriceText,
                                originalPriceText,
                                currentPriceText,
                                isPriceMinMaxEnabled,
                                priceResources
                            )}
                            {isUnitOfMeasureEnabled && renderProductUnitOfMeasure(product.defaultUnitOfMeasure)}
                            {renderDescription(product.description)}
                        </div>
                    </div>
                </a>
            ) : (
                <a
                    href={productPageUrl}
                    onClick={onTelemetryClick(telemetryContent!, payLoad, product.name!)}
                    aria-label={renderLabel(
                        product.name,
                        context.cultureFormatter.formatCurrency(product.price),
                        product.averageRating,
                        ratingAriaLabel
                    )}
                    className='msc-product'
                    {...attribute}
                >
                    <div className='msc-product__image'>
                        {renderProductPlacementImage(
                            imageSettings,
                            context.request.gridSettings,
                            productImageUrl,
                            product.primaryImageUrl,
                            product.name,
                            context
                        )}
                    </div>
                    <div className='msc-product__details'>
                        <h5 className='msc-product__title'>{product.name}</h5>
                        {renderPrice(
                            context,
                            typeName,
                            id,
                            product.basePrice,
                            product.price,
                            savingsText,
                            freePriceText,
                            originalPriceText,
                            currentPriceText
                        )}
                        {isUnitOfMeasureEnabled && renderProductUnitOfMeasure(product.defaultUnitOfMeasure)}
                    </div>
                </a>
            )}
            {renderProductDimensions(product.attributeValues)}
            {!context.app.config.hideRating &&
                renderRating(context, typeName, id, product.averageRating, product.totalRatings, ratingAriaLabel, ratingCountAriaLabel)}
            {renderProductAvailability(inventoryLabel)}
            {quickViewButton && renderQuickView(quickViewButton, product.recordId)}
            {productComparisonButton && renderProductComparisonButton(productComparisonButton, product, getCatalogId(context.request))}
        </>
    );
};

function renderLabel(
    name?: string,
    price?: string,
    rating?: number,
    ratingAriaLabelText?: string,
    reviewCount?: number,
    ratingCountAriaLabelText?: string
): string {
    const reviewCountArialableText = getReviewAriaLabel(reviewCount, ratingCountAriaLabelText ?? '');
    return `${name ?? ''} ${price ?? ''} ${getRatingAriaLabel(rating, ratingAriaLabelText)}${
        reviewCountArialableText ? ` ${reviewCountArialableText}` : ''
    }`;
}

function renderDescription(description?: string): JSX.Element | null {
    return <p className='msc-product__text'>{description}</p>;
}

function getRatingAriaLabel(rating?: number, ratingAriaLabel?: string): string {
    if (rating && ratingAriaLabel) {
        const roundedRating = rating.toFixed(2);
        return format(ratingAriaLabel || '', roundedRating, '5');
    }
    return '';
}

function getReviewAriaLabel(reviewCount?: number, ratingCountAriaLabelText?: string): string {
    if (reviewCount && ratingCountAriaLabelText) {
        return format(ratingCountAriaLabelText || '', reviewCount);
    }
    return '';
}

function renderRating(
    coreContext: ICoreContext,
    moduleTypeName: string,
    moduleId: string,
    avgRating?: number,
    totalRatings?: number,
    ariaLabel?: string,
    ratingCountAriaLabel?: string
): JSX.Element | null {
    if (!avgRating) {
        return null;
    }

    const numberRatings = totalRatings?.toString() || undefined;
    const ratingAriaLabelText = getRatingAriaLabel(avgRating, ariaLabel);
    const ratingCountAriaLabelText = getReviewAriaLabel(Number(numberRatings), ratingCountAriaLabel);

    return (
        <RatingComponent
            context={coreContext}
            id={moduleId}
            typeName={moduleTypeName}
            avgRating={avgRating}
            ratingCount={numberRatings}
            readOnly
            ariaLabel={ratingAriaLabelText}
            ratingCountAriaLabel={ratingCountAriaLabelText}
            data={{}}
        />
    );
}

function renderPrice(
    context: ICoreContext,
    typeName: string,
    id: string,
    basePrice?: number,
    adjustedPrice?: number,
    savingsText?: string,
    freePriceText?: string,
    originalPriceText?: string,
    currentPriceText?: string,
    isPriceMinMaxEnabled?: boolean,
    priceResources?: IPriceComponentResources
): JSX.Element | null {
    const price = {
        BasePrice: basePrice,
        AdjustedPrice: adjustedPrice,
        CustomerContextualPrice: adjustedPrice
    };

    return (
        <PriceComponent
            context={context}
            id={id}
            typeName={typeName}
            data={{ price }}
            savingsText={savingsText}
            freePriceText={freePriceText}
            originalPriceText={originalPriceText}
            isPriceMinMaxEnabled={isPriceMinMaxEnabled}
            priceResources={priceResources}
        />
    );
}

function renderProductPlacementImage(
    imageSettings?: IImageSettings,
    gridSettings?: IGridSettings,
    imageUrl?: string,
    fallbackImageUrl?: string,
    altText?: string,
    context?: ICoreContext<IGeneric<IAny>>
): JSX.Element | null {
    if (!imageUrl || !gridSettings || !imageSettings) {
        return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment -- Site level config can be of any type.
    const contextConfig = context?.app.config?.placeholderImageName;
    const emptyPlaceHolderImage = contextConfig as string;
    let fallbackImageSource = fallbackImageUrl;
    if (emptyPlaceHolderImage && fallbackImageUrl) {
        fallbackImageSource = `${fallbackImageUrl},${emptyPlaceHolderImage}`;
    }
    const img: IImageData = {
        src: imageUrl,
        altText: altText ? altText : '',
        fallBackSrc: fallbackImageSource
    };
    const imageProps = {
        gridSettings,
        imageSettings
    };
    imageProps.imageSettings.cropFocalRegion = true;
    return (
        <Image
            requestContext={context?.actionContext.requestContext}
            {...img}
            {...imageProps}
            loadFailureBehavior='empty'
            bypassHideOnFailure
        />
    );
}

export const ProductComponentV2: React.FunctionComponent<IProductComponentV2Props> = msdyn365Commerce.createComponentOverride<
    IProductComponentV2
>('ProductV2', { component: ProductCardV2, ...PriceComponentActions });

export default ProductComponentV2;
