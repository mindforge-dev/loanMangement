import { useCallback, useMemo, useState } from "react";
import {
  getNrcStates,
  getNrcTownshipsByStateId,
  getNrcTypes,
  pattern,
  splitNrc,
} from "mm-nrc";
import type { Borrower, CreateBorrowerDto } from "../../../services/borrowerService";

interface NrcParts {
  stateId: string;
  stateCode: string;
  townshipCode: string;
  nrcType: string;
  number: string;
}

type BorrowerFormErrors = Partial<Record<keyof CreateBorrowerDto, string>>;

const getInitialFormData = (data?: Borrower | null): CreateBorrowerDto => ({
  full_name: data?.full_name || "",
  phone: data?.phone || "",
  email: data?.email || "",
  address: data?.address || "",
  nrc: data?.nrc || "",
});

export const NRC_STATES = getNrcStates().filter((state) =>
  /^\d+$/.test(state.number.en),
);

const ALLOWED_NRC_TYPES = ["N", "E", "P", "T", "R", "S"];
export const NRC_TYPES = Array.from(
  new Set([...getNrcTypes().map((type) => type.name.en), ...ALLOWED_NRC_TYPES]),
).filter((type): type is string => ALLOWED_NRC_TYPES.includes(type));

const parseNrc = (value?: string): NrcParts => {
  const emptyNrc: NrcParts = {
    stateId: "",
    stateCode: "",
    townshipCode: "",
    nrcType: "N",
    number: "",
  };

  if (!value) return emptyNrc;

  const raw = value
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase()
    .replace("(NAING)", "(N)");

  if (pattern.en.test(raw)) {
    const { stateNo, townshipCode, nrcType, nrcNumber } = splitNrc(raw);
    const matchedState = NRC_STATES.find((state) => state.number.en === stateNo);
    return {
      stateId: matchedState?.id || "",
      stateCode: stateNo,
      townshipCode,
      nrcType,
      number: nrcNumber,
    };
  }

  // Backward compatibility with old format: 12/N/123456
  const simpleMatch = raw.match(/^(\d{1,2})\/(N|E|P|T|R|S|NAING)\/(\d{1,6})$/);
  if (simpleMatch) {
    const stateCode = simpleMatch[1];
    const matchedState = NRC_STATES.find((state) => state.number.en === stateCode);
    return {
      stateId: matchedState?.id || "",
      stateCode,
      townshipCode: "",
      nrcType: simpleMatch[2] === "NAING" ? "N" : simpleMatch[2],
      number: simpleMatch[3],
    };
  }

  return emptyNrc;
};

const buildNrcRaw = ({ stateCode, townshipCode, nrcType, number }: NrcParts): string =>
  `${stateCode}/${townshipCode}(${nrcType})${number}`;

export const useBorrowerForm = (initialData?: Borrower | null) => {
  const [formData, setFormData] = useState<CreateBorrowerDto>(() =>
    getInitialFormData(initialData),
  );
  const [nrcParts, setNrcParts] = useState<NrcParts>(() =>
    parseNrc(initialData?.nrc),
  );
  const [errors, setErrors] = useState<BorrowerFormErrors>({});

  const townshipOptions = useMemo(() => {
    if (!nrcParts.stateId) return [];
    const townships = getNrcTownshipsByStateId(nrcParts.stateId);
    const map = new Map<string, string>();
    for (const township of townships) {
      if (!map.has(township.short.en)) {
        map.set(township.short.en, township.name.en);
      }
    }
    return Array.from(map, ([code, name]) => ({ code, name }));
  }, [nrcParts.stateId]);

  const nrcPreview = useMemo(() => buildNrcRaw(nrcParts), [nrcParts]);

  const borrowerDto = useMemo<CreateBorrowerDto>(
    () => ({ ...formData, nrc: nrcPreview }),
    [formData, nrcPreview],
  );

  const updateField = useCallback(
    (field: keyof CreateBorrowerDto, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const updateNrcState = useCallback(
    (stateCode: string) => {
      const matchedState = NRC_STATES.find((state) => state.number.en === stateCode);
      setNrcParts((prev) => ({
        ...prev,
        stateCode,
        stateId: matchedState?.id || "",
        townshipCode: "",
      }));
      if (errors.nrc) {
        setErrors((prev) => ({ ...prev, nrc: undefined }));
      }
    },
    [errors.nrc],
  );

  const updateNrcField = useCallback(
    <T extends keyof NrcParts>(field: T, value: NrcParts[T]) => {
      setNrcParts((prev) => ({ ...prev, [field]: value }));
      if (errors.nrc) {
        setErrors((prev) => ({ ...prev, nrc: undefined }));
      }
    },
    [errors.nrc],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: BorrowerFormErrors = {};

    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!nrcParts.stateId || !nrcParts.stateCode) {
      newErrors.nrc = "NRC state is required";
    } else if (!nrcParts.townshipCode) {
      newErrors.nrc = "NRC township is required";
    } else if (!ALLOWED_NRC_TYPES.includes(nrcParts.nrcType)) {
      newErrors.nrc = "NRC type is invalid";
    } else if (!/^\d{6}$/.test(nrcParts.number)) {
      newErrors.nrc = "NRC number must be exactly 6 digits";
    } else if (!pattern.en.test(nrcPreview)) {
      newErrors.nrc = "Invalid NRC format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, nrcParts, nrcPreview]);

  return {
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
  };
};
