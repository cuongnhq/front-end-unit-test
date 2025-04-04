import { describe, it, expect, vi, beforeEach } from "vitest";
import { PaymentService } from "../services/payment.service";
import { PaymentMethod } from "../models/payment.model";
import { Order } from "../models/order.model";

describe("PaymentService", () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  describe("buildPaymentMethod", () => {
    it("should include all methods if totalPrice <= 300000", () => {
      const result = paymentService.buildPaymentMethod(300000);
      expect(result).toBe(
        [PaymentMethod.CREDIT, PaymentMethod.PAYPAY, PaymentMethod.AUPAY].join(
          ","
        )
      );
    });

    it("should exclude AUPAY if totalPrice > 300000", () => {
      const result = paymentService.buildPaymentMethod(400000);
      expect(result).toBe(
        [PaymentMethod.CREDIT, PaymentMethod.PAYPAY].join(",")
      );
    });

    it("should exclude PAYPAY if totalPrice > 500000", () => {
      const result = paymentService.buildPaymentMethod(600000);
      expect(result).toBe([PaymentMethod.CREDIT].join(","));
    });

    it("should exclude AUPAY and PAYPAY if totalPrice > 600000", () => {
      const result = paymentService.buildPaymentMethod(700000);
      expect(result).toBe(PaymentMethod.CREDIT);
    });
  });

  describe("payViaLink", () => {
    it("should open window with correct orderId", async () => {
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

      const fakeOrder: Order = {
        id: "order123",
        totalPrice: 100000,
        items: [],
        paymentMethod: PaymentMethod.CREDIT,
      };

      await paymentService.payViaLink(fakeOrder);

      expect(openSpy).toHaveBeenCalledWith(
        "https://payment.example.com/pay?orderId=order123",
        "_blank"
      );

      openSpy.mockRestore();
    });
  });
});
