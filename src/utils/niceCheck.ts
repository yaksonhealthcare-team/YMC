import { EncryptData } from "../apis/pass.api"

export const checkByNice = async (data: EncryptData) => {
  const form = document.createElement("form")
  form.method = "post"
  form.action = "https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb"

  const fields = {
    m: data.m,
    token_version_id: data.token_version_id,
    enc_data: data.enc_data,
    integrity_value: data.integrity_value,
  }

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input")
    input.type = "hidden"
    input.name = key
    input.value = value
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
