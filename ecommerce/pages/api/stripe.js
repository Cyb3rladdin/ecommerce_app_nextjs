import Stripe from 'stripe';

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

//req are routing to '/stripe'
export default async function handler(req, res) {
  if (req.method === 'POST') {

    try {
        //add params for payment processing from Stripe
        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_options: [
                { shipping_rate: 'shr_1LtGGsFDEeFsXLdoyACL6yzS'},
                { shipping_rate: 'shr_1LtGHzFDEeFsXLdoKfqxBiZ7'},
            ],
            line_items: req.body.map((item) => {
              const img = item.image[0].asset._ref;
              //since we only get a reference to the image from the statement above, we need to use the replace() method to get access to the actual image
              const newImage = img.replace('image-', 'https://cdn.sanity.io/images/mg9g1doc/production/').replace('-webp', '.webp');

              return {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: item.name,
                    images: [newImage],
                  },
                  unit_amount: item.price * 100,
                },
                adjustable_quantity: {
                  enabled: true,
                  minimum: 1,
                },
                quantity: item.quantity
              }
            }),
            success_url: `${req.headers.origin}/?success=true`,
            cancel_url: `${req.headers.origin}/?canceled=true`,
        }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
