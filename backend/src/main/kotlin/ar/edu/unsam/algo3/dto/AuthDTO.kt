package ar.edu.unsam.algo3.dto

data class LoginRequest(
    val usuario: String,
    val password: String
)

data class RegisterRequest(
    val usuario: String,
    val password: String,
    val confirmarPassword: String
)

data class AuthResponse(
    val success: Boolean,
    val message: String,
    val usuario: String? = null,
    val idLocal: Int? = null
)



