document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const uploadFileBtn = document.getElementById("uploadFileBtn");
    const spinner = document.getElementById("spinner");
    const requirementsTable = document.getElementById("requirementsTable");
    const requirementsList = document.getElementById("requirementsList");
    const noRequirementsMessage = document.getElementById("noRequirementsMessage");
    const goToDraftingButton = document.getElementById("go-to-drafting");

    let uploadedFile = null;

    // Show spinner
    function showSpinner() {
        spinner.classList.remove("hidden");
    }

    // Hide spinner
    function hideSpinner() {
        spinner.classList.add("hidden");
    }

    // Handle file selection
    fileInput.addEventListener("change", function (e) {
        uploadedFile = e.target.files[0];
        uploadFileBtn.disabled = !uploadedFile; // Enable or disable upload button based on file selection
    });

    // Handle file upload button click
    uploadFileBtn.addEventListener("click", function () {
        if (uploadedFile) {
            showSpinner(); // Show loading spinner while processing the file

            // FormData to send file in the request
            const formData = new FormData();
            formData.append('file', uploadedFile);

            // Send the file to the backend (upload it)
            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.file_path) {
                    // Now call the extract-requirements endpoint to process the uploaded file
                    return fetch('/extract-requirements', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ filepath: data.file_path })
                    });
                } else {
                    throw new Error("File upload failed.");
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.requirements) {
                    // Populate the table with extracted requirements
                    requirementsList.innerHTML = ''; // Clear previous data
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
                    throw new Error("No requirements found.");
                }
            })
            .catch(error => {
                console.error(error);
                alert(error.message || "An error occurred.");
            })
            .finally(() => {
                hideSpinner(); // Hide spinner after the process is done
            });
        } else {
            alert("Please select a file first.");
        }
    });
    

    

    // Go to Drafting Page Button logic
    goToDraftingButton.addEventListener('click', () => {
        window.location.href = "/drafting";  // Adjust the URL to your drafting page
    });
});


console.log("Table element:", requirementsTable);
console.log("List element:", requirementsList);
console.log("Message element:", noRequirementsMessage);

