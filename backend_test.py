#!/usr/bin/env python3
"""
Backend API Testing for Recipe Sharing App
Tests all CRUD operations and API endpoints
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

class RecipeAPITester:
    def __init__(self, base_url: str = "https://2cc2dd94-8ae5-488d-b92d-5c82cbe0e7de.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_recipe_ids = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED {details}")
        else:
            print(f"❌ {name} - FAILED {details}")

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Optional[Dict[str, Any]] = None, params: Optional[Dict[str, str]] = None) -> tuple:
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}
        
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}

            details = f"(Status: {response.status_code})"
            if not success:
                details += f" - Expected {expected_status}, Response: {response.text[:200]}"
            
            self.log_test(name, success, details)
            return success, response_data, response.status_code

        except Exception as e:
            self.log_test(name, False, f"- Error: {str(e)}")
            return False, {}, 0

    def test_health_check(self):
        """Test the health check endpoint"""
        success, data, _ = self.run_test(
            "Health Check",
            "GET",
            "",
            200
        )
        return success and "message" in data

    def test_get_all_recipes(self):
        """Test getting all recipes"""
        success, data, _ = self.run_test(
            "Get All Recipes",
            "GET", 
            "recipes",
            200
        )
        if success:
            print(f"   Found {len(data)} recipes")
            return True, data
        return False, []

    def test_create_recipe(self, recipe_data: Dict[str, Any]):
        """Test creating a new recipe"""
        success, data, _ = self.run_test(
            "Create Recipe",
            "POST",
            "recipes", 
            200,
            data=recipe_data
        )
        if success and "id" in data:
            recipe_id = data["id"]
            self.created_recipe_ids.append(recipe_id)
            print(f"   Created recipe with ID: {recipe_id}")
            return True, recipe_id, data
        return False, None, {}

    def test_get_single_recipe(self, recipe_id: str):
        """Test getting a single recipe by ID"""
        success, data, _ = self.run_test(
            "Get Single Recipe",
            "GET",
            f"recipes/{recipe_id}",
            200
        )
        return success, data

    def test_update_recipe(self, recipe_id: str, update_data: Dict[str, Any]):
        """Test updating a recipe"""
        success, data, _ = self.run_test(
            "Update Recipe",
            "PUT",
            f"recipes/{recipe_id}",
            200,
            data=update_data
        )
        return success, data

    def test_search_recipes(self, search_term: str):
        """Test searching recipes"""
        success, data, _ = self.run_test(
            f"Search Recipes ('{search_term}')",
            "GET",
            "recipes",
            200,
            params={"search": search_term}
        )
        if success:
            print(f"   Found {len(data)} recipes matching '{search_term}'")
        return success, data

    def test_delete_recipe(self, recipe_id: str):
        """Test deleting a recipe"""
        success, data, _ = self.run_test(
            "Delete Recipe",
            "DELETE",
            f"recipes/{recipe_id}",
            200
        )
        if success and recipe_id in self.created_recipe_ids:
            self.created_recipe_ids.remove(recipe_id)
        return success

    def test_error_cases(self):
        """Test error handling"""
        print("\n🔍 Testing Error Cases...")
        
        # Test getting non-existent recipe
        success, _, status = self.run_test(
            "Get Non-existent Recipe",
            "GET",
            "recipes/non-existent-id",
            404
        )
        
        # Test updating non-existent recipe
        success2, _, status2 = self.run_test(
            "Update Non-existent Recipe", 
            "PUT",
            "recipes/non-existent-id",
            404,
            data={"title": "Updated Title"}
        )
        
        # Test deleting non-existent recipe
        success3, _, status3 = self.run_test(
            "Delete Non-existent Recipe",
            "DELETE", 
            "recipes/non-existent-id",
            404
        )
        
        return success and success2 and success3

    def cleanup_created_recipes(self):
        """Clean up any recipes created during testing"""
        print(f"\n🧹 Cleaning up {len(self.created_recipe_ids)} created recipes...")
        for recipe_id in self.created_recipe_ids.copy():
            self.test_delete_recipe(recipe_id)

    def run_comprehensive_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Recipe Sharing App Backend API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)

        # Test 1: Health Check
        if not self.test_health_check():
            print("❌ Health check failed - stopping tests")
            return False

        # Test 2: Get existing recipes
        success, existing_recipes = self.test_get_all_recipes()
        if not success:
            print("❌ Failed to get recipes - stopping tests")
            return False

        print(f"📊 Found {len(existing_recipes)} existing recipes in database")

        # Test 3: Create a new recipe
        test_recipe = {
            "title": "Test Recipe for API Testing",
            "description": "A test recipe created during API testing",
            "ingredients": [
                "1 cup test ingredient",
                "2 tbsp testing powder",
                "1 pinch of validation"
            ],
            "instructions": [
                "Mix all test ingredients",
                "Validate the mixture",
                "Serve with confidence"
            ],
            "cooking_time": "5 minutes",
            "difficulty": "Easy",
            "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
        }

        create_success, recipe_id, created_recipe = self.test_create_recipe(test_recipe)
        if not create_success:
            print("❌ Failed to create recipe - stopping tests")
            return False

        # Test 4: Get the created recipe
        get_success, retrieved_recipe = self.test_get_single_recipe(recipe_id)
        if not get_success:
            print("❌ Failed to retrieve created recipe")
            return False

        # Validate created recipe data
        if retrieved_recipe.get("title") == test_recipe["title"]:
            print("✅ Recipe data validation - PASSED")
        else:
            print("❌ Recipe data validation - FAILED")

        # Test 5: Update the recipe
        update_data = {
            "title": "Updated Test Recipe",
            "difficulty": "Medium",
            "cooking_time": "10 minutes"
        }
        
        update_success, updated_recipe = self.test_update_recipe(recipe_id, update_data)
        if update_success:
            if updated_recipe.get("title") == "Updated Test Recipe":
                print("✅ Recipe update validation - PASSED")
            else:
                print("❌ Recipe update validation - FAILED")

        # Test 6: Search functionality
        search_success, search_results = self.test_search_recipes("Test Recipe")
        if search_success:
            found_our_recipe = any(r.get("id") == recipe_id for r in search_results)
            if found_our_recipe:
                print("✅ Search functionality validation - PASSED")
            else:
                print("❌ Search functionality validation - FAILED")

        # Test 7: Search with different terms
        self.test_search_recipes("chocolate")
        self.test_search_recipes("pancake")
        self.test_search_recipes("nonexistent")

        # Test 8: Error cases
        self.test_error_cases()

        # Test 9: Verify recipes count increased
        success, final_recipes = self.test_get_all_recipes()
        if success:
            if len(final_recipes) == len(existing_recipes) + 1:
                print("✅ Recipe count validation - PASSED")
            else:
                print(f"❌ Recipe count validation - FAILED (Expected {len(existing_recipes) + 1}, got {len(final_recipes)})")

        # Test 10: Delete the test recipe
        delete_success = self.test_delete_recipe(recipe_id)
        
        # Test 11: Verify recipe was deleted
        if delete_success:
            success, final_recipes_after_delete = self.test_get_all_recipes()
            if success and len(final_recipes_after_delete) == len(existing_recipes):
                print("✅ Recipe deletion validation - PASSED")
            else:
                print("❌ Recipe deletion validation - FAILED")

        # Cleanup any remaining test recipes
        self.cleanup_created_recipes()

        return True

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%" if self.tests_run > 0 else "No tests run")
        
        if self.tests_passed == self.tests_run:
            print("🎉 ALL TESTS PASSED! Backend API is working correctly.")
            return True
        else:
            print("⚠️  Some tests failed. Please check the backend implementation.")
            return False

def main():
    """Main test execution"""
    tester = RecipeAPITester()
    
    try:
        success = tester.run_comprehensive_tests()
        all_passed = tester.print_summary()
        return 0 if all_passed else 1
        
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
        tester.cleanup_created_recipes()
        return 1
    except Exception as e:
        print(f"\n❌ Unexpected error during testing: {str(e)}")
        tester.cleanup_created_recipes()
        return 1

if __name__ == "__main__":
    sys.exit(main())