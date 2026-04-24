declare module "@paystack/inline-js" {
  type PaystackTransaction = {
    reference?: string;
    trans?: string;
    transaction?: string;
    status?: string;
    message?: string;
  };

  type ResumeTransactionCallbacks = {
    onSuccess?: (transaction: PaystackTransaction) => void | Promise<void>;
    onCancel?: () => void;
    onError?: (error?: unknown) => void;
  };

  export default class PaystackPop {
    resumeTransaction(
      accessCode: string,
      callbacks?: ResumeTransactionCallbacks
    ): void;
  }
}
