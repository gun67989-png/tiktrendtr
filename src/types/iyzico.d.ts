declare module "iyzipay" {
  namespace Iyzipay {
    interface IyzipayConfig {
      apiKey: string;
      secretKey: string;
      uri: string;
    }

    interface Buyer {
      id: string;
      name: string;
      surname: string;
      gsmNumber?: string;
      email: string;
      identityNumber: string;
      lastLoginDate?: string;
      registrationDate?: string;
      registrationAddress: string;
      ip: string;
      city: string;
      country: string;
      zipCode?: string;
    }

    interface Address {
      contactName: string;
      city: string;
      country: string;
      address: string;
      zipCode?: string;
    }

    interface BasketItem {
      id: string;
      name: string;
      category1: string;
      category2?: string;
      itemType: string;
      price: string;
    }

    interface CheckoutFormInitializeRequest {
      locale?: string;
      conversationId?: string;
      price: string;
      paidPrice: string;
      currency: string;
      basketId: string;
      paymentGroup?: string;
      callbackUrl: string;
      enabledInstallments?: number[];
      buyer: Buyer;
      shippingAddress: Address;
      billingAddress: Address;
      basketItems: BasketItem[];
    }

    interface CheckoutFormInitializeResponse {
      status: string;
      locale: string;
      systemTime: number;
      conversationId: string;
      token: string;
      checkoutFormContent: string;
      tokenExpireTime: number;
      paymentPageUrl: string;
      errorCode?: string;
      errorMessage?: string;
      errorGroup?: string;
    }

    interface CheckoutFormRetrieveRequest {
      locale?: string;
      conversationId?: string;
      token: string;
    }

    interface CheckoutFormRetrieveResponse {
      status: string;
      locale: string;
      systemTime: number;
      conversationId: string;
      price: number;
      paidPrice: number;
      installment: number;
      paymentId: string;
      fraudStatus: number;
      merchantCommissionRate: number;
      merchantCommissionRateAmount: number;
      iyziCommissionRateAmount: number;
      iyziCommissionFee: number;
      cardType: string;
      cardAssociation: string;
      cardFamily: string;
      binNumber: string;
      lastFourDigits: string;
      basketId: string;
      currency: string;
      token: string;
      paymentStatus: string;
      errorCode?: string;
      errorMessage?: string;
      errorGroup?: string;
      itemTransactions?: Array<{
        itemId: string;
        paymentTransactionId: string;
        transactionStatus: number;
        price: number;
        paidPrice: number;
      }>;
    }

    interface CheckoutFormInitialize {
      create(
        request: CheckoutFormInitializeRequest,
        callback: (err: Error | null, result: CheckoutFormInitializeResponse) => void
      ): void;
    }

    interface CheckoutFormRetrieve {
      retrieve(
        request: CheckoutFormRetrieveRequest,
        callback: (err: Error | null, result: CheckoutFormRetrieveResponse) => void
      ): void;
    }
  }

  class Iyzipay {
    constructor(config: Iyzipay.IyzipayConfig);
    checkoutFormInitialize: Iyzipay.CheckoutFormInitialize;
    checkoutForm: Iyzipay.CheckoutFormRetrieve;

    static LOCALE: {
      TR: string;
      EN: string;
    };
    static CURRENCY: {
      TRY: string;
      EUR: string;
      USD: string;
      GBP: string;
    };
    static PAYMENT_GROUP: {
      PRODUCT: string;
      LISTING: string;
      SUBSCRIPTION: string;
    };
    static BASKET_ITEM_TYPE: {
      PHYSICAL: string;
      VIRTUAL: string;
    };
  }

  export = Iyzipay;
}
