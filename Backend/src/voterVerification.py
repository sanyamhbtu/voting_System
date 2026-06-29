import sys
import json
import face_recognition
import numpy as np
import requests
from PIL import Image
import io

def log(msg):
    sys.stderr.write(msg + "\n")

def verify_faces(stored_image_url, given_image_url):
    log("Fetching stored image...")
    stored_response = requests.get(stored_image_url)
    given_response = requests.get(given_image_url)

    if stored_response.status_code != 200 or given_response.status_code != 200:
        log("Failed to fetch one or both images.")
        return {"error": "Image fetch failed"}

    stored_image = np.array(Image.open(io.BytesIO(stored_response.content)).convert("RGB"))
    given_image = np.array(Image.open(io.BytesIO(given_response.content)).convert("RGB"))

    log("Extracting face encodings...")
    stored_encodings = face_recognition.face_encodings(stored_image)
    given_encodings = face_recognition.face_encodings(given_image)

    if not stored_encodings or not given_encodings:
        log("No face detected in one or both images.")
        return {"error": "No face detected"}

    distance = face_recognition.face_distance([stored_encodings[0]], given_encodings[0])[0]
    match = distance < 0.6  # Lower distance = better match

    result = {
        "match": bool(match),
        "confidence": float(round((1 - distance) * 100, 2))
    }
    log(f"Verification Result: {result}")
    return result

if __name__ == "__main__":
    if len(sys.argv) < 3:
        log("Usage: python voterVerification.py <stored_image_url> <given_image_url>")
        sys.exit(1)

    stored_image_url = sys.argv[1]
    given_image_url = sys.argv[2]
    
    # Print ONLY JSON to stdout
    print(json.dumps(verify_faces(stored_image_url, given_image_url)))