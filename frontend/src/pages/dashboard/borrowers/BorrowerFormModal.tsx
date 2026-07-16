import {
  useCreateBorrower,
  useUpdateBorrower,
} from "../../../hooks/useBorrowers";
import type { Borrower } from "../../../services/borrowerService";
import { NRC_STATES, NRC_TYPES, useBorrowerForm } from "./useBorrowerForm";

type BorrowerFormMode = "create" | "edit";

interface BorrowerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: BorrowerFormMode;
  initialData?: Borrower | null;
  onSuccess?: (mode: BorrowerFormMode) => void;
}

export default function BorrowerFormModal({
  isOpen,
  onClose,
  mode = "create",
  initialData,
  onSuccess,
}: BorrowerFormModalProps) {
  const createBorrowerMutation = useCreateBorrower();
  const updateBorrowerMutation = useUpdateBorrower();

  const {
    formData,
    nrcParts,
    errors,
    townshipOptions,
    nrcPreview,
    borrowerDto,
    updateField,
    updateNrcState,
    updateNrcField,
    validateForm,
  } = useBorrowerForm(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (mode === "edit" && initialData?.id) {
        await updateBorrowerMutation.mutateAsync({
          id: initialData.id,
          data: borrowerDto,
        });
      } else {
        await createBorrowerMutation.mutateAsync(borrowerDto);
      }
      onClose();
      onSuccess?.(mode);
    } catch (error) {
      console.error(`Failed to ${mode} borrower:`, error);
    }
  };

  const mutation =
    mode === "edit" ? updateBorrowerMutation : createBorrowerMutation;
  const isSubmitting = mutation.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  {mode === "edit" ? "Edit Borrower" : "Add Borrower"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {mode === "edit"
                    ? "Update borrower details below"
                    : "Fill in the details to create a borrower"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                disabled={isSubmitting}
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

          <form onSubmit={handleSubmit} className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label
                  htmlFor="full_name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => updateField("full_name", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.full_name ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  placeholder="Enter full name"
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.full_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="text"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NRC <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-12 gap-2">
                  <select
                    value={nrcParts.stateCode}
                    onChange={(e) => updateNrcState(e.target.value)}
                    className={`w-full md:col-span-2 px-3 py-3 rounded-lg border ${errors.nrc ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  >
                    <option value="">State</option>
                    {NRC_STATES.map((state) => (
                      <option key={state.id} value={state.number.en}>
                        {state.number.en}
                      </option>
                    ))}
                  </select>

                  <select
                    value={nrcParts.townshipCode}
                    onChange={(e) => updateNrcField("townshipCode", e.target.value)}
                    className={`w-full md:col-span-4 px-3 py-3 rounded-lg border ${errors.nrc ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    disabled={!nrcParts.stateId}
                  >
                    <option value="">Township</option>
                    {townshipOptions.map((township) => (
                      <option key={township.code} value={township.code}>
                        {township.code}
                      </option>
                    ))}
                  </select>

                  <select
                    value={nrcParts.nrcType}
                    onChange={(e) => updateNrcField("nrcType", e.target.value)}
                    className={`w-full md:col-span-2 px-3 py-3 rounded-lg border ${errors.nrc ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  >
                    {NRC_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={nrcParts.number}
                    onChange={(e) =>
                      updateNrcField(
                        "number",
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    className={`w-full md:col-span-4 px-3 py-3 rounded-lg border ${errors.nrc ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="123232"
                  />
                </div>
                {(nrcParts.stateCode ||
                  nrcParts.townshipCode ||
                  nrcParts.number) && (
                  <p className="mt-1 text-xs text-gray-500">
                    Format: {nrcPreview}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Example: 12/OUKAMA(N)123456
                </p>
                {errors.nrc && (
                  <p className="mt-1 text-sm text-red-500">{errors.nrc}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.address ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  placeholder="Enter address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>
            </div>

            {mutation.isError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  Failed to {mode} borrower. Please try again.
                </p>
              </div>
            )}

            <div className="mt-8 flex gap-4 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
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
                    {mode === "edit" ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{mode === "edit" ? "Update Borrower" : "Create Borrower"}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
