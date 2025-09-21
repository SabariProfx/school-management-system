from flask import Flask

# Create an instance of the Flask application
app = Flask(__name__)

# Define a route for the homepage
@app.route('/')
def home():
    return "Hello, World!"

# This block allows us to run the app directly
if __name__ == '__main__':
    app.run(debug=True)