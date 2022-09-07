interface IMonnifyArgs {
  customerEmail: string;
  customerName: string;
  amount: number;
  walletId: string;
  runFunc?: any;
  showSuccess: () => void;
  showError: () => void;
}

interface IMonnifyRes {
  amountPaid: number;
  authorizedAmount: number;
  cardToken: string;
  message: string;
  paidOn: string;
  paymentDescription: string;
  paymentReference: string;
  paymentStatus: string;
  status: string;
  transactionReference: string;
}

export default async function payWithMonnify({
  customerEmail,
  customerName,
  amount,
  walletId,
  runFunc,
  showSuccess,
  showError,
}: IMonnifyArgs): Promise<IMonnifyRes | void> {
  if (window?.MonnifySDK) {
    window.MonnifySDK.initialize({
      amount,
      currency: "NGN",
      reference: "" + Math.floor(Math.random() * 1000000000 + 1),
      customerName,
      customerEmail,
      apiKey: process.env.NEXT_PUBLIC_MONNIFY_API_KEY,
      contractCode: process.env.NEXT_PUBLIC_MONNIFY_CONTRACT_CODE,
      paymentDescription: "Fund Wallet",
      isTestMode: true,
      metadata: {
        name: customerName,
      },
      paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
      onComplete: async function (response: IMonnifyRes) {
        try {
          if (
            response?.status.toLowerCase() === "success" &&
            response?.paymentStatus.toLowerCase() === "paid"
          ) {
            if (runFunc) {
              await runFunc({
                wallet_id: walletId,
                transactionReference: response.transactionReference,
                amount: `${response.authorizedAmount}`,
              });
              showSuccess();
            }
          } else {
            showError();
          }
        } catch (error) {
          showError();
        }
      },
    });
  } else {
    return;
  }
}
