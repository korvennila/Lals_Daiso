import React, { useRef, useState, useEffect } from 'react';
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import { ISubscribeViewProps } from './subscribe';

/**
 * Validate email format.
 * @param email - Email to validate.
 */
const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

/**
 * View component.
 * @param props - The view properties.
 */
export const SubscribeView: React.FC<ISubscribeViewProps> = props => {
    const { subscribe, subscribeContainer, heading, text, subscribeForm, emailInput, submitButton, context } = props;
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');
    const emailInputRef = useRef<HTMLInputElement>(null);

    /* Context Variables */
    const cRetailURL = context.request.apiSettings.baseUrl;
    const cRetailOUN = context.request.apiSettings.oun ? context.request.apiSettings.oun : '';
    const cCustomerEmailAddress = context.request.user.emailAddress ? context.request.user.emailAddress : '';
    const cCustomerAccount = context.request.user.customerAccountNumber ? context.request.user.customerAccountNumber : '';

    useEffect(() => {
        if (cCustomerEmailAddress) {
            setEmail(cCustomerEmailAddress);
        }
    }, [cCustomerEmailAddress]);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        if (!email) {
            setValidationError(props.resources.emailRequiredText);
            setResponseMessage(null);
            return;
        }

        if (!validateEmail(email)) {
            setValidationError(props.resources.emailValidateText);
            setResponseMessage(null);
            return;
        }

        setValidationError(null);

        const apiUrl = `${cRetailURL}commerce/SaveSubscriptionsRequest?api-version=7.3`;
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    OUN: cRetailOUN,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'
                },
                body: JSON.stringify({ Email: email, CustAccount: cCustomerAccount })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.value === 1) {
                setResponseMessage(props.resources.subscriptionSuccessMessage);
            } else {
                setResponseMessage(props.resources.subscriptionFailureMessage);
            }
        } catch (error) {
            console.error('Failed to subscribe:', error);
            setResponseMessage('Failed to subscribe. Please try again.');
        }
    };

    return (
        <Module {...subscribe}>
            <Node {...subscribeContainer} className={subscribeContainer.className}>
                {heading}
                {text}
                <Node {...subscribeForm} onSubmit={onSubmit} className={subscribeForm?.className ?? ''}>
                    <input
                        {...emailInput}
                        ref={emailInputRef}
                        className={emailInput?.className ?? ''}
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <button {...submitButton} className={submitButton?.className ?? ''} type='submit'>
                        {props.submitButtonLabelText}
                    </button>
                </Node>
                {validationError && <div className='validation-error'>{validationError}</div>}
                {responseMessage && <div className='response-message'>{responseMessage}</div>}
            </Node>
        </Module>
    );
};

export default SubscribeView;
