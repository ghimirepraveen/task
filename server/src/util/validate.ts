import CustomError from "../error/custome.error";

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    throw new CustomError("Invalid email format", 400);
}

export function validatePassword(password: string) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password))
    throw new CustomError(
      "Password must contain at least 8 characters, one letter and one number",
      400
    );
}
