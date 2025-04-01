export interface TermsItem {
  terms_idx: string
  terms_version: string
  terms_category_idx: string
  terms_title: string
  terms_sub_title: string
  terms_content: string
  terms_reg_date: string
  is_use: string
}

export interface TermsCategory {
  terms_category_idx: string
  terms_category_name: string
  is_required: string
  terms_list: TermsItem[]
}

export interface TermsResponse {
  terms: TermsCategory[]
}
