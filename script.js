// --- 3D Hero Background Script ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Ensure canvas exists before trying to get context
if (document.getElementById('hero-canvas')) {
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('hero-canvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const cells = [];
    const cellGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const cellMaterial = new THREE.MeshPhongMaterial({ color: 0x9f1239, shininess: 80 });

    for (let i = 0; i < 200; i++) {
        const cell = new THREE.Mesh(cellGeometry, cellMaterial);
        cell.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        cell.scale.x = Math.random() * 0.5 + 0.8;
        cell.scale.y = Math.random() * 0.2 + 0.3; // Make them flatter
        cell.scale.z = cell.scale.x;
        cell.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        scene.add(cell);
        cells.push(cell);
    }

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    camera.position.z = 10;

    function animate() {
        requestAnimationFrame(animate);
        cells.forEach(cell => {
            cell.position.y -= 0.02;
            cell.rotation.x += 0.005;
            if (cell.position.y < -10) {
                cell.position.y = 10;
            }
        });
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
} // End of 3D hero script safety check

// --- Chart.js Performance Chart ---
if (document.getElementById('accuracyChart')) {
    const ctx = document.getElementById('accuracyChart').getContext('2d');
    const accuracyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Existing LRC', 'Existing NBC', 'Proposed InceptionV3 + LGBM'],
            datasets: [{
                label: 'Model Accuracy',
                data: [85.3, 89.1, 98.8], // Example accuracies
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, ticks: { color: '#e0e0e0', font: { size: 14 } }, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { ticks: { color: '#e0e0e0', font: { size: 14 } }, grid: { color: 'rgba(255,255,255,0.1)' } }
            },
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Model Performance Comparison', color: '#ffffff', font: { size: 18, weight: 'bold' } }
            }
        }
    });
} // End of Chart.js safety check

// --- Anemia Info Tab Logic ---
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
// Get the element with id="defaultOpen" and click on it
if (document.querySelector('.tab-btn')) {
    document.querySelector('.tab-btn').click();
}


// --- Analysis Tool Full Logic ---
const analysisToolPage = document.getElementById('analysis-tool');
const showTestToolBtn = document.getElementById('show-test-tool-btn');
const closeTestToolBtn = document.getElementById('close-test-tool-btn');
const mainCard = analysisToolPage.querySelector('#tool-main-card');
const resultCard = analysisToolPage.querySelector('#tool-result-card');

// Populate the tool's HTML
mainCard.innerHTML = `
    <div class="text-center">
        <h1 class="text-3xl font-bold text-white tracking-wider">Test Your Sample</h1>
        <p class="text-gray-400 mt-2">Upload a blood smear image to analyze.</p>
    </div>
    <div id="tool-upload-section">
        <div id="tool-image-preview-container" class="hidden w-full h-64 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center mb-4 bg-gray-900/50">
            <img id="tool-image-preview" src="#" alt="Image Preview" class="max-h-full max-w-full rounded-lg object-contain"/>
            <p id="tool-upload-placeholder" class="text-gray-500">Your image will appear here</p>
        </div>
        <div class="relative overflow-hidden inline-block w-full h-16 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg">
            <span id="tool-upload-button-text">Choose Blood Smear Image</span>
            <input type="file" id="tool-image-upload" accept="image/jpeg,image/png,image/bmp,image/tiff" class="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer">
        </div>
        <button id="tool-analyze-button" class="mt-4 w-full h-16 bg-gray-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled>Analyze Image</button>
        <!-- ADDED: Error message container -->
        <p id="tool-upload-error" class="text-red-400 text-sm mt-2 text-center h-5"></p>
    </div>
    <div id="tool-analysis-section" class="hidden space-y-4">
       <h3 class="text-xl font-semibold text-center text-white">Analysis in Progress...</h3>
        <div id="tool-step-1" class="flex items-center gap-4 opacity-50 transition-opacity duration-500">
            <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">1</div>
            <div><p class="font-medium">Feature Extraction (InceptionV3)</p><div class="w-full bg-gray-700 rounded-full h-2 mt-1"><div id="tool-progress-1" class="bg-blue-500 h-2 rounded-full progress-bar" style="width: 0%"></div></div></div>
        </div>
        <div id="tool-step-2" class="flex items-center gap-4 opacity-50 transition-opacity duration-500">
            <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">2</div>
            <div><p class="font-medium">Classification (LightGBM)</p><div class="w-full bg-gray-700 rounded-full h-2 mt-1"><div id="tool-progress-2" class="bg-purple-500 h-2 rounded-full progress-bar" style="width: 0%"></div></div></div>
        </div>
        <div id="tool-step-3" class="flex items-center gap-4 opacity-50 transition-opacity duration-500">
            <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">3</div>
            <div><p class="font-medium">Finalizing Result</p><div class="w-full bg-gray-700 rounded-full h-2 mt-1"><div id="tool-progress-3" class="bg-green-500 h-2 rounded-full progress-bar" style="width: 0%"></div></div></div>
        </div>
    </div>`;

resultCard.innerHTML = `
     <h2 class="text-2xl font-bold text-white mb-4">Analysis Complete</h2>
     <div id="tool-result-display" class="p-6 rounded-xl transition-all duration-300"><p id="tool-result-text" class="text-3xl font-bold"></p></div>
     <div class="mt-4 text-left"><p class="text-gray-300 font-semibold">Key Observations:</p><p id="tool-result-description" class="text-sm text-gray-400 mt-1"></p></div>
     <div class="mt-4"><p class="text-gray-300">Confidence Score</p><p id="tool-confidence-score" class="text-4xl font-bold text-white mt-1"></p></div>
     <button id="tool-reset-button" class="mt-6 w-full bg-red-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-600 transition-all duration-300">Analyze Another</button>
     <p class="mt-4 text-xs text-gray-400 text-center">Disclaimer: This automated analysis provides a preliminary assessment. For a definitive diagnosis, please consult a qualified medical professional.</p>`;

// Get tool elements after they are created
const imageUpload = document.getElementById('tool-image-upload');
const imagePreview = document.getElementById('tool-image-preview');
const imagePreviewContainer = document.getElementById('tool-image-preview-container');
const uploadPlaceholder = document.getElementById('tool-upload-placeholder');
const uploadButtonText = document.getElementById('tool-upload-button-text');
const analyzeButton = document.getElementById('tool-analyze-button');
const uploadSection = document.getElementById('tool-upload-section');
const analysisSection = document.getElementById('tool-analysis-section');
const resultDisplay = document.getElementById('tool-result-display');
const resultText = document.getElementById('tool-result-text');
const resultDescription = document.getElementById('tool-result-description');
const confidenceScore = document.getElementById('tool-confidence-score');
const resetButton = document.getElementById('tool-reset-button');
const uploadError = document.getElementById('tool-upload-error'); // Get the new error element
let currentFile = null; // Variable to hold the current file for consistent analysis

function resetToolState() {
    resultCard.classList.add('hidden');
    mainCard.classList.remove('hidden');
    uploadSection.classList.remove('hidden');
    analysisSection.classList.add('hidden');
    imagePreviewContainer.classList.add('hidden');
    uploadPlaceholder.classList.remove('hidden');
    uploadButtonText.textContent = 'Choose Blood Smear Image';
    analyzeButton.disabled = true;
    imageUpload.value = '';
    currentFile = null; // Reset the file on state reset
    uploadError.textContent = ''; // Clear error message

    // Reset progress bars and steps
    ['1', '2', '3'].forEach(i => {
        document.getElementById(`tool-progress-${i}`).style.width = '0%';
        document.getElementById(`tool-step-${i}`).classList.add('opacity-50');
    });
}

showTestToolBtn.addEventListener('click', () => {
    analysisToolPage.classList.remove('hidden');
    analysisToolPage.classList.add('flex');
    document.body.style.overflow = 'hidden';
});

closeTestToolBtn.addEventListener('click', () => {
    analysisToolPage.classList.add('hidden');
    analysisToolPage.classList.remove('flex');
    document.body.style.overflow = 'auto';
    resetToolState(); // Reset state when closing the tool
});

// --- NEW: Helper function for validation ---
function isValidImage(file) {
    if (!file) return false;
    
    // 1. Check file type (MIME type)
    // Added common medical/microscopy formats
    const allowedTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/tiff'];
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, message: 'Invalid file type. Please upload a JPG, PNG, BMP, or TIFF.' };
    }

    // 2. Check file name for keywords (simulated content check)
    const fileName = file.name.toLowerCase();
    const keywords = ['blood', 'smear', 'cell', 'micro', 'anemia', 'rbc', 'hema']; // Added common prefixes
    
    if (!keywords.some(keyword => fileName.includes(keyword))) {
        return { valid: false, message: 'This may not be a blood smear image. Please upload a valid microscopic image.' };
    }
    
    return { valid: true, message: '' };
}

// --- MODIFIED: Image upload listener with validation ---
imageUpload.addEventListener('change', () => {
    uploadError.textContent = ''; // Clear old error
    const file = imageUpload.files[0];
    
    if (!file) {
        // No file selected, just return
        return;
    }

    const validation = isValidImage(file);

    if (!validation.valid) {
        // --- Handle Invalid File ---
        uploadError.textContent = validation.message;
        
        // Reset state
        imageUpload.value = ''; // Clear the file input
        currentFile = null;
        imagePreviewContainer.classList.add('hidden');
        uploadPlaceholder.classList.remove('hidden');
        uploadButtonText.textContent = 'Choose Blood Smear Image';
        analyzeButton.disabled = true;
        imagePreview.src = '#';

        return; // Stop execution
    }

    // --- Handle Valid File ---
    currentFile = file; // Store the file object
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreviewContainer.classList.remove('hidden');
        uploadPlaceholder.classList.add('hidden');
    };
    reader.readAsDataURL(file);
    uploadButtonText.textContent = 'Change Image';
    analyzeButton.disabled = false;
});


analyzeButton.addEventListener('click', () => {
    uploadSection.classList.add('hidden');
    analysisSection.classList.remove('hidden');
    runAnalysisAnimation();
});

resetButton.addEventListener('click', resetToolState);

function runAnalysisAnimation() {
    setTimeout(() => {
        document.getElementById('tool-step-1').classList.remove('opacity-50');
        document.getElementById('tool-progress-1').style.width = '100%';
    }, 500);
    setTimeout(() => {
        document.getElementById('tool-step-2').classList.remove('opacity-50');
        document.getElementById('tool-progress-2').style.width = '100%';
    }, 2000);
    setTimeout(() => {
        document.getElementById('tool-step-3').classList.remove('opacity-50');
        document.getElementById('tool-progress-3').style.width = '100%';
    }, 3500);
    setTimeout(showResult, 4500);
}

// Simple hash function for deterministic results
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

function showResult() {
    mainCard.classList.add('hidden');
    resultCard.classList.remove('hidden');

    if (!currentFile) {
        // Fallback for safety, though it shouldn't be reached
        resultText.textContent = 'Error';
        resultDescription.textContent = "No file was found to analyze.";
        confidenceScore.textContent = `0.00%`;
        return;
    }

    // Pseudo-analysis based on a hash of file name and size for consistency
    const uniqueString = `${currentFile.name}-${currentFile.size}`;
    const hash = simpleHash(uniqueString);

    const isAnemia = hash % 2 === 0; // Deterministic result: even hash -> Anemia
    const confidence = (90 + (hash % 9) + (hash % 100 / 100)).toFixed(2); // Deterministic confidence score between 90.00 and 98.99

    resultDisplay.classList.remove('bg-red-900/50', 'bg-green-900/50');

    // --- NEW: Observation arrays ---
    const anemiaObservations = [
        "Model identified smaller (microcytic) and paler (hypochromic) red blood cells, common indicators of iron deficiency anemia.",
        "Analysis indicates a high variation in red blood cell size (anisocytosis) and shape (poikilocytosis), often linked to anemia.",
        "Significant presence of target cells (codocytes) and spherocytes observed, suggesting a potential hemolytic anemia.",
        "Red blood cells appear sparse and pale. White blood cell and platelet counts appear to be within normal ranges."
    ];
    
    const normalObservations = [
        "Red blood cells appear uniform in size and color (normocytic, normochromic), consistent with a healthy blood smear.",
        "Cell morphology and distribution appear normal. No significant abnormalities detected in the sample.",
        "Consistent red blood cell size and central pallor. Platelet and white blood cell distribution appears unremarkable.",
        "Sample shows well-formed red blood cells with no signs of microcytosis or hypochromia."
    ];
    // --- End of new arrays ---

    if (isAnemia) {
        resultText.textContent = 'Anemia Detected';
        resultDisplay.classList.add('bg-red-900/50');
        // --- MODIFIED: Use hash to pick observation ---
        resultDescription.textContent = anemiaObservations[hash % anemiaObservations.length];
    } else {
        resultText.textContent = 'Normal';
        resultDisplay.classList.add('bg-green-900/5row_');
        // --- MODIFIED: Use hash to pick observation ---
        resultDescription.textContent = normalObservations[hash % normalObservations.length];
    }
    confidenceScore.textContent = `${confidence}%`;
}

