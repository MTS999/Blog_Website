import React from 'react'
import { CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import {
    Elements,
    useStripe,
    useElements,
  } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51N8IBcKJxB20FHeSUPLXdkHGX6eJlVj18dXAFQ0IeMNkSWP55DPdcTJxarJbAiNCZpuhGO5dVXxOYoKAzycEnl7Z00o6DwKtG6");
const Checkout = () => {
    const stripe = useStripe();
    const elements = useElements();

    const  cardelement=elements.getElement(CardElement)

    stripe.createToken(cardelement).then(function(result){
        if(result.error){
            console.log(result.error.messege);
        }
        else{
            console.log(result.token.id);
 
        }
    })

  
  return (
    <div className='flex container mt-8'>
      <Elements stripe={stripePromise} >
        <button> submit</button>
      </Elements>
        <CardElement />

    </div>
  )
}

export default Checkout