import config from "./config.js";
import bookingModel from "../models/booking.js";
import orderModel from "../models/order.js";

TPDirect.setupSDK(151595, config.TAPPAY_APP_KEY, "sandbox");

let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'CVV'
    }
};

TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },        
    },
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
});

export default async function orderSubmit(unpaidBooking) {

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();
    const phoneNumber = document.querySelector("#booking-user-phoneNumber").value;
    const name = document.querySelector("#booking-user-name").value;
    const email = document.querySelector("#booking-user-email").value;

    if (!/^09[0-9]{8}$/.test(phoneNumber) || name === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("請填入正確的聯絡資訊")
        return;
    }
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('信用卡資訊錯誤');
        return;
    }

    // Get prime
    TPDirect.card.getPrime(async (result) => {
        if (result.status !== 0) {
            return console.log(result);
        }
        const prime = result.card.prime;
        // const unpaidBooking = await bookingModel.fetchUnpaidBooking();
        const orderBody = {
            prime,
            order: {
                price: unpaidBooking.price,
                trip: {
                    attraction: unpaidBooking.attraction,
                    date: unpaidBooking.date,
                    time: unpaidBooking.time
                },
                contact: {
                    name,
                    email,
                    phone: phoneNumber
                }
            }
        };
        const paySuccess = await orderModel.fetchCreateOrder(orderBody);
        if (!paySuccess) {
            return alert("付款失敗");
        }
        const orderNumber = paySuccess.number;
        window.location.href = `/thankyou?number=${orderNumber}`;
    });
}