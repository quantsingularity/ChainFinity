"""
Unit tests for authentication service
"""

from typing import Any

import pytest
from services.auth.password_service import PasswordService


class TestAuthService:
    """Test cases for AuthService - password-related tests that do not require a database."""

    @pytest.fixture
    def password_service(self) -> Any:
        return PasswordService()

    def test_password_hashing(self, password_service: Any) -> Any:
        """Test password hashing and verification"""
        password = "TestPassword123!"
        hashed = password_service.hash_password(password)
        assert hashed != password
        assert password_service.verify_password(password, hashed)
        assert not password_service.verify_password("wrongpassword", hashed)

    def test_password_strength_validation(self, password_service: Any) -> Any:
        """Test password strength validation"""
        valid_passwords = ["TestPassword123!", "MySecure@Pass1", "Complex#Password9"]
        for password in valid_passwords:
            password_service._validate_password_strength(password)
        invalid_passwords = [
            "short",
            "nouppercase123!",
            "NOLOWERCASE123!",
            "NoNumbers!",
            "NoSpecialChars123",
        ]
        for password in invalid_passwords:
            with pytest.raises(ValueError):
                password_service._validate_password_strength(password)
