import { useStaticGetRequest } from "../../../../../hooks/useStaticGetRequest";

export interface RawCashioSubmission {
  selfReportedAddress: string;
  submissionIsValid: string;
  submissionInvalidReason: string;
  owner?: string;
  ethAddress: string;
  originalWallet: string;
  ownershipTxSig: string;
  provenanceTxSig: string;
  balance?: string;
  source: string;
  messageText: string;
  signatureIsVerified: string;
  rawMessage: string;
  rawSignature: string;
  submissionID: string;
}

export const useAllSubmissions = () => {
  return useStaticGetRequest<readonly RawCashioSubmission[]>(
    `https://raw.githubusercontent.com/cashioapp/cashio-hack-index/master/data/all-submissions.json`
  );
};

export const useCashioHackReview = () => {
  return useStaticGetRequest<
    Readonly<
      Record<
        string,
        {
          reason: string;
          decision: string;
          over100K: boolean | null;
          estimatedDollarValue: number | null;
        }
      >
    >
  >(
    `https://raw.githubusercontent.com/cashioapp/cashio-hack-index/master/data/review.json`
  );
};

export const useSubmission = (owner: string) => {
  return useStaticGetRequest<RawCashioSubmission>(
    `https://raw.githubusercontent.com/cashioapp/cashio-hack-index/master/data/submissions/${owner}.json`
  );
};
