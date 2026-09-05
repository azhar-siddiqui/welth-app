export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const formatPrice = (
  value: number,
  currency: string = "INR",
): string => {
  const locale = currency === "INR" ? "en-IN" : undefined;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};
