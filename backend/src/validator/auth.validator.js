// SIGNUP VALIDATION
export const validateSignup = (data) => {
  const { name, email, phone, gender, password } = data;
  let errors = [];

  if (!name) errors.push("Name is required");
  if (!email) errors.push("Email is required");

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.push("Invalid email format");
  }

  if (!phone) errors.push("Phone is required");

  if (!gender) {
    errors.push("Gender is required");
  } else if (!["male", "female", "other"].includes(gender)) {
    errors.push("Gender must be male, female, or other");
  }

  if (!password) errors.push("Password is required");
  if (password && password.length < 6)
    errors.push("Password must be at least 6 characters");

  return errors;
};



// LOGIN VALIDATION (FIXED)
export const validateLogin = (data) => {
  const { email, password } = data;   
  const errors = [];

  if (!email) {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.push("Invalid email format");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return errors;
};
