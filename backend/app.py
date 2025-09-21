from flask import Flask, jsonify

app = Flask(__name__)

# Our first API endpoint
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