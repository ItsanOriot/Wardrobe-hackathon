from fastapi import APIRouter, HTTPException, Header
from app.models.schemas import UserSignup, UserLogin, AuthResponse
from app.services.supabase_service import supabase_service

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/signup", response_model=AuthResponse)
async def signup(user: UserSignup):
    """Create a new user account."""
    try:
        response = supabase_service.sign_up(user.email, user.password)

        if not response.user:
            raise HTTPException(status_code=400, detail="Failed to create account")

        # Handle case where email confirmation is required (session will be None)
        if response.session is None:
            raise HTTPException(
                status_code=400,
                detail="Email confirmation required. Please check your email to verify your account."
            )

        return AuthResponse(
            access_token=response.session.access_token,
            user_id=response.user.id
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup error: {str(e)}")
        print(f"Error type: {type(e)}")
        raise HTTPException(status_code=400, detail=f"Signup failed: {str(e)}")

@router.post("/login", response_model=AuthResponse)
async def login(user: UserLogin):
    """Sign in an existing user."""
    try:
        response = supabase_service.sign_in(user.email, user.password)

        if not response.user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if response.session is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return AuthResponse(
            access_token=response.session.access_token,
            user_id=response.user.id
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {str(e)}")
        print(f"Error type: {type(e)}")
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")

@router.post("/logout")
async def logout():
    """Sign out the current user."""
    # In a stateless JWT system, logout is handled client-side by removing the token
    return {"message": "Logged out successfully"}

@router.get("/me")
async def get_current_user(authorization: str = Header(...)):
    """Get current user information."""
    try:
        # Extract token from "Bearer <token>"
        token = authorization.replace("Bearer ", "")
        response = supabase_service.get_user(token)

        if not response.user:
            raise HTTPException(status_code=401, detail="Invalid token")

        return {"user_id": response.user.id, "email": response.user.email}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
