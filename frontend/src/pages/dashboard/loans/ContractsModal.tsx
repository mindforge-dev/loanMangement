import React, { useState } from "react";
import {
  useContractsByLoan,
  useUploadContract,
  useDownloadContract,
} from "../../../hooks/useContracts";
import { useHasPermission } from "../../../hooks/useAuth";
import { Permissions } from "../../../lib/permissions";
import type { Loan } from "../../../services/loanService";

interface ContractsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan;
}

export default function ContractsModal({
  isOpen,
  onClose,
  loan,
}: ContractsModalProps) {
  const canCreate = useHasPermission(Permissions.CONTRACTS_CREATE);
  const canDownload = useHasPermission(Permissions.CONTRACTS_DOWNLOAD);

  const { data: contracts = [], isLoading, error } = useContractsByLoan(loan.id);
  const uploadMutation = useUploadContract();
  const downloadMutation = useDownloadContract();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [signingDate, setSigningDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadError("");
      setUploadSuccess("");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }
    if (!signingDate) {
      setUploadError("Please select a signing date.");
      return;
    }

    try {
      setUploadError("");
      setUploadSuccess("");
      await uploadMutation.mutateAsync({
        loanId: loan.id,
        file: selectedFile,
        signingDate,
      });
      setUploadSuccess("Contract uploaded successfully!");
      setSelectedFile(null);
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || "Failed to upload contract.");
    }
  };

  const handleDownload = async (contractId: string, filename: string) => {
    try {
      await downloadMutation.mutateAsync({ contractId, filename });
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
                  Loan Contracts
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage documents for loan to{" "}
                  <span className="font-semibold text-gray-700">
                    {loan.borrower?.full_name || "N/A"}
                  </span>{" "}
                  (Balance:{" "}
                  {new Intl.NumberFormat("my-MM", {
                    style: "currency",
                    currency: "MMK",
                  }).format(parseFloat(loan.current_balance || "0"))}
                  )
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-8 py-6 space-y-8 max-h-[70vh] overflow-y-auto">
            {/* Upload form section */}
            {canCreate && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Upload New Contract
                </h3>
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Select File (PDF, Image, etc.) *
                      </label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 border border-gray-200 rounded-lg p-1.5 bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Signing Date *
                      </label>
                      <input
                        type="date"
                        value={signingDate}
                        onChange={(e) => setSigningDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-700"
                      />
                    </div>
                  </div>

                  {uploadError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                      {uploadError}
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                      {uploadSuccess}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={uploadMutation.isPending}
                      className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-semibold hover:from-teal-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {uploadMutation.isPending ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        "Upload Contract"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List contracts section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Existing Documents
              </h3>

              {isLoading ? (
                <div className="py-8 text-center text-gray-500">
                  Loading contracts...
                </div>
              ) : error ? (
                <div className="py-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  Failed to load contracts.
                </div>
              ) : contracts.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-gray-200 rounded-xl text-gray-400">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  No contracts uploaded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {contracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-teal-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="p-2.5 bg-teal-50 rounded-lg text-teal-600 shrink-0">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="overflow-hidden">
                          <p
                            className="text-sm font-semibold text-gray-800 truncate"
                            title={contract.original_file_name}
                          >
                            {contract.original_file_name}
                          </p>
                          <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 mt-0.5">
                            <span>{formatBytes(contract.size)}</span>
                            <span>•</span>
                            <span>Signed: {formatDate(contract.signing_date)}</span>
                          </div>
                        </div>
                      </div>

                      {canDownload && (
                        <button
                          onClick={() =>
                            handleDownload(contract.id, contract.original_file_name)
                          }
                          disabled={downloadMutation.isPending}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-teal-100 disabled:opacity-50 shrink-0"
                          title="Download Contract"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
