const accentPalette = [
    "bg-[#ebd7cd]",
    "bg-[#b9d9cf]",
    "bg-[#efd59d]",
    "bg-[#d7c5ea]",
    "bg-[#e9c7a7]",
]

export function getInitials(name: string): string {
    return name.slice(0, 2)
}

export function getAccent(id: string): string {
    const hash = [...id].reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return accentPalette[hash % accentPalette.length]
}
