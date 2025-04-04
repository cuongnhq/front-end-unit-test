# ✅ Test Checklist for `OrderService`

## 🛒 Validate Order Input
- [x] ❌ Throw error if `order.items` is empty or undefined
- [x] ❌ Throw error if any item has `price <= 0` or `quantity <= 0`
- [x] ❌ Throw error if `totalPrice` calculated is `<= 0`

## 🎟 Apply Coupon
- [x] ✅ Fetch coupon if `order.couponId` exists
- [x] ❌ Throw error if coupon is invalid (not returned)
- [x] ✅ Subtract `coupon.discount` from `totalPrice`
- [x] ✅ Ensure `totalPrice` is not negative (set to 0 if < 0)

## 💳 Final Order Submission
- [x] ✅ Call `buildPaymentMethod(totalPrice)` from `PaymentService`
- [x] ✅ Submit final order to API
- [x] ✅ Call `payViaLink` from `PaymentService` with created order

---

# ✅ Test Checklist for `PaymentService`

## 💰 Method: `buildPaymentMethod(totalPrice)`
- [x] ✅ Return all methods if `totalPrice <= 300000`
- [x] ✅ Exclude AUPAY if `totalPrice > 300000`
- [x] ✅ Exclude PAYPAY if `totalPrice > 500000`
- [x] ✅ Return only CREDIT if `totalPrice > 600000`

## 🔗 Method: `payViaLink(order)`
- [x] ✅ Call `window.open` with correct `orderId` in the URL
- [x] ✅ Open in new tab (`_blank`)
