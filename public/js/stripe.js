/* eslint-disable */

const stripe = Stripe("pk_test_51LibPuLgcceWTOL2EW5hidL5ctQBsm77hNYuWshRRnZJn6Buk84ofVX9n3PpuUFZh3ahZ9bTnpkdWYm5lTYbWPtp00gw8iy4Yg");
import axios from "axios";
import { showAlert } from "./alerts";

export const bookTour = async tourId => {
    //1) Get checkout session from API
try {
    const session = await axios(
        `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    
   //2) Create checkout form + charge credit card
   await stripe.redirectToCheckout({
       sessionId: session.data.session.id 
   });
 } catch (err) {
     console.log(err);
     showAlert("error", err);
 }
};