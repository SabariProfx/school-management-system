from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def __init__(self, name):
        self.name = name

# Note: The db.create_all() command is no longer needed here
# because we ran it once to create the table.

# --- NEW API ENDPOINTS USING THE DATABASE ---

@app.route("/api/students", methods=['GET'])
def get_students():
    # Query all students from the database
    students = Student.query.all()
    # Convert the list of Student objects into a list of dictionaries
    result = [{"id": student.id, "name": student.name} for student in students]
    return jsonify(result)

@app.route("/api/students", methods=['POST'])
def add_student():
    data = request.get_json()
    new_student = Student(name=data['name'])
    # Add the new student to the database session
    db.session.add(new_student)
    # Commit the session to save the changes permanently
    db.session.commit()
    return jsonify({"success": True, "message": "Student added successfully."})

@app.route("/api/students/<int:student_id>", methods=['DELETE'])
def delete_student(student_id):
    # Find the student by their unique ID
    student = Student.query.get(student_id)
    if student is None:
        return jsonify({"success": False, "message": "Student not found."}), 404
    
    # Delete the student from the database session and commit
    db.session.delete(student)
    db.session.commit()
    return jsonify({"success": True, "message": "Student deleted successfully."})

if __name__ == '__main__':
    app.run(debug=True)