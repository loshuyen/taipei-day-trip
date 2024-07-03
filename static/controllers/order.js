import orderModel from "../models/order.js";
import bookingModel from "../models/booking.js";
import config from "./config.js";

TPDirect.setupSDK(151595, config.TAPPAY_APP_KEY, 'sandbox');

TPDirect.card.setup({
    fields: {
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
    },
    styles: {
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: false,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})

function onSubmit(event) {
    event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    
    let phoneNumber = document.querySelector("#booking-user-phoneNumber").value;
    if (phoneNumber === "" || !/^09[0-9]{8}$/.test(phoneNumber)) {
        alert("請填入正確的手機號碼")
        return;
    }
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert("請輸入正確的信用卡資訊");
        return;
    }

    // Get prime
    TPDirect.card.getPrime(async (result) => {
        if (result.status !== 0) {
            return;
        }
        // alert('get prime 成功，prime: ' + result.card.prime)
        let prime = result.card.prime;
        let booking = await bookingModel.fetchUnpaidBooking();
        let orderBody = {
            prime: prime,
            order: {
                price: booking.price,
                trip: {
                    attraction: booking.attraction,
                    date: booking.date,
                    time: booking.time
                },
                contact: {
                    name: document.querySelector("#booking-user-name").value,
                    email: document.querySelector("#booking-user-email").value,
                    phone: phoneNumber
                }
            }

        };
        let payment_result = await orderModel.fetchCreateOrder(orderBody);
        let order_number = payment_result.number;
        window.location.href = `/thankyou?number=${order_number}`;
    })
}

document.querySelector(".booking-total__submit-btn").addEventListener("click", onSubmit);