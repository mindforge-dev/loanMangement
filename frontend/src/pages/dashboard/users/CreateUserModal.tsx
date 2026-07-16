import { useState } from "react";
import { useRoles, useCreateUser } from "../../../hooks/useUsers";

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CreateUserModal({
    isOpen,
    onClose,
    onSuccess,
}: CreateUserModalProps) {
    const { data: roles = [] } = useRoles();
    const createUserMutation = useCreateUser();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const toggleRole = (roleName: string) => {
        setSelectedRoles((prev) =>
            prev.includes(roleName)
                ? prev.filter((r) => r !== roleName)
                : [...prev, roleName]
        );
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setSubmitError("Name is required");
            return;
        }
        if (!email.trim()) {
            setSubmitError("Email is required");
            return;
        }
        setSubmitError(null);
        try {
            await createUserMutation.mutateAsync({
                name: name.trim(),
                email: email.trim(),
                password: password ? password : undefined,
                roles: selectedRoles,
            });
            setName("");
            setEmail("");
            setPassword("");
            setSelectedRoles([]);
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error("Failed to create user:", err);
            setSubmitError(err?.response?.data?.error?.message || "Failed to create user.");
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
                    className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative px-8 pt-8 pb-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                    Create New User
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Manually create a new user account in the system.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                disabled={createUserMutation.isPending}
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
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Kaye Manning"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900"
                                disabled={createUserMutation.isPending}
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g. kaye@mailinator.com"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900"
                                disabled={createUserMutation.isPending}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Leave blank to use temporary password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900"
                                disabled={createUserMutation.isPending}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                If empty, the user will be created with temporary password: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">TemporaryPassword123!</code>
                            </p>
                        </div>

                        {/* Roles Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Assign Roles
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => toggleRole(role.name)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                            selectedRoles.includes(role.name)
                                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                                : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
                                        }`}
                                    >
                                        {role.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {submitError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{submitError}</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex gap-4 justify-end pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={createUserMutation.isPending}
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createUserMutation.isPending}
                                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                            >
                                {createUserMutation.isPending ? "Creating..." : "Create User"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
