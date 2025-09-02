export interface UserSchema {
  id: string;
  name: string;
  level?: string;
  level_name?: string;
  email: string;
  hp: string;
  post: string;
  addr1: string;
  addr2: string;
  marketing_yn: string;
  points: string;
  profileURL?: string;
  thirdPartyType: string;
  sex: 'M' | 'F';
  birthdate: string;
  brands: {
    b_idx: string;
    b_name: string;
    addr: string;
    brand_code?: string;
  }[];
  member_connect_yn: 'Y' | 'N';
}
