package com.example.hungerexpress

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("user/login")
    fun loginUser(@Body credentials: LoginRequest): Call<LoginResponse>
}

data class LoginRequest(val email: String, val password: String)
data class LoginResponse(val token: String, val user: User)
data class User(val id: String, val email: String, val firstName: String, val lastName: String)
