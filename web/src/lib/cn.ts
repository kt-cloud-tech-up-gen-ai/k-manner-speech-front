type ClassValue = string | number | null | undefined | false | ClassValue[]

/** Minimal class joiner. No conflict resolution — order-last wins in CSS. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = []
  for (const v of values) {
    if (!v) continue
    if (Array.isArray(v)) {
      const nested = cn(...v)
      if (nested) out.push(nested)
    } else {
      out.push(String(v))
    }
  }
  return out.join(' ')
}
