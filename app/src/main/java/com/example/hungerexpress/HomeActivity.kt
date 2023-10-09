package com.example.hungerexpress

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.bottomnavigation.BottomNavigationView

class HomeActivity : AppCompatActivity() {

    private lateinit var bottomNavigationView: BottomNavigationView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        // Initialize BottomNavigationView
        bottomNavigationView = findViewById(R.id.bottomNavigationView)

        // Set up the listener for BottomNavigationView
        bottomNavigationView.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.homeItem -> {
                    // Handle home action
                    true
                }
                R.id.restaurantsItem -> {
                    // Handle restaurants action
                    true
                }
                R.id.ordersItem -> {
                    // Handle orders action
                    true
                }
                R.id.profileItem -> {
                    // Handle profile action
                    true
                }
                else -> false
            }
        }
    }
}
