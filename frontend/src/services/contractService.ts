import { api } from "../lib/axios";

export interface Contract {
  id: string;
  loan_id: string;
  object_key: string;
  original_file_name: string;
  mime_type: string;
  size: number;
  signing_date: string;
  created_at: string;
}

export const getContractsByLoan = async (loanId: string): Promise<Contract[]> => {
  const response = await api.get<{ data: Contract[] }>(`/dashboard/contracts/loan/${loanId}`);
  return response.data.data;
};

export const uploadContract = async (
  loanId: string,
  file: File,
  signingDate: string,
): Promise<Contract> => {
  const formData = new FormData();
  formData.append("loan_id", loanId);
  formData.append("file", file);
  formData.append("signing_date", signingDate);

  const response = await api.post<{ data: Contract }>("/dashboard/contracts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

/**
 * Download flow using presigned URLs:
 *  1. Ask the API for a short-lived MinIO presigned URL
 *  2. Fetch that URL as a blob IN THE BACKGROUND (no browser tab redirect)
 *  3. Create a local object URL and click a hidden <a> to trigger save-dialog
 *
 * The browser never navigates to MinIO — the user just sees a download.
 */
export const downloadContract = async (
  contractId: string,
  filename: string,
): Promise<void> => {
  // Step 1: get the presigned URL from our API
  const { data } = await api.get<{ url: string; filename: string }>(
    `/dashboard/contracts/${contractId}/download`,
  );

  // Step 2: fetch the actual file from MinIO as a blob (background, no navigation)
  const blobResponse = await fetch(data.url);
  if (!blobResponse.ok) {
    throw new Error(`Failed to download file: ${blobResponse.statusText}`);
  }
  const blob = await blobResponse.blob();

  // Step 3: trigger the browser's save-dialog
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.setAttribute("download", data.filename || filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(objectUrl);
};
