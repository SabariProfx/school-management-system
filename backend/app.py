from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, JWTManager, jwt_required
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# --- CONFIGURATION ---
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'a-long-random-secret-string-nobody-can-guess'

# --- INITIALIZE EXTENSIONS ---
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# --- DATABASE MODELS ---
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    def __init__(self, name): self.name = name

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def __init__(self, username, password, email):
        self.username = username
        self.email = email
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

# --- AUTHENTICATION API ENDPOINTS ---
@app.route("/api/register", methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password or not email:
        return jsonify({"error": "Username, email, and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    new_user = User(username=username, password=password, email=email)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "message": "User created successfully."}), 201

@app.route("/api/login", methods=['POST'])
def login_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    return jsonify({"error": "Invalid username or password"}), 401

# --- PROTECTED API ENDPOINTS ---
@app.route("/api/students", methods=['GET'])
@jwt_required()
def get_students():
    students = Student.query.all()
    result = [{"id": student.id, "name": student.name} for student in students]
    return jsonify(result)

@app.route("/api/students", methods=['POST'])
@jwt_required()
def add_student():
    data = request.get_json()
    new_student = Student(name=data['name'])
    db.session.add(new_student)
    db.session.commit()
    return jsonify({"success": True, "message": "Student added successfully."})

@app.route("/api/students/<int:student_id>", methods=['DELETE'])
@jwt_required()
def delete_student(student_id):
    student = Student.query.get(student_id)
    if student is None:
        return jsonify({"success": False, "message": "Student not found."}), 404
    db.session.delete(student)
    db.session.commit()
    return jsonify({"success": True, "message": "Student deleted successfully."})

# This ensures the tables are created based on your models
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)