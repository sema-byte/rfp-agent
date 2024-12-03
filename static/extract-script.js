document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const uploadFileBtn = document.getElementById("uploadFileBtn");
    // const spinner = document.getElementById("spinner");
    const uploadExtractSection = document.getElementById('upload-extract');
    const ocrExtractSection = document.getElementById("ocr-extract");
    const ocrExtractBtn = document.getElementById("ocrExtractBtn");
    const requirementsTable = document.getElementById("requirementsTable");
    const requirementsList = document.getElementById("requirementsList");
    const noRequirementsMessage = document.getElementById("noRequirementsMessage");
    const goToDraftingButton = document.getElementById("go-to-drafting");

    let uploadedFile = null;
    let uploadedFilePath = null; // Store the path of the uploaded file

    // // Show spinner
    // function showSpinner() {
    //     spinner.classList.add("show");
    // }

    // // Hide spinner
    // function hideSpinner() {
    //     spinner.classList.remove("show");
    // }

    // Handle file selection
    fileInput.addEventListener("change", function (e) {
        uploadedFile = e.target.files[0];
        uploadFileBtn.disabled = !uploadedFile; // Enable or disable upload button based on file selection
    });

    // Handle file upload button click
    uploadFileBtn.addEventListener("click", function () {
        if (uploadedFile) {
            const spinner = document.createElement('div');
            spinner.classList.add('spinner');
            uploadExtractSection.appendChild(spinner);
            // showSpinner(); // Show loading spinner while processing the file
            
            

            // FormData to send file in the request
            const formData = new FormData();
            formData.append('file', uploadedFile);

            // Send the file to the backend (upload it)
            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then((data) => {
                if (data.file_path) {
                    uploadedFilePath = data.file_path; // Save file path
                    alert("File uploaded successfully!");
                    ocrExtractBtn.disabled = false; // Enable extraction button
                } else {
                    throw new Error("File upload failed.");
                }
            })
            .catch(error => {
                console.error(error);
                alert(error.message || "An error occurred.");
            })
            .finally(() => {
                // hideSpinner(); // Hide spinner after the process is done
                var delayInMilliseconds = 3000; //1 second

                setTimeout(function() {
                //your code to be executed after 1 second
                spinner.remove()
                }, delayInMilliseconds);
                
            });
        } else {
            alert("Please select a file first.");
        }
    });
    


    // Extract and OCR section
    ocrExtractBtn.addEventListener("click", function () {

        if (uploadedFilePath) {

            showProgressBar(); // Show progress bar

            let progress = 0;
            const interval = setInterval(() => {
                progress += 10; // Increment progress
                updateProgressBar(progress);
        
                if (progress >= 100) {
                    clearInterval(interval); // Stop the progress
                    // hideProgressBar(); // Remove the progress bar
                    alert("OCR and Extraction Complete!");
                }
            }, 500); // Simulate progress update every 500ms


            fetch("/extract-requirements", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ filepath: uploadedFilePath }),
            })

                .then((response) => response.json())
                .then((data) => {
                    if (data.requirements) {
                        // Update UI with extracted requirements
                        requirementsList.innerHTML = ""; // Clear old data

                        data.requirements.forEach(req => {
                            const row = document.createElement("tr");
                            row.classList.add("show"); // Add class to show with animation
                            const cell = document.createElement("td");
                            cell.textContent = req.requirement;
                            row.appendChild(cell);
                            requirementsList.appendChild(row);
                        });

                        // Show the table and hide the "No requirements" message
                        requirementsTable.classList.remove("hidden");
                        noRequirementsMessage.classList.add("hidden");

                    } else {
                        throw new Error("File upload failed.");
                    }

                })
                .catch((error) => {
                    console.error(error);
                    alert(error.message || "An error occurred during requirement extraction.");
                })
                .finally(() => {
                    var delayInMilliseconds = 3000; //1 second

                    setTimeout(function() {
                    //your code to be executed after 1 second
                    hideProgressBar(); // Remove the progress bar
                    }, delayInMilliseconds);
                });


        } else {
            alert("No file uploaded. Please upload a file first.")
        }

    });    



    
    // Function to create and show the progress bar
    function showProgressBar() {
        const progressBarContainer = document.createElement("div");
        progressBarContainer.id = "progressBarContainer";
        progressBarContainer.classList.add("progress-bar-container");

        const progressBar = document.createElement("div");
        progressBar.id = "progressBar";
        progressBar.classList.add("progress-bar");

        progressBarContainer.appendChild(progressBar);
        ocrExtractSection.appendChild(progressBarContainer);
    }

    // Function to update the progress bar dynamically
    function updateProgressBar(percentage) {
        const progressBar = document.getElementById("progressBar");
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }

    // Function to hide and remove the progress bar
    function hideProgressBar() {
        const progressBarContainer = document.getElementById("progressBarContainer");
        if (progressBarContainer) {
            progressBarContainer.remove();
        }
    }



    // Go to Drafting Page Button logic
    goToDraftingButton.addEventListener('click', () => {
        window.location.href = "/drafting";  // Adjust the URL to your drafting page
    });
});

