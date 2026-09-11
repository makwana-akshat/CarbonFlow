import jwt
from jwt import PyJWKClient
from fastapi import HTTPException, status

def verify_clerk_token(token: str) -> dict:
    try:
        # Decode token without signature to get issuer
        unverified_headers = jwt.get_unverified_header(token)
        unverified_claims = jwt.decode(token, options={"verify_signature": False})
        
        issuer = unverified_claims.get("iss")
        if not issuer:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token: no issuer"
            )
            
        # Clerk publishes public JWKS at /.well-known/jwks.json of the issuer URL
        jwks_url = f"{issuer.rstrip('/')}/.well-known/jwks.json"
        jwks_client = PyJWKClient(jwks_url)
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        # Verify token signature and expiration
        data = jwt.decode(
            token,
            signing_key.key,
            algorithms=[unverified_headers.get("alg", "RS256")],
            issuer=issuer,
            options={"verify_signature": True, "verify_exp": True, "verify_aud": False}
        )
        return data
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication failed")
