from clarifai.client.model import Model

# Replace this with your actual Clarifai Personal Access Token
CLARIFAI_PAT = "fddbe681d2b642278c566e49131497c3"

# Clarifai model URL for food item recognition
MODEL_URL = "https://clarifai.com/clarifai/main/models/food-item-recognition"

model = Model(url=MODEL_URL, pat=CLARIFAI_PAT)

def get_food_tags(image_url, confidence_threshold=0.8):
    """
    Use Clarifai model to predict food tags from an image URL.
    """
    prediction = model.predict_by_url(image_url)
    concepts = prediction.outputs[0].data.concepts
    food_names = [concept.name for concept in concepts if concept.value >= confidence_threshold]
    return food_names


def get_food_tags_from_bytes(image_bytes, confidence_threshold=0.8):
    """
    Use Clarifai model to predict food tags from raw image bytes.
    """
    prediction = model.predict_by_bytes(image_bytes)
    concepts = prediction.outputs[0].data.concepts
    food_names = [concept.name for concept in concepts if concept.value >= confidence_threshold]
    return food_names
