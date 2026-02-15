from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from datetime import datetime
import os

app = Flask(__name__, static_folder='ticket-frontend/build', static_url_path='/')

# --- CONFIGURATION ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tickets.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'dev-secret-key-fix' # CHANGED KEY TO INVALIDATE OLD TOKENS

db = SQLAlchemy(app)
# Allow CORS for all domains and specifically allow the ngrok header
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# --- DEBUGGING HANDLERS (See why 422 happens) ---
@jwt.unauthorized_loader
def missing_token_callback(error_string):
    print(f"DEBUG: Missing Token: {error_string}")
    return jsonify({"msg": "Request does not contain an access token"}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error_string):
    print(f"DEBUG: Invalid Token: {error_string}") # <--- CHECK YOUR TERMINAL FOR THIS
    return jsonify({"msg": f"Invalid token: {error_string}"}), 422

# --- MODELS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='Open')
    priority = db.Column(db.String(20), default='Medium')
    category = db.Column(db.String(20), default='Support')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('tickets', lazy=True))

# --- ROUTES ---
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Username already exists"}), 400
    
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        # FIX: Convert ID to string to avoid JSON serialization issues in some JWT versions
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token, username=user.username), 200
    return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/api/tickets', methods=['GET'])
@jwt_required()
def get_tickets():
    # Helper to print who is accessing
    current_user_id = get_jwt_identity()
    print(f"DEBUG: Accessing tickets for User ID: {current_user_id}")
    
    tickets = Ticket.query.filter_by(user_id=int(current_user_id)).order_by(Ticket.created_at.desc()).all()
    return jsonify([{
        'id': t.id, 
        'title': t.title, 
        'description': t.description,
        'status': t.status,
        'priority': t.priority,
        'category': t.category,
        'created_at': t.created_at.strftime('%b %d, %I:%M %p')
    } for t in tickets])

@app.route('/api/tickets', methods=['POST'])
@jwt_required()
def create_ticket():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    new_ticket = Ticket(
        title=data['title'],
        description=data['description'],
        priority=data.get('priority', 'Medium'),
        category=data.get('category', 'Support'),
        user_id=int(current_user_id)
    )
    db.session.add(new_ticket)
    db.session.commit()
    return jsonify({"msg": "Ticket created"}), 201

@app.route('/api/tickets/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def manage_ticket(id):
    current_user_id = get_jwt_identity()
    ticket = Ticket.query.get_or_404(id)
    
    if ticket.user_id != int(current_user_id):
        return jsonify({"msg": "Unauthorized"}), 403
        
    if request.method == 'DELETE':
        db.session.delete(ticket)
        db.session.commit()
        return jsonify({"msg": "Deleted"}), 200
    else:
        data = request.get_json()
        if 'status' in data: ticket.status = data['status']
        db.session.commit()
        return jsonify({"msg": "Updated"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)