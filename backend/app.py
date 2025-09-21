from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Initialize CORS and allow requests from any origin

@app.route("/api/users")
def get_users():
    # This is a Python dictionary
    sample_users = {
        "students": ["Sabarinathan", "Priya", "Amit"],
        "teachers": ["Mr. Sharma", "Ms. Devi"]
    }
    # jsonify converts our dictionary into a proper JSON response
    return jsonify(sample_users)

if __name__ == '__main__':
    app.run(debug=True)