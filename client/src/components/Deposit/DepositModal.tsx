import React, { useState } from "react";
import {
  X,
  DollarSign,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "bank" | "mobile"
  >("card");
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const user = localStorage.getItem("user");
    if (!user) {
      setError("User not logged in");
      return;
    }

    const { id: userId } = JSON.parse(user);

    setStep("processing");
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // Optional: if needed for auth headers

      const response = await fetch(
        "http://localhost:3000/api/transactions/deposit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            userId,
            amount,
            note: `Deposit via ${paymentMethod}`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Deposit failed");
      }

      setTimeout(() => {
        setLoading(false);
        setStep("success");
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      setStep("form");
      setError(err.message || "Something went wrong");
    }
  };

  const resetModal = () => {
    setAmount(0);
    setPaymentMethod("card");
    setStep("form");
    setError("");
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-gray-900">
            {step === "form" && "Deposit Funds"}
            {step === "processing" && "Processing Deposit"}
            {step === "success" && "Deposit Successful"}
          </h2>
          <button
            onClick={resetModal}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount (KES)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={amount || ""}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a3b8f] focus:border-transparent"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as "card")
                      }
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Credit/Debit Card
                      </p>
                      <p className="text-sm text-gray-500">
                        Visa, Mastercard, etc.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as "bank")
                      }
                      className="mr-3"
                    />
                    <DollarSign className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Bank Transfer</p>
                      <p className="text-sm text-gray-500">
                        Direct bank transfer
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile"
                      checked={paymentMethod === "mobile"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as "mobile")
                      }
                      className="mr-3"
                    />
                    <div className="w-5 h-5 bg-green-500 rounded mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">M-Pesa</p>
                      <p className="text-sm text-gray-500">
                        Mobile money transfer
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#2a3b8f] to-[#00c9b1] text-white font-semibold rounded-xl hover:from-[#1e2875] hover:to-[#00a896] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Deposit KES {amount.toLocaleString()}
              </button>
            </form>
          )}

          {step === "processing" && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <div className="w-8 h-8 border-2 border-[#2a3b8f] border-t-transparent rounded-full animate-spin"></div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Processing Your Deposit
                </h3>
                <p className="text-gray-600 text-sm">
                  Please wait while we process your deposit...
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-blue-800 font-medium">
                  Amount: KES {amount.toLocaleString()}
                </p>
                <p className="text-blue-600 text-sm capitalize">
                  Method:{" "}
                  {paymentMethod === "mobile"
                    ? "M-Pesa"
                    : paymentMethod === "bank"
                    ? "Bank Transfer"
                    : "Card Payment"}
                </p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Deposit Successful!
                </h3>
                <p className="text-gray-600 text-sm">
                  Your funds have been added to your account
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-green-800 font-medium">
                  Deposited: KES {amount.toLocaleString()}
                </p>
                <p className="text-green-600 text-sm">
                  Transaction ID: #DEP{Date.now()}
                </p>
              </div>

              <button
                onClick={resetModal}
                className="w-full py-3 bg-gradient-to-r from-[#2a3b8f] to-[#00c9b1] text-white font-semibold rounded-xl hover:from-[#1e2875] hover:to-[#00a896] transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
