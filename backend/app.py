from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

# Replace the simple CORS(app) with this more specific configuration
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})


students = ["Sabarinathan", "Priya", "Amit"]

@app.route("/api/students", methods=['GET'])
def get_students():
    return jsonify(students)

@app.route("/api/students", methods=['POST'])
def add_student():
    new_student_data = request.get_json()
    if 'name' in new_student_data:
        students.append(new_student_data['name'])
    return jsonify({"success": True, "students": students})

@app.route("/api/students/<string:name>", methods=['DELETE'])
def delete_student(name):
    global students
    students = [student for student in students if student != name]
    return jsonify({"success": True, "students": students})

if __name__ == '__main__':
    app.run(debug=True)