from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt
from functools import wraps
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'a-long-random-secret-string-nobody-can-guess'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# --- DATABASE MODELS ---
class Institute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=False)
class PreApprovedUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unique_id = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    dob = db.Column(db.String(20), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    institute_id = db.Column(db.Integer, db.ForeignKey('institute.id'), nullable=False)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    institute_id = db.Column(db.Integer, db.ForeignKey('institute.id'), nullable=False)
    def __init__(self, username, password, email, role, institute_id):
        self.username = username
        self.email = email
        self.role = role
        self.institute_id = institute_id
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    def __init__(self, name): self.name = name

# --- Custom Decorator for Role Checking ---
def teacher_required():
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims.get("role") != "teacher":
                return jsonify(msg="Teachers only! Access forbidden."), 403
            else:
                return fn(*args, **kwargs)
        return decorator
    return wrapper

# --- API ENDPOINTS ---
@app.route("/api/register", methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    role = 'student'
    if not all([username, password, email]):
        return jsonify({"error": "Username, email, and password are required"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409
    # This assumes institute_id=1 for now, we can make this dynamic later
    new_user = User(username=username, password=password, email=email, role=role, institute_id=1)
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
        additional_claims = {"role": user.role}
        access_token = create_access_token(identity=username, additional_claims=additional_claims)
        return jsonify(access_token=access_token)
    return jsonify({"error": "Invalid username or password"}), 401

@app.route("/api/institutes", methods=['GET'])
def get_institutes():
    institutes = Institute.query.all()
    result = [{"id": institute.id, "name": institute.name} for institute in institutes]
    return jsonify(result)

@app.route("/api/upload_preapproved", methods=['POST'])
def upload_preapproved_users():
    data = request.get_json()
    users_to_upload = data.get('users')
    institute_name = data.get('institute_name')
    institute = Institute.query.filter_by(name=institute_name).first()
    if not institute:
        return jsonify({"error": f"Institute '{institute_name}' not found"}), 404
    count = 0
    for user_data in users_to_upload:
        exists = PreApprovedUser.query.filter_by(email=user_data['email']).first()
        if not exists:
            new_user = PreApprovedUser(unique_id=user_data['unique_id'], email=user_data['email'], dob=user_data['dob'], role=user_data['role'], institute_id=institute.id)
            db.session.add(new_user)
            count += 1
    db.session.commit()
    return jsonify({"success": True, "message": f"{count} new users added to the pre-approved list for {institute_name}."})

# --- PROTECTED API ENDPOINTS ---
@app.route("/api/students", methods=['GET'])
@teacher_required()
def get_students():
    students = Student.query.all()
    result = [{"id": student.id, "name": student.name} for student in students]
    return jsonify(result)

@app.route("/api/students", methods=['POST'])
@teacher_required()
def add_student():
    data = request.get_json()
    new_student = Student(name=data['name'])
    db.session.add(new_student)
    db.session.commit()
    return jsonify({"success": True, "message": "Student added successfully."})

@app.route("/api/students/<int:student_id>", methods=['DELETE'])
@teacher_required()
def delete_student(student_id):
    student = Student.query.get(student_id)
    if student is None:
        return jsonify({"success": False, "message": "Student not found."}), 404
    db.session.delete(student)
    db.session.commit()
    return jsonify({"success": True, "message": "Student deleted successfully."})

with app.app_context():
    db.create_all()
    if not Institute.query.filter_by(name="Delhi Public School").first():
        dps = Institute(name="Delhi Public School")
        db.session.add(dps)
        db.session.commit()

if __name__ == '__main__':
    app.run(debug=True)