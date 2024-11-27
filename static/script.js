// PDF Viewer Setup (Left Panel)
const pdfViewerContainer = document.getElementById('pdfViewer');
const pdfjsLib = window['pdfjs-dist/build/pdf'];

// Path to the uploaded PDF file (replace with actual file upload logic)
// const pdfUrl = '/static/uploads/sample.pdf'; // Adjust path dynamically

// // Load and render the PDF
// pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
//     for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//         pdf.getPage(pageNum).then(page => {
//             const canvas = document.createElement('canvas');
//             const context = canvas.getContext('2d');
//             pdfViewerContainer.appendChild(canvas);

//             const viewport = page.getViewport({ scale: 1.0 });
//             canvas.width = viewport.width;
//             canvas.height = viewport.height;

//             page.render({
//                 canvasContext: context,
//                 viewport: viewport
//             });
//         });
//     }
// }).catch(err => {
//     pdfViewerContainer.innerText = `Error loading PDF: ${err.message}`;
// });

// Initialize Quill.js editor
const quill = new Quill('#quillEditor', {
  theme: 'snow',
  placeholder: 'Start typing your draft...',
  modules: {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['bold', 'italic', 'underline'],
      ['link'],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['clean']
    ]
  }
});

// Backend Integration for Autocomplete and Rewrite
async function fetchLLMResponse(endpoint, inputText) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: inputText })
        });
        const data = await response.json();
        return data.suggestion;
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        return 'Error fetching response.';
    }
}

// Autocomplete Function
document.getElementById('autocompleteBtn').addEventListener('click', async () => {
    const editorContent = quill.getText().trim();  // Use 'quill' instead of 'quillEditor'
    const suggestion = await fetchLLMResponse('/autocomplete', editorContent);
    quill.insertText(quill.getSelection().index, suggestion);  // Use 'quill' here as well
});

// Rewrite Function
document.getElementById('rewriteBtn').addEventListener('click', async () => {
    const selectedText = quill.getText(  // Corrected to use 'quill'
        quill.getSelection().index,
        quill.getSelection().length
    ).trim();

    if (!selectedText) {
        alert('Please select text to rewrite.');
        return;
    }

    const rewrittenText = await fetchLLMResponse('/rewrite', selectedText);
    quill.deleteText(  // Corrected to use 'quill'
        quill.getSelection().index,
        quill.getSelection().length
    );
    quill.insertText(quill.getSelection().index, rewrittenText);  // Corrected to use 'quill'
});


// Save Draft Functionality
document.getElementById('saveDraftBtn').addEventListener('click', () => {
    const draftContent = quill.root.innerHTML;  // Corrected to use 'quill'
    // Send draftContent to your backend for saving
    console.log('Draft saved:', draftContent);
});



// File Upload Logic
document.getElementById('uploadFileBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];


    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const fileURL = URL.createObjectURL(file);
        loadPdf(fileURL);  // Call loadPdf function with the selected file URL
    } else {
        console.log("No file selected.");
    }


    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (response.ok) {
            // alert('File uploaded successfully!');
            // Load the uploaded PDF in the viewer
            loadPdf(data.file_path);
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file.');
    }
});

// Function to load the PDF into the viewer
function loadPdf(pdfUrl) {
    const pdfViewerContainer = document.getElementById('pdfViewer');
    pdfViewerContainer.innerHTML = ''; // Clear previous content

    // Create and show the loading spinner
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    pdfViewerContainer.appendChild(spinner);    

    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {

        // Remove the spinner once the PDF is loaded
        spinner.remove();

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then(page => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                pdfViewerContainer.appendChild(canvas);

                const viewport = page.getViewport({ scale: 1.0 });
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                page.render({
                    canvasContext: context,
                    viewport: viewport
                });
            });
        }
    }).catch(err => {
        pdfViewerContainer.innerText = `Error loading PDF: ${err.message}`;
    });
}
