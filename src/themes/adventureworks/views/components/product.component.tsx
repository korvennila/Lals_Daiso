/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { IProductsDimensionsAvailabilities } from '@msdyn365-commerce/commerce-entities';
import {
    IPriceComponentResources,
    ISwatchItem,
    PriceComponent,
    ProductComponentSwatchComponent,
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
import { AttributeSwatch, AttributeValue, ProductDimension, ProductPrice, ProductSearchResult } from '@msdyn365-commerce/retail-proxy';
import {
    ArrayExtensions,
    convertDimensionTypeToProductDimensionType,
    Dictionary,
    DimensionTypes,
    generateImageUrl,
    getProductPageUrlSync,
    IDimensionsApp,
    StringExtensions,
    validateCatalogId,
    getSelectedVariant,
    SelectedVariantInput,
    ISelectedProduct
} from '@msdyn365-commerce-modules/retail-actions';
import {
    format,
    getPayloadObject,
    getTelemetryAttributes,
    ITelemetryContent,
    onTelemetryClick
} from '@msdyn365-commerce-modules/utilities';
import React, { useState } from 'react';
import { getCartState } from '@msdyn365-commerce/global-state';
import { addCartLinesAsync } from '@msdyn365-commerce/retail-proxy/dist/DataActions/CartsDataActions.g';
import { createInventoryAvailabilitySearchCriteria } from '@msdyn365-commerce-modules/retail-actions';
import {
    getEstimatedAvailabilityAsync,
    getDimensionValuesWithEstimatedAvailabilitiesAsync
} from '@msdyn365-commerce/retail-proxy/dist/DataActions/ProductsDataActions.g';
import CustomPopup from './custom-popup';

export interface IProductComponentProps extends IComponentProps<{ product?: ProductSearchResult }> {
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

export interface IProductComponent extends IComponent<IProductComponentProps> {}

const PriceComponentActions = {};

/**
 * Gets the product page url from the default swatch selected.
 * @param  productData - Product card to be rendered.
 * @returns The default color swatch selected if any.
 */
function getDefaultSwatchSelected(coreContext: ICoreContext, productData?: ProductSearchResult): AttributeSwatch | null {
    if (!productData || !productData.AttributeValues) {
        return null;
    }

    const siteContext = coreContext as ICoreContext<IDimensionsApp>;
    const dimensionToPreSelectInProductCard = siteContext.app.config.dimensionToPreSelectInProductCard;

    const attributeSwatches = productData.AttributeValues.find(
        attributeValue => attributeValue.KeyName?.toLocaleLowerCase() === dimensionToPreSelectInProductCard
    )?.Swatches;

    if (!ArrayExtensions.hasElements(attributeSwatches)) {
        return null;
    }

    const defaultSwatch = attributeSwatches.find(item => item.IsDefault === true) ?? attributeSwatches[0];
    return defaultSwatch;
}

/**
 * Gets the product image from the default swatch selected.
 * @param  coreContext - Context of the module using the component.
 * @param  productData - Product card to be rendered.
 * @returns The product card image url.
 */
function getProductImageUrlFromDefaultSwatch(coreContext: ICoreContext, productData?: ProductSearchResult): string | undefined {
    const defaultSwatch = getDefaultSwatchSelected(coreContext, productData);
    const swatchProductImageUrls = defaultSwatch?.ProductImageUrls;
    if (!ArrayExtensions.hasElements(swatchProductImageUrls)) {
        return productData?.PrimaryImageUrl;
    }

    return generateImageUrl(swatchProductImageUrls[0], coreContext.request.apiSettings);
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
    product: ProductSearchResult,
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
    productData?: ProductSearchResult
): string | undefined {
    const defaultSwatch = getDefaultSwatchSelected(coreContext, productData);
    if (!defaultSwatch?.SwatchValue) {
        return productUrl;
    }

    const siteContext = coreContext as ICoreContext<IDimensionsApp>;
    const dimensionToPreSelectInProductCard = siteContext.app.config.dimensionToPreSelectInProductCard;

    const queryStringEncoded = encodeURIComponent(defaultSwatch.SwatchValue);
    const queryString = `${dimensionToPreSelectInProductCard}=${queryStringEncoded}`;
    return updateProductUrl(productUrl, coreContext, queryString);
}

const capitalizeWords = (string: string | undefined): string => {
    if (!string) {
        return '';
    }

    const finalString = string
        .toLowerCase()
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    return finalString;
};

const ProductCard: React.FC<IProductComponentProps> = ({
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

    let productUrl = getProductPageUrlSync(product?.Name ?? '', product?.RecordId ?? Number.MIN_VALUE, context.actionContext, undefined);
    if (allowBack) {
        productUrl = updateProductUrl(productUrl, context, 'back=true');
    }
    const productImageUrlFromSwatch = getProductImageUrlFromDefaultSwatch(context, product) ?? product?.PrimaryImageUrl;
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

    const siteContext = context as ICoreContext<IDimensionsApp>;
    const dimensionToPreSelectInProductCard = siteContext.app.config.dimensionToPreSelectInProductCard;
    const [addToBagLoading, setAddToBagLoading] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false); // State to control popup visibility
    const [popupMessage, setPopupMessage] = useState(''); // Message to display in the popup

    // const [prodAvailRecordId, setProdAvailRecordId] = useState<number | undefined>();
    // const [prodAvailDimension, setProdAvailDimension] = useState(false);

    const [, setProdAvailRecordId] = useState<number | undefined>();
    const [, setProdAvailDimension] = useState(false);

    // Function to show the popup with a custom message and auto-close after 5 seconds
    const showPopup = (message: string) => {
        setPopupMessage(message);
        setIsPopupVisible(true);

        // Auto-close the popup after 5 seconds
        setTimeout(() => {
            setIsPopupVisible(false);
        }, 2000);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
    };

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
            if (dimensionType === dimensionToPreSelectInProductCard) {
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
    function renderProductDimensions(attributeValues?: AttributeValue[]): JSX.Element | null {
        if (!attributeValues) {
            return null;
        }

        return (
            <div className='msc-product__dimensions'>
                {attributeValues.map((item: AttributeValue) => {
                    const dimensionTypeValue = item.KeyName?.toLocaleLowerCase() ?? '';
                    if (!shouldDisplayDimension(dimensionTypeValue)) {
                        return null;
                    }

                    const siteContext = context as ICoreContext<IDimensionsApp>;
                    const dimensionToPreSelectInProductCard = siteContext.app.config.dimensionToPreSelectInProductCard;
                    const dimensionType = dimensionTypeValue as DimensionTypes;

                    const swatches =
                        item.Swatches?.map<ISwatchItem>(swatchItem => {
                            return {
                                itemId: `${item.RecordId ?? ''}-${dimensionTypeValue}-${swatchItem.SwatchValue ?? ''}`,
                                value: swatchItem.SwatchValue ?? '',
                                dimensionType,
                                colorHexCode: swatchItem.SwatchColorHexCode,
                                imageUrl: swatchItem.SwatchImageUrl,
                                productImageUrls: swatchItem.ProductImageUrls,
                                isDefault: swatchItem.IsDefault,
                                swatchItemAriaLabel: swatchItemAriaLabel ? format(swatchItemAriaLabel, dimensionType) : '',
                                isDisabled:
                                    enableStockCheck &&
                                    dimensionAvailabilities?.find(
                                        dimensionAvailability => dimensionAvailability.value === (swatchItem.SwatchValue ?? '')
                                    )?.isDisabled
                            };
                        }) ?? [];
                    if (
                        dimensionType === dimensionToPreSelectInProductCard &&
                        ArrayExtensions.hasElements(swatches) &&
                        !swatches.some(swatch => swatch.isDefault)
                    ) {
                        swatches[0].isDefault = true;
                    }
                    return (
                        <ProductComponentSwatchComponent
                            context={context}
                            swatches={swatches}
                            onSelectDimension={updatePageAndImageUrl}
                            key={item.RecordId}
                        />
                    );
                })}
            </div>
        );
    }

    function hasProductSwatches(attributeValues?: AttributeValue[]): boolean {
        if (!attributeValues || attributeValues.length === 0) {
            return false;
        }

        return attributeValues.some(
            item => shouldDisplayDimension(item.KeyName?.toLowerCase() ?? '') && item.Swatches && item.Swatches?.length > 0
        );
    }

    function renderQuickView(quickview: React.ReactNode, item?: number): JSX.Element | undefined {
        if (quickview === null) {
            return undefined;
        }
        const selectedDimensions: ProductDimension[] = selectedSwatchItems.getValues().map<ProductDimension>(swatches => {
            return {
                DimensionTypeValue: convertDimensionTypeToProductDimensionType(swatches.dimensionType),
                DimensionValue: {
                    RecordId: 0,
                    Value: swatches.value
                }
            };
        });
        return React.cloneElement(quickview as React.ReactElement, { selectedProductId: item, selectedDimensions });
    }

    async function _updateDimensionsNewProduct() {
        const selectedDimensions: ProductDimension[] = selectedSwatchItems.getValues().map<ProductDimension>(swatches => {
            return {
                DimensionTypeValue: convertDimensionTypeToProductDimensionType(swatches.dimensionType),
                DimensionValue: {
                    RecordId: 0,
                    Value: swatches.value
                }
            };
        });

        if (product) {
            const selectedProduct = new Promise<ISelectedProduct | null>(async resolve => {
                const newProduct = await getSelectedVariant(
                    new SelectedVariantInput(
                        product.MasterProductId ? product.MasterProductId : product.RecordId,
                        context.request.apiSettings.channelId,
                        selectedDimensions,
                        undefined,
                        context.request
                    ),
                    context.actionContext
                );

                resolve(newProduct);
            });
            const variantProduct = await selectedProduct;
            console.log('variantProduct--->', variantProduct);
        }
    }

    /** StockAvailability */
    const [stockAvailability, setStockAvailability] = useState<boolean>(true);
    // const [, setStockAvailability] = useState<boolean>(true);

    async function getStockAvailability(item: ProductSearchResult) {
        const searchCriteria = createInventoryAvailabilitySearchCriteria(context && context.actionContext, [item.RecordId], true);

        const productAvailabilites = await getEstimatedAvailabilityAsync(
            { callerContext: context && context.actionContext },
            searchCriteria
        );

        if (
            productAvailabilites?.AggregatedProductInventoryAvailabilities &&
            productAvailabilites.AggregatedProductInventoryAvailabilities?.length > 0
        ) {
            if (
                productAvailabilites.AggregatedProductInventoryAvailabilities[0].PhysicalAvailableInventoryLevelCode === 'AVAIL' &&
                productAvailabilites.AggregatedProductInventoryAvailabilities[0].TotalAvailableQuantity! > 0
            ) {
                setStockAvailability(true);
            } else {
                setStockAvailability(false);
            }
        } else {
            setStockAvailability(false);
        }
    }

    async function getDimensionValuesWithEstimatedAvailabilities(item: ProductSearchResult) {
        const cCatalogId = getCatalogId(context.request);
        const productDimensions = await getDimensionValuesWithEstimatedAvailabilitiesAsync(
            { callerContext: context && context.actionContext },
            item.RecordId,
            {
                CatalogId: cCatalogId,
                DefaultWarehouseOnly: true,
                InventoryAccuracyValue: 1,
                RequestedDimensionTypeValues: [1, 2, 3, 4]
            }
        );

        const availableItem = productDimensions.find(item => item.TotalAvailableInventoryLevelCode === 'AVAIL');

        // If such an item exists, set the first ProductId to state
        if (availableItem) {
            if (availableItem.ProductIds && availableItem.ProductIds.length > 0) {
                setProdAvailRecordId(availableItem.ProductIds[0]);
                setProdAvailDimension(true);
            }
        }
    }

    async function productAddToCart(product: ProductSearchResult) {
        setAddToBagLoading(true);
        const currentCartState = await getCartState(context?.actionContext);
        // let productRecordId = prodAvailDimension ? prodAvailRecordId : product.RecordId;

        const cartLines = [
            {
                ItemId: product.ItemId,
                // ProductId: productRecordId,
                ProductId: product.RecordId,
                Quantity: 1,
                TrackingId: ''
                // 'AttributeValues@odata.type': '#Collection(Microsoft.Dynamics.Commerce.Runtime.DataModel.AttributeValueBase)',
                // AttributeValues: [
                //     {
                //         '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.AttributeTextValue',
                //         Name: 'Subscription Order',
                //         TextValue: 'Yes'
                //     },
                //     {
                //         '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.AttributeTextValue',
                //         Name: 'Subscription Frequency',
                //         TextValue: '2-WEEK'
                //     }
                // ]
            }
        ];

        try {
            return addCartLinesAsync(
                { callerContext: context.actionContext },
                currentCartState.cart.Id,
                cartLines,
                currentCartState.cart.Version!
            )
                .then(async result => {
                    console.log('cart response--->', result);
                    showPopup('Product has been added to the cart successfully!');
                    await currentCartState.refreshCart({});
                })
                .catch(() => {
                    // Default error message
                    let errorMessage = 'Unable to add the product to the cart.';
                    showPopup(errorMessage);
                });
        } catch (err) {
            console.log(err);
            showPopup('Failed to add the product to the cart.');
        } finally {
            setAddToBagLoading(false);
        }
    }

    React.useEffect(() => {
        getStockAvailability(product);
        getDimensionValuesWithEstimatedAvailabilities(product);
        _updateDimensionsNewProduct();
    }, []);

    React.useEffect(() => {
        _updateDimensionsNewProduct();
    }, [selectedSwatchItems]);

    // Construct telemetry attribute to render
    const payLoad = getPayloadObject('click', telemetryContent!, '', product.RecordId.toString());

    const attribute = getTelemetryAttributes(telemetryContent!, payLoad);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- -- Do not need type check for appsettings
    const isUnitOfMeasureEnabled = context.app.config && context.app.config.unitOfMeasureDisplayType === 'buyboxAndBrowse';

    const hasSwatches = hasProductSwatches(product.AttributeValues);

    return (
        <>
            {isEnabledProductDescription ? (
                <a
                    href={productPageUrl}
                    onClick={onTelemetryClick(telemetryContent!, payLoad, product.Name!)}
                    aria-label={renderLabel(
                        product.Name,
                        context.cultureFormatter.formatCurrency(product.Price),
                        product.AverageRating,
                        ratingAriaLabel,
                        product.TotalRatings,
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
                                product.PrimaryImageUrl,
                                product.Name,
                                context
                            )}
                        </div>
                        <div className='msc-product__title_description'>
                            <h5 className='msc-product__title__text' title={product.Name}>
                                {product.Name}
                            </h5>

                            {isUnitOfMeasureEnabled && renderProductUnitOfMeasure(product.DefaultUnitOfMeasure)}
                            {renderDescription(product.Description)}
                        </div>
                    </div>
                </a>
            ) : (
                <a
                    href={productPageUrl}
                    onClick={onTelemetryClick(telemetryContent!, payLoad, product.Name!)}
                    aria-label={renderLabel(
                        product.Name,
                        context.cultureFormatter.formatCurrency(product.Price),
                        product.AverageRating,
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
                            product.PrimaryImageUrl,
                            product.Name,
                            context
                        )}
                    </div>
                    <div className='msc-product__details'>
                        <h5 className='msc-product__title' title={capitalizeWords(product.Name)}>
                            {capitalizeWords(product.Name)}
                        </h5>
                        {isUnitOfMeasureEnabled && renderProductUnitOfMeasure(product.DefaultUnitOfMeasure)}
                    </div>
                </a>
            )}
            <div className='msc-product__price-conatiner'>
                {renderPrice(
                    context,
                    typeName,
                    id,
                    product.BasePrice,
                    product.Price,
                    savingsText,
                    freePriceText,
                    originalPriceText,
                    currentPriceText,
                    isPriceMinMaxEnabled,
                    priceResources
                )}
                <div>
                    {hasSwatches ? (
                        <div className='ms-addToBag'>
                            <a
                                href={productPageUrl}
                                onClick={onTelemetryClick(telemetryContent!, payLoad, product.Name!)}
                                aria-label={renderLabel(
                                    product.Name,
                                    context.cultureFormatter.formatCurrency(product.Price),
                                    product.AverageRating,
                                    ratingAriaLabel,
                                    product.TotalRatings,
                                    ratingCountAriaLabel
                                )}
                                className='msc-product'
                                {...attribute}
                            >
                                <button className='ms-selectVarient__button' title='Select Variant'>
                                    Select Variant
                                </button>
                            </a>
                        </div>
                    ) : enableStockCheck && stockAvailability ? (
                        <div className='ms-addToBag'>
                            <button
                                className={`ms-addToBag__button ${addToBagLoading ? 'add-to-bag-loading' : ''} `}
                                title='ADD TO BAG'
                                onClick={() => productAddToCart(product)}
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <div className='ms-soldOut'>
                            <button className='ms-soldOut__button' title='SOLD OUT'>
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Custom Popup */}
            <CustomPopup message={popupMessage} isVisible={isPopupVisible} onClose={closePopup} />
            {renderProductDimensions(product.AttributeValues)}
            {!context.app.config.hideRating &&
                renderRating(context, typeName, id, product.AverageRating, product.TotalRatings, ratingAriaLabel, ratingCountAriaLabel)}
            {renderProductAvailability(inventoryLabel)}
            {quickViewButton && renderQuickView(quickViewButton, product.RecordId)}
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
    const price: ProductPrice = {
        BasePrice: basePrice,
        AdjustedPrice: basePrice,
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

export const ProductComponent: React.FunctionComponent<IProductComponentProps> = msdyn365Commerce.createComponentOverride<
    IProductComponent
>('Product', { component: ProductCard, ...PriceComponentActions });

export default ProductComponent;
