from flask import Flask, jsonify, request # Import 'request'
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# We'll simplify our data for now to just a list of students
students = ["Sabarinathan", "Priya", "Amit"]

# This endpoint GETs the list of all students
@app.route("/api/students", methods=['GET'])
def get_students():
    return jsonify(students)

# This endpoint POSTs a new student to the list
@app.route("/api/students", methods=['POST'])
def add_student():
    # Get the data sent from the frontend
    new_student_data = request.get_json()
    
    # Add the new student's name to our list
    students.append(new_student_data['name'])
    
    # Return a success message along with the updated list
    return jsonify({"success": True, "students": students})

if __name__ == '__main__':
    app.run(debug=True)