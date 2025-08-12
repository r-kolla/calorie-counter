import requests

EDAMAM_APP_ID = "77551e85"
EDAMAM_APP_KEY = "b46027db20592b4744b161c2d839149e"

def get_nutrition_from_parser(food_name, weight=100):
    parser_url = "https://api.edamam.com/api/food-database/v2/parser"
    params = {
        "app_id": EDAMAM_APP_ID,
        "app_key": EDAMAM_APP_KEY,
        "ingr": food_name,
        "nutrition-type": "logging"
    }
    r = requests.get(parser_url, params=params)
    data = r.json()

    if "parsed" in data and data["parsed"]:
        nutrients = data["parsed"][0]["food"]["nutrients"]
    elif "hints" in data and data["hints"]:
        nutrients = data["hints"][0]["food"]["nutrients"]
    else:
        return None

    # Adjust nutrients for weight
    factor = weight / 100
    return {
        "calories": nutrients.get("ENERC_KCAL", 0) * factor,
        "protein": nutrients.get("PROCNT", 0) * factor,
        "carbs": nutrients.get("CHOCDF", 0) * factor,
        "fat": nutrients.get("FAT", 0) * factor
    }


