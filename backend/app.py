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

# --- API ENDPOINTS ---
@app.route("/api/register", methods=['POST'])
def register_user():
    data = request.get_json()
    institute_id = data.get('institute_id')
    unique_id = data.get('unique_id')
    dob = data.get('dob')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    if not all([institute_id, unique_id, dob, email, username, password]):
        return jsonify({"error": "All fields are required"}), 400
    pre_approved = PreApprovedUser.query.filter_by(institute_id=institute_id, unique_id=unique_id, dob=dob, email=email).first()
    if not pre_approved:
        return jsonify({"error": "Verification failed. The details provided do not match our records for the selected institute."}), 403
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account for this email has already been registered."}), 409
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "That username is already taken. Please choose another."}), 409
    new_user = User(username=username, password=password, email=email, role=pre_approved.role, institute_id=institute_id)
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

with app.app_context():
    db.create_all()
    if not Institute.query.filter_by(name="Delhi Public School").first():
        dps = Institute(name="Delhi Public School")
        db.session.add(dps)
        db.session.commit()

if __name__ == '__main__':
    app.run(debug=True)