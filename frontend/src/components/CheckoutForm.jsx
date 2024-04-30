import React, { useState } from 'react';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';


export const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();