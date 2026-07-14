export function getRelativeTime(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}분 전`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}시간 전`
    const days = Math.floor(hours / 24)
    if (days === 1) return "어제"
    if (days < 7) return `${days}일 전`
    const date = new Date(isoDate)
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
}
