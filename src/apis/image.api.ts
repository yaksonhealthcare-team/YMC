import { axiosClient } from "../queries/clients.ts"

export interface FileUploadRequest {
  fileToUpload: File[]
  nextUrl: string
  isSignup?: "Y" | "N"
}

export interface FileUploadResponse {
  resultCode: string
  resultMessage: string
  resultCount: number
  files: {
    result: string
    filename: string
    fileurl: string
  }[]
}

/**
 * 이미지 업로드 API
 * @param request 업로드할 파일 정보
 * @returns 업로드된 이미지 URL 배열
 */
export const uploadImages = async (
  request: FileUploadRequest,
): Promise<string[]> => {
  const formData = new FormData()

  request.fileToUpload.forEach((file) => {
    formData.append(`fileToUpload[]`, file)
  })
  formData.append(
    "nextUrl",
    `${import.meta.env.VITE_API_BASE_URL}${request.nextUrl}`,
  )

  if (request.isSignup) {
    formData.append("isSignup", request.isSignup)
  }

  const { data } = await axiosClient.post<FileUploadResponse>(
    "/images/images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )

  // fileurl 배열로 변환
  return data.files.map((item) => item.fileurl)
}
