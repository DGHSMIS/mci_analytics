export interface VerificationInfoInterface {
  id: string; // BigInt converted to string for serialization
  client_id: string;
  client_name?: string;
  performer_id: string;
  nid_requested?: string;
  nid_10_digit?: string;
  nid_17_digit?: string;
  nid_photo?: string;
  brn?: string;
  dob?: string;
  mobile?: string;
  info_hash: string;
  token: string;
  received_at: Date;
  generated_at: Date;
  time_took_ms?: number;
  aes_key_salt?: string;
  request_doc_type: "NID" | "BRN";
}