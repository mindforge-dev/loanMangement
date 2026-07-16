import { useState } from "react";
import { useCreatePermission } from "../../../hooks/useUsers";

interface CreatePermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CreatePermissionModal({
    isOpen,
    onClose,
    onSuccess,
}: CreatePermissionModalProps) {
    const createPermissionMutation = useCreatePermission();

    const [name, setName] = useState("");
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim().toLowerCase();
        if (!trimmedName) {
            setSubmitError("Permission name is required");
            return;
        }
        if (!trimmedName.includes(":")) {
            setSubmitError("Permission name should follow pattern module:action (e.g., users:delete)");
            return;
        }
        setSubmitError(null);
        try {
            await createPermissionMutation.mutateAsync({
                name: trimmedName,
            });
            setName("");
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error("Failed to create permission:", err);
            setSubmitError(err?.response?.data?.error?.message || "Failed to create permission.");
        }
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
                    className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative px-8 pt-8 pb-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                    Create Permission
                                </h2>
                                <p className="mt-1 text-xs text-gray-500">
                                    Define a new fine-grained system permission.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                disabled={createPermissionMutation.isPending}
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

                    <form onSubmit={handleSave} className="px-8 py-6 space-y-6">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Permission Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. loans:close, reports:export"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900"
                                disabled={createPermissionMutation.isPending}
                                required
                            />
                            <p className="mt-2 text-xs text-gray-400">
                                Recommended format: <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-600 font-mono">module:action</code>
                            </p>
                        </div>

                        {submitError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{submitError}</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex gap-4 justify-end pt-2 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={createPermissionMutation.isPending}
                                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createPermissionMutation.isPending}
                                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {createPermissionMutation.isPending ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
