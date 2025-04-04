import { describe, it, expect, vi, beforeEach } from 'vitest';

import { PaymentMethod } from '../models/payment.model';
import { PaymentService } from '../services/payment.service';
import { OrderService } from '../services/order.service';

// Mock global fetch
globalThis.fetch = vi.fn();

describe('OrderService', () => {
  let mockPaymentService: PaymentService;
  let orderService: OrderService;

  beforeEach(() => {
    mockPaymentService = {
      buildPaymentMethod: vi.fn().mockReturnValue(PaymentMethod.CREDIT),
      payViaLink: vi.fn()
    } as unknown as PaymentService;

    orderService = new OrderService(mockPaymentService);
    vi.resetAllMocks();
  });

  it('throws error if order has no items', async () => {
    await expect(orderService.process({})).rejects.toThrow('Order items are required');
  });

  it('throws error if any item has invalid price or quantity', async () => {
    const order = {
      items: [
        { id: '1', productId: 'p1', price: 0, quantity: 2 }
      ]
    };
    await expect(orderService.process(order)).rejects.toThrow('Order items are invalid');
  });

  it('throws error if total price is <= 0', async () => {
    const order = {
      items: [
        { id: '1', productId: 'p1', price: 0, quantity: 0 }
      ]
    };
    await expect(orderService.process(order)).rejects.toThrow('Order items are invalid');
  });

  it('processes order without coupon successfully', async () => {
    const mockCreatedOrder = {
      id: 'order1',
      totalPrice: 2000,
      items: [],
      paymentMethod: PaymentMethod.CREDIT
    };

    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(mockCreatedOrder)
    });

    const order = {
      id: 'order1',
      items: [
        { id: '1', productId: 'p1', price: 1000, quantity: 2 }
      ]
    };

    await orderService.process(order);

    expect(mockPaymentService.buildPaymentMethod).toHaveBeenCalledWith(2000);
    expect(mockPaymentService.payViaLink).toHaveBeenCalledWith(mockCreatedOrder);
    expect(fetch).toHaveBeenCalledWith(
      'https://67eb7353aa794fb3222a4c0e.mockapi.io/order',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    );
  });

  it('applies coupon and processes order', async () => {
    const coupon = { id: 'c1', discount: 1000 };

    // 1. mock coupon fetch
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(coupon)
    });

    // 2. mock order post fetch
    const createdOrder = {
      id: 'order2',
      totalPrice: 1000,
      items: [],
      paymentMethod: PaymentMethod.CREDIT
    };

    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(createdOrder)
    });

    const order = {
      id: 'order2',
      items: [
        { id: '1', productId: 'p1', price: 1000, quantity: 2 }
      ],
      couponId: 'c1'
    };

    await orderService.process(order);

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/coupons/c1'));
    expect(mockPaymentService.buildPaymentMethod).toHaveBeenCalledWith(1000);
    expect(mockPaymentService.payViaLink).toHaveBeenCalledWith(createdOrder);
  });

  it('sets totalPrice = 0 if coupon discount is too big', async () => {
    const coupon = { id: 'c1', discount: 99999 };
    const mockedCouponFetch = vi.fn().mockResolvedValue(coupon);
    const mockedOrderResponse = {
      json: vi.fn().mockResolvedValue({
        id: 'order3',
        totalPrice: 0,
        paymentMethod: PaymentMethod.CREDIT,
        items: []
      })
    };

    (fetch as unknown as vi.Mock).mockResolvedValueOnce({ json: mockedCouponFetch });
    (fetch as unknown as vi.Mock).mockResolvedValueOnce(mockedOrderResponse);

    const order = {
      id: 'order3',
      items: [
        { id: '1', productId: 'p1', price: 1000, quantity: 1 }
      ],
      couponId: 'c1'
    };

    await orderService.process(order);

    expect(mockPaymentService.buildPaymentMethod).toHaveBeenCalledWith(0);
  });

  it('throws error if coupon is invalid', async () => {
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(undefined)
    });

    const order = {
      id: 'order4',
      items: [
        { id: '1', productId: 'p1', price: 1000, quantity: 1 }
      ],
      couponId: 'invalid-coupon'
    };

    await expect(orderService.process(order)).rejects.toThrow('Invalid coupon');
  });
});
