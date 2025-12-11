from passlib.context import CryptContext

# Use bcrypt_sha256 to safely support arbitrarily long passwords.
# passlib will first SHA-256 the secret, then apply bcrypt.
pwd_context = CryptContext(
  schemes=["pbkdf2_sha256"],
  deprecated="auto",
)

def hash_password(password: str) -> str: 
  return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

