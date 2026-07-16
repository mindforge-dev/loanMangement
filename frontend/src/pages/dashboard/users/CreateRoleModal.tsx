import { useState, useMemo } from "react";
import { usePermissions, useCreateRole } from "../../../hooks/useUsers";

interface CreateRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

function titleCase(mod: string): string {
    return mod
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

export default function CreateRoleModal({
    isOpen,
    onClose,
    onSuccess,
}: CreateRoleModalProps) {
    const { data: permissions = [] } = usePermissions();
    const createRoleMutation = useCreateRole();

    const [name, setName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Group permissions by module prefix (e.g. "users:view" -> "users")
    const groupedPermissions = useMemo(() => {
        const map = new Map<string, string[]>();
        for (const p of permissions) {
            const [mod] = p.name.split(":");
            if (!map.has(mod)) map.set(mod, []);
            map.get(mod)!.push(p.name);
        }
        return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    }, [permissions]);

    const togglePermission = (permName: string) =>
        setSelectedPermissions((prev) =>
            prev.includes(permName)
                ? prev.filter((p) => p !== permName)
                : [...prev, permName],
        );

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setSubmitError("Role name is required");
            return;
        }
        setSubmitError(null);
        try {
            await createRoleMutation.mutateAsync({
                name: name.trim().toLowerCase(),
                permissions: selectedPermissions,
            });
            setName("");
            setSelectedPermissions([]);
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error("Failed to create role:", err);
            setSubmitError(err?.response?.data?.error?.message || "Failed to create role.");
        }
    };

    if (!isOpen) return null;

    const Chip = ({
        label,
        active,
        onClick,
    }: {
        label: string;
        active: boolean;
        onClick: () => void;
    }) => (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                active
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
            }`}
        >
            {label}
        </button>
    );

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
                    {/* Header */}
                    <div className="relative px-8 pt-8 pb-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                    Create New Role
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Define a new role and associate initial permissions.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                disabled={createRoleMutation.isPending}
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

                    <form onSubmit={handleSave} className="px-8 py-6 space-y-8">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Role Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. manager, accountant"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900"
                                disabled={createRoleMutation.isPending}
                                required
                            />
                        </div>

                        {/* Permissions selection */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-1">
                                Assign Permissions
                            </h3>
                            <p className="text-xs text-gray-400 mb-3">
                                Select the permissions that this role should grant.
                            </p>
                            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                                {groupedPermissions.map(([mod, perms]) => (
                                    <div key={mod}>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                            {titleCase(mod)}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {perms.map((pName) => {
                                                const action = pName.split(":")[1];
                                                return (
                                                    <Chip
                                                        key={pName}
                                                        label={action}
                                                        active={selectedPermissions.includes(pName)}
                                                        onClick={() => togglePermission(pName)}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                                disabled={createRoleMutation.isPending}
                                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createRoleMutation.isPending}
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {createRoleMutation.isPending ? "Creating..." : "Create Role"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
