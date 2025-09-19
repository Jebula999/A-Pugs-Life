export const schema = {
  "Food": {
    "Liquids": { "options": ["Water", "Coffee", "Soda", "Milk"] },
    "Snacks": { "options": ["Biscuits", "Chocolate", "Chips"] },
    "Breakfast": { "options": ["Toast", "Weetbix", "Cereal"] },
    "Lunch": { "options": ["Toast", "Sandwich", "Protein"] },
    "Dinner": {
      "Main": { "options": ["Steak", "Chicken", "Veg", "Salad"] },
      "Takeout": { "options": ["McDonalds", "Burger King", "Chinese", "Pizza"] }
    }
  },
  "Sleep": {
    "Nap": {
      "Duration": {
        "options": ["1h", "2h", "3h", "4h"],
        "next": {
          "Dreams": {
            "Type": {
              "None": [],
              "Normal": ["Normal", "Scary", "Death"],
              "Real": ["Normal", "Scary", "Death"]
            },
            "Amount": ["One", "A Few", "A Lot"]
          }
        }
      }
    },
    "LastNight": {
      "Duration": {
        "options": ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h"],
        "next": {
          "Dreams": {
            "Type": {
              "None": [],
              "Normal": ["Normal", "Scary", "Death"],
              "Real": ["Normal", "Scary", "Death"]
            },
            "Amount": ["One", "A Few", "A Lot"]
          }
        }
      }
    }
  },
  "Mood": { "options": ["Joyful", "Content", "Neutral", "Irritable", "Low"] },
  "Energy": { "options": ["Very High", "High", "Medium", "Low", "Very Low", "None"] },
  "Activity": { "options": ["None", "Walk", "Run", "Gym", "Sports", "Yoga", "Other"] },
  "Symptoms": { "options": ["Headache", "Stomachache", "Fever", "Cough", "Fatigue", "Blindness", "Other"] },
  "HeartHealth": {
    "HeartRate": { "options": ["Low", "Normal", "High"] },
    "BloodPressure": { "options": ["Low", "Normal", "High"] },
    "ChestPain": { "options": ["None", "Mild", "Severe"] },
    "Palpitations": { "options": ["One", "A Few", "Too Many"] }
  },
  "Intimacy": { "options": ["Yes", "No"] }
};
