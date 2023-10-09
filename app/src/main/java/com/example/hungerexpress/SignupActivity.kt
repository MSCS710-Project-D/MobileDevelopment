package com.example.hungerexpress

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.widget.Button
import android.widget.EditText
import android.widget.Spinner
import androidx.appcompat.app.AppCompatActivity

class SignupActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_signup)

        // Initialize EditTexts, Spinner, and Button
        val usernameEditText: EditText = findViewById(R.id.usernameEditText)
        val emailEditText: EditText = findViewById(R.id.emailEditText)
        val passwordEditText: EditText = findViewById(R.id.passwordEditText)
        val confirmPasswordEditText: EditText = findViewById(R.id.confirmPasswordEditText)
        val firstNameEditText: EditText = findViewById(R.id.firstNameEditText)
        val lastNameEditText: EditText = findViewById(R.id.lastNameEditText)
        val phoneEditText: EditText = findViewById(R.id.phoneEditText)
        val addressEditText: EditText = findViewById(R.id.addressEditText)
        val userTypeSpinner: Spinner = findViewById(R.id.userTypeSpinner)
        val signupButton: Button = findViewById(R.id.signupButton)

        // Add the TextWatcher to confirmPasswordEditText
        confirmPasswordEditText.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                if (passwordEditText.text.toString() != s.toString()) {
                    confirmPasswordEditText.error = "Passwords do not match!"
                }
            }

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })

        // Set click listener for the signup button
        signupButton.setOnClickListener {
            // Get user input
            val username = usernameEditText.text.toString()
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()
            val firstName = firstNameEditText.text.toString()
            val lastName = lastNameEditText.text.toString()
            val phone = phoneEditText.text.toString()
            val address = addressEditText.text.toString()
            val userType = userTypeSpinner.selectedItem.toString()

            // TODO: Handle the signup logic, e.g., send data to your API
        }
    }
}
