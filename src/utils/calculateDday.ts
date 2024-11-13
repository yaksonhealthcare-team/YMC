/**
 * 주어진 날짜와 현재 날짜 사이의 D-Day를 계산합니다.
 * 시간은 무시하고 날짜만 비교하여 계산됩니다.
 *
 * @param date - 목표 날짜
 * @returns 현재 날짜부터 목표 날짜까지 남은 일수.
 *          양수: 미래 날짜까지 남은 일수
 *          0: 당일
 *          음수: 이미 지난 날짜의 경우
 *
 * @example
 * // 3일 후 날짜를 전달
 * calculateDday(new Date('2024-03-16')); // returns 3
 *
 * // 이미 지난 날짜를 전달
 * calculateDday(new Date('2024-03-10')); // returns -3
 */
const calculateDday = (date: Date): number => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)

  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export default calculateDday
