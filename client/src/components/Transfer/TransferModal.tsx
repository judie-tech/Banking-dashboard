import React, { useState } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react"; // ❌ Removed unused `Send` import
import { TransferForm } from "../../types";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  senderId: string;
  onSuccess: () => void; // ✅ Ensure this is declared
}

const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  senderId,
  onSuccess, // ✅ FIX: Destructure onSuccess to fix TS error
}) => {
  const [form, setForm] = useState<TransferForm>({
    receiverId: 0,
    amount: 0,
    notes: "",
  });
  const [step, setStep] = useState<"form" | "confirmation" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (form.amount > currentBalance) {
      setError("Insufficient balance");
      return;
    }

    setStep("confirmation");
  };

  const confirmTransfer = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please log in to continue.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/transactions/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            senderId,
            receiverId: form.receiverId || null,
            amount: form.amount,
            note: form.notes,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Transfer failed");

      setTransactionId(data.debitTransactionId);
      setLoading(false);
      setStep("success");
      onSuccess(); // ✅ Works now
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      setStep("form");
    }
  };

  const resetModal = () => {
    setForm({ receiverId: 0, amount: 0, notes: "" });
    setStep("form");
    setError("");
    setLoading(false);
    setTransactionId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-gray-900">
            {step === "form" && "Transfer Money"}
            {step === "confirmation" && "Confirm Transfer"}
            {step === "success" && "Transfer Successful"}
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

              <div className="bg-gradient-to-r from-[#2a3b8f] to-[#00c9b1] rounded-xl p-4 text-white">
                <p className="text-sm opacity-90">Available Balance</p>
                <p className="text-2xl font-bold">
                  KES {currentBalance.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receiver Account
                </label>
                <input
                  type="number"
                  value={form.receiverId || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      receiverId: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a3b8f] focus:border-transparent"
                  placeholder="Enter receiver ID (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (KES)
                </label>
                <input
                  type="number"
                  value={form.amount || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a3b8f] focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a3b8f] focus:border-transparent"
                  rows={3}
                  placeholder="Add a note for this transfer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#2a3b8f] to-[#00c9b1] text-white font-semibold rounded-xl hover:from-[#1e2875] hover:to-[#00a896] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue
              </button>
            </form>
          )}

          {step === "confirmation" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirm Transfer
                </h3>
                <p className="text-gray-600 text-sm">
                  Please review the transfer details
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">To Account:</span>
                  <span className="font-medium">
                    #{form.receiverId || "External"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    KES {form.amount.toLocaleString()}
                  </span>
                </div>
                {form.notes && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Notes:</span>
                    <span className="font-medium text-right max-w-40 truncate">
                      {form.notes}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep("form")}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={confirmTransfer}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-[#00c9b1] to-[#ff6b6b] text-white font-semibold rounded-xl hover:from-[#00b8a5] hover:to-[#ff5555] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Confirm Transfer"
                  )}
                </button>
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
                  Transfer Completed!
                </h3>
                <p className="text-gray-600 text-sm">
                  Your money has been transferred successfully
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-green-800 font-medium">
                  Transaction ID: {transactionId || "N/A"}
                </p>
                <p className="text-green-600 text-sm">
                  KES {form.amount.toLocaleString()} sent to #
                  {form.receiverId || "External"}
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

export default TransferModal;
