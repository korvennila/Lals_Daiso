/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { IComponent, IComponentProps, msdyn365Commerce } from '@msdyn365-commerce/core';
import { AsyncResult, CartLine, CommerceList, Customer, ProductDimension, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import {
    addLinesAsync,
    createCommerceListAsync,
    createGetByCustomerInput,
    removeLinesAsync
} from '@msdyn365-commerce/retail-proxy/dist/DataActions/CommerceListsDataActions.g';
import { buildWishlistLine, getCustomer, GetCustomerInput } from '@msdyn365-commerce-modules/retail-actions';
import { Alert, UncontrolledTooltip } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import * as Popper from 'popper.js';
import React, { useState } from 'react';

export interface IAddToWishlistComponentProps extends IComponentProps<IAddtoWishlistData> {
    className?: string;
    addToWishlistButtonText: string;
    removeFromWishlistButtonText: string;
    nameOfWishlist: string;

    addToWishlistMessage?: string;
    removedFromWishlistMessage?: string;
    addItemToWishlistError?: string;
    removeItemFromWishlistError?: string;

    showButtonText?: boolean;
    showButtonTooltip?: boolean;
    tooltipPosition?: Popper.Placement;
    showStatusMessage?: boolean;
    showRemoveButton?: boolean;
    disabled?: boolean;
    cartline?: CartLine;
    canAddMasterProduct?: boolean;
    ariaRole?: string;

    getSelectedProduct?: Promise<SimpleProduct | null>;

    onSuccess?(result: IWishlistActionSuccessResult, cartline?: CartLine): void;
    onError?(result: IWishlistActionErrorResult): void;
}

export interface IWishlistActionSuccessResult {
    status: 'ADDED' | 'REMOVED';
}

export interface IWishlistActionErrorResult {
    status: 'FAILED' | 'MISSINGDIMENSION';

    missingDimensions?: ProductDimension[];
}

interface IAddToWishlistStateManager {
    waiting: boolean;
    canRemove: boolean;
    content: IAddtoWishlistContentState;

    setWaiting(newWaiting: boolean): void;
    setContent(newContent: IAddtoWishlistContentState): void;
    setCanRemove(newCanRemove: boolean): void;
}

interface IAddtoWishlistContentState {
    showAlert?: boolean;
    wishlistTextMessage?: string;
    color?: string;
}

interface IAddtoWishlistData {
    wishlists?: CommerceList[];
    product: SimpleProduct;
}

export interface IAddtoWishlistComponent extends IComponent<IAddToWishlistComponentProps> {
    onClick(): (event: React.MouseEvent<HTMLElement>, props: IAddToWishlistComponentProps, state: IAddToWishlistStateManager) => void;
}

const onClick = async (
    _event: React.MouseEvent<HTMLElement>,
    props: IAddToWishlistComponentProps,
    state: IAddToWishlistStateManager
): Promise<void> => {
    const { user } = props.context.request;
    let { product } = props.data;

    if (state.waiting) {
        return;
    }

    if (!user.isAuthenticated && user.signInUrl && window) {
        window.location.assign(user.signInUrl);

        return;
    }

    state.setWaiting(true);
    if (!(props.getSelectedProduct === undefined)) {
        product = (await props.getSelectedProduct) || props.data.product;
    }

    await (doesProductExistInWishlist(product, props) ? removeFromWishlist(product, props, state) : addToWishlist(product, props, state));
    state.setWaiting(false);
};

const onDismiss = (state: IAddToWishlistStateManager): void => {
    state.setContent({ color: 'success', showAlert: false });
};

const AddToWishlistComponentActions = {
    onClick,
    onDismiss
};

const AddToWishlist: React.FC<IAddToWishlistComponentProps> = (props: IAddToWishlistComponentProps) => {
    const [waiting, setWaiting] = useState(false);
    const [canRemove, setCanRemove] = useState(doesProductExistInWishlist(props.data.product, props));
    const [content, setContent] = useState({});
    const state: IAddToWishlistStateManager = {
        waiting,
        canRemove,
        content,

        setWaiting,
        setCanRemove,
        setContent
    };

    React.useEffect(() => {
        setCanRemove(doesProductExistInWishlist(props.data.product, props));
    }, [props]);

    const {
        removeFromWishlistButtonText,
        addToWishlistButtonText,
        ariaRole,
        showStatusMessage,
        showRemoveButton,
        showButtonText,
        className,
        disabled,
        showButtonTooltip,
        tooltipPosition
    } = props;

    const onClickHandler = (event: React.MouseEvent<HTMLElement>) => {
        return AddToWishlistComponentActions.onClick(event, props, state);
    };
    const onDismissHandler = () => {
        AddToWishlistComponentActions.onDismiss(state);
    };
    const ariaLabel = state.canRemove ? removeFromWishlistButtonText : addToWishlistButtonText;
    const addToWishlistRef: React.RefObject<HTMLButtonElement> = React.createRef();
    const removeFromWishlistRef: React.RefObject<HTMLButtonElement> = React.createRef();
    const showMessage = showStatusMessage !== undefined ? showStatusMessage : true;
    const showButton = showRemoveButton !== undefined ? showRemoveButton : true;
    const showTooltip = showButtonTooltip !== undefined ? showButtonTooltip : true;
    const tooltipPos = showButtonTooltip !== undefined ? tooltipPosition : 'right';
    const linkAriaRole = ariaRole !== undefined ? ariaRole : 'link';

    if (state.canRemove && !showButton) {
        return null;
    }

    return (
        <>
            {showButtonText ? (
                <>
                    <button
                        className={classnames(
                            'msc-add-to-wishlist',
                            className,
                            state.waiting ? 'msc-add-to-wishlist__waiting' : '',
                            state.canRemove ? 'msc-add-to-wishlist__removing' : ''
                        )}
                        aria-label={ariaLabel}
                        onClick={onClickHandler}
                        disabled={disabled}
                        ref={addToWishlistRef}
                        role={linkAriaRole}
                    >
                        {ariaLabel}
                    </button>
                    {showTooltip && (
                        <UncontrolledTooltip placement={tooltipPos} trigger='hover focus' target={addToWishlistRef}>
                            {ariaLabel}
                        </UncontrolledTooltip>
                    )}
                </>
            ) : (
                <>
                    <button
                        className={classnames(
                            'msc-add-to-wishlist',
                            className,
                            state.waiting ? 'msc-add-to-wishlist__waiting' : '',
                            state.canRemove ? 'msc-add-to-wishlist__removing' : ''
                        )}
                        aria-label={ariaLabel}
                        onClick={onClickHandler}
                        disabled={disabled}
                        ref={removeFromWishlistRef}
                        role={linkAriaRole}
                    />
                    {showTooltip && (
                        <UncontrolledTooltip placement={tooltipPos} trigger='hover focus' target={addToWishlistRef}>
                            {ariaLabel}
                        </UncontrolledTooltip>
                    )}
                </>
            )}
            {state.content.showAlert && showMessage ? (
                <div className='ms-wishlist-items__product-status'>
                    <Alert color={state.content.color} isOpen={state.content.showAlert} toggle={onDismissHandler}>
                        {state.content.wishlistTextMessage}
                    </Alert>
                </div>
            ) : (
                ''
            )}
        </>
    );
};

const doesProductExistInWishlist = (product: SimpleProduct, props: IAddToWishlistComponentProps): boolean => {
    const { wishlists } = props.data;

    if (!wishlists || !wishlists[0]) {
        return false;
    }

    const { CommerceListLines } = wishlists[0];

    if (!CommerceListLines || CommerceListLines.length === 0) {
        return false;
    }

    for (const wishlistItem of CommerceListLines) {
        if (wishlistItem.ProductId === product.RecordId) {
            return true;
        }
    }

    return false;
};

const propagateSuccess = (props: IAddToWishlistComponentProps, result: IWishlistActionSuccessResult): void => {
    const { onSuccess, cartline } = props;

    if (onSuccess) {
        cartline ? onSuccess(result, props.cartline) : onSuccess(result);
    }
};

const propagateError = (props: IAddToWishlistComponentProps, result: IWishlistActionErrorResult): void => {
    const { onError } = props;

    if (onError) {
        onError(result);
    }
};

const addToWishlist = async (
    product: SimpleProduct,
    props: IAddToWishlistComponentProps,
    state: IAddToWishlistStateManager
): Promise<void> => {
    const { canAddMasterProduct, context } = props;

    if (product.Dimensions && !canAddMasterProduct) {
        const missingDimensions = product.Dimensions.filter(dimension => !(dimension.DimensionValue && dimension.DimensionValue.Value));

        if (missingDimensions.length > 0) {
            // At least one dimension with no value exists on the product, won't be able to add to cart
            propagateError(props, { status: 'MISSINGDIMENSION', missingDimensions });

            return AsyncResult.resolve();
        }
    }

    if (context.request.user.isAuthenticated) {
        if (!props.data.wishlists || props.data.wishlists.length === 0) {
            const wishlistName = props.nameOfWishlist;
            const customer = await getCustomerAccount(props);
            if (customer && customer.AccountNumber) {
                const listData: CommerceList = {
                    CustomerId: customer.AccountNumber,
                    Name: wishlistName,

                    // This is the type value specifically for a wishlist
                    CommerceListTypeValue: 1,
                    Id: 0
                };

                try {
                    const commerceList = await createCommerceListAsync({ callerContext: context.actionContext }, listData);
                    return callAddWishlistLine(props, state, commerceList.Id, product.RecordId);
                } catch (error) {
                    if (context.telemetry) {
                        context.telemetry.warning(error);
                        context.telemetry.debug('Unable to create a wishlist');
                    }
                    propagateError(props, { status: 'FAILED' });
                }
            } else {
                context.telemetry.debug('Customer account number missing');
            }
        } else {
            return callAddWishlistLine(props, state, props.data.wishlists[0].Id, product.RecordId);
        }
    }

    return AsyncResult.resolve();
};

const callAddWishlistLine = async (
    props: IAddToWishlistComponentProps,
    state: IAddToWishlistStateManager,
    wishlistId: number,
    productId: number
): Promise<void> => {
    const { context } = props;

    try {
        const customer = await getCustomerAccount(props);
        if (customer && customer.AccountNumber) {
            const createdCommerceList = await addLinesAsync({ callerContext: context.actionContext }, wishlistId, [
                buildWishlistLine(productId, customer.AccountNumber, wishlistId)
            ]);
            context.actionContext.update(createGetByCustomerInput({}, null), [createdCommerceList]);
            if (context.telemetry) {
                context.telemetry.debug(`Added item to the wishlist ${createdCommerceList}`);
            }
            state.setCanRemove(true);
            state.setContent({
                color: 'success',
                showAlert: true,
                wishlistTextMessage: props.addToWishlistMessage ? props.addToWishlistMessage : 'Added to your wishlist'
            });
            propagateSuccess(props, { status: 'ADDED' });
        } else {
            context.telemetry.debug('Customer Account number missing');
        }
    } catch (error) {
        if (context.telemetry) {
            context.telemetry.warning(error);
            context.telemetry.debug(`Unable to add item to wishlist ${error}`);
        }

        state.setContent({
            color: 'danger',
            showAlert: true,
            wishlistTextMessage: props.addItemToWishlistError
        });
        propagateError(props, { status: 'FAILED' });
    }
};

const removeFromWishlist = async (
    product: SimpleProduct,
    props: IAddToWishlistComponentProps,
    state: IAddToWishlistStateManager
): Promise<void> => {
    const { context, data, removedFromWishlistMessage, removeItemFromWishlistError } = props;
    const { wishlists } = data;
    const { actionContext, telemetry } = context;

    // TODO Please fix customeraccount number null once Bug https://msdyneng.visualstudio.com/FinOps/_workitems/edit/481375 gets fixed.
    if (context.request.user.isAuthenticated) {
        if (wishlists && wishlists[0]) {
            const wishlistLine = wishlists[0].CommerceListLines!.find(line => line.ProductId === product.RecordId);

            if (wishlistLine) {
                try {
                    const customer = await getCustomerAccount(props);
                    const commerceList = await removeLinesAsync({ callerContext: actionContext }, wishlists[0].Id, [wishlistLine]);
                    if (customer) {
                        context.actionContext.update(createGetByCustomerInput({}, null), [commerceList]);
                    } else {
                        telemetry.debug('Customer Account Number missing');
                    }

                    if (telemetry) {
                        telemetry.debug(`[WishlistButton] ${product.RecordId} removed from Wishlist ${commerceList.Id}`);
                    }
                    state.setCanRemove(false);
                    state.setContent({
                        color: 'success',
                        showAlert: true,
                        wishlistTextMessage: removedFromWishlistMessage ? removedFromWishlistMessage : 'Removed item from the wishlist'
                    });
                    propagateSuccess(props, { status: 'REMOVED' });
                } catch (error) {
                    if (telemetry) {
                        telemetry.warning(error);
                        telemetry.debug('[WishlistButton] Error removing item from the wishlist');
                    }

                    state.setContent({
                        color: 'danger',
                        wishlistTextMessage: removeItemFromWishlistError
                    });
                    propagateError(props, { status: 'FAILED' });
                }
            }
        } else if (telemetry) {
            telemetry.debug("[WishlistButton] Can't remove from wishlist since no wishlist exisits OR there is no product data");
        }
    }

    return AsyncResult.resolve();
};

const getCustomerAccount = (props: IAddToWishlistComponentProps): AsyncResult<Customer> => {
    const { context } = props;
    const customerInput = new GetCustomerInput(context.actionContext.requestContext.apiSettings);
    return getCustomer(customerInput, context.actionContext);
};

export const AddToWishlistComponent: React.FunctionComponent<IAddToWishlistComponentProps> = msdyn365Commerce.createComponentOverride<
    // @ts-expect-error
    IAddtoWishlistComponent
>('AddToWishlist', { component: AddToWishlist, ...AddToWishlistComponentActions });


export default AddToWishlistComponent;