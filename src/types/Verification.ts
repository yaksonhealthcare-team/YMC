export interface DecryptRequest {
  token_version_id: string
  enc_data: string
  integrity_value: string
}

export interface VerificationData {
  type: "PASS_VERIFICATION_DATA"
  data: {
    token_version_id: string
    enc_data: string
    integrity_value: string
    userData: unknown
  }
}

export interface VerificationError {
  type: "PASS_VERIFICATION_FAILED"
  error: string
} 