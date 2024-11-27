import os
from flask import Flask, request, jsonify, send_from_directory, render_template
from werkzeug.utils import secure_filename
from utils.unstructured_pdf import unstructured_pdf
# from agents.agent_technical import extract_technical_requirements
import traceback


# Flask app setup
app = Flask(__name__)

# Configuration for file uploads
UPLOAD_FOLDER = './static/uploads'
ALLOWED_EXTENSIONS = {'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Routes
@app.route('/')
def extract_page():
    return render_template('extract.html')  # Ensure `index.html` is in the templates folder


@app.route('/drafting', methods=['GET'])
def drafting_page():
    return render_template('index.html')


# @app.route('/extract', methods=['GET'])
# def extract_page():
#     return render_template('extract.html')



# File upload endpoint
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({'message': 'File uploaded successfully', 'file_path': file_path}), 200

    return jsonify({'error': 'Invalid file type'}), 400


# PDF Processing Endpoint
@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    data = request.json
    if not data or 'filepath' not in data:
        return jsonify({'error': 'Filepath is missing from the request'}), 400

    filepath = data['filepath']
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    try:
        processed_text = unstructured_pdf(filepath)
        return jsonify({
            'processed_text': processed_text,
            'filename': os.path.basename(filepath),
            'word_count': len(processed_text.split())
        }), 200
    except Exception as e:
        print(f"Error: {str(e)}\nTraceback: {traceback.format_exc()}")
        return jsonify({'error': f'Failed to process PDF: {str(e)}'}), 500



@app.route('/extract-requirements', methods=['POST'])
def extract_requirements():
    data = request.json
    filepath = data.get('filepath')

    if not filepath or not os.path.exists(filepath):
        return jsonify({'error': 'Invalid or missing file path'}), 400

    try:
        # Simulating extracted technical requirements for testing
        technical_requirements = [
            {'requirement': 'Requirement 1: High availability of infrastructure'},
            {'requirement': 'Requirement 2: Data security compliance'},
            {'requirement': 'Requirement 3: Scalability to handle growth'},
        ]
        return jsonify({'requirements': technical_requirements}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# Autocomplete endpoint
@app.route('/autocomplete', methods=['POST'])
def autocomplete():
    data = request.get_json()
    input_text = data.get('input', '')

    # Mock LLM response (replace with actual LLM API call)
    suggestion = f"Autocompleted content for: {input_text}"
    return jsonify({'suggestion': suggestion})

# Rewrite endpoint
@app.route('/rewrite', methods=['POST'])
def rewrite():
    data = request.get_json()
    input_text = data.get('input', '')

    # Mock LLM response (replace with actual LLM API call)
    rewritten_text = f"Rewritten version of: {input_text}"
    return jsonify({'suggestion': rewritten_text})

# Endpoint to serve uploaded files
@app.route('/static/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
