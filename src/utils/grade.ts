export const getGradeLabel = (grade: string) => {
  switch (grade) {
    case "H":
      return "만족"
    case "M":
      return "보통"
    case "L":
      return "불만족"
    default:
      return ""
  }
}
