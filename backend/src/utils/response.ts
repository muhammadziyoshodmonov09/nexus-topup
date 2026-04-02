/** API muvaffaqiyatli javob */
export function ok<T>(data: T) {
  return { success: true, data, error: null };
}

/** API xato javob */
export function fail(error: string, statusCode = 400) {
  return { success: false, data: null, error, statusCode };
}
