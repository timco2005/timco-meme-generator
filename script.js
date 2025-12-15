// State management
let currentImage = null;
let textBoxes = [];
let activeTextBox = null;
let currentTextSize = 40;
let currentTextColor = '#FFFFFF';
let currentBorderColor = '#000000';
let currentBorderThickness = 3;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// DOM elements
const imageUpload = document.getElementById('imageUpload');
const uploadArea = document.querySelector('.upload-area');
const uploadSection = document.querySelector('.upload-section');
const gallery = document.getElementById('gallery');
const gallerySection = document.getElementById('gallerySection');
const canvasSection = document.getElementById('canvasSection');
const canvasPlaceholder = document.getElementById('canvasPlaceholder');
const rightPanel = document.getElementById('rightPanel');
const memeImage = document.getElementById('memeImage');
const textOverlay = document.getElementById('textOverlay');
const addTextBtn = document.getElementById('addTextBtn');
const textSizeSlider = document.getElementById('textSizeSlider');
const textSizeValue = document.getElementById('textSizeValue');
const textColorPicker = document.getElementById('textColorPicker');
const textColorHex = document.getElementById('textColorHex');
const borderColorPicker = document.getElementById('borderColorPicker');
const borderColorHex = document.getElementById('borderColorHex');
const borderThicknessSlider = document.getElementById('borderThicknessSlider');
const borderThicknessValue = document.getElementById('borderThicknessValue');
const textInput = document.getElementById('textInput');
const downloadBtn = document.getElementById('downloadBtn');
const saveBtn = document.getElementById('saveBtn');
const textBoxesList = document.getElementById('textBoxesList');
const memeCanvas = document.getElementById('memeCanvas');
const backToGalleryBtn = document.getElementById('backToGalleryBtn');

// Popular meme templates
const memeTemplates = [
    // Local templates from assets folder
    {
        name: 'Finally! A Worthy Opponent!',
        url: 'assets/_Finally! A Worthy Opponent! Our Battle Will Be Legendary!_ - Tai Lung , Kung Fu Panda.jpg'
    },
    {
        name: 'Good Question',
        url: 'assets/_Good Question_ - Shrek.jpg'
    },
    {
        name: 'He exists now. Only in my memory',
        url: 'assets/_He exists now. Only in my memory_ - Titanic, Rose DeWitt Bukater.jpg'
    },
    {
        name: 'I Serve the Soviet Union',
        url: 'assets/_I Serve the Soviet Union_ - Chernobyl, HBO, General Tarakanov.jpg'
    },
    {
        name: 'I will find you and I will kill you',
        url: 'assets/_I will find you and I will kill you_ Textless - Taken, Liam Neeson.jpg'
    },
    {
        name: 'I\'ve Seen Enough. I\'m Satisfied.',
        url: 'assets/_I_ve Seen Enough. I_m Satisfied._ - Dio Brando, JoJo_s Bizarre Adventure_ Stardust Crusaders.jpg'
    },
    {
        name: 'Is It Possible to Learn This Power',
        url: 'assets/_Is It Possible to Learn This Power_ - Star Wars_ Episode III -- Revenge of the Sith, Anakin Skywalker, Hayden Christensen.jpg'
    },
    // Online templates (fallback)
    {
        name: 'Drake',
        url: 'https://i.imgflip.com/30b1gx.jpg'
    },
    {
        name: 'Distracted Boyfriend',
        url: 'https://i.imgflip.com/1ur9b0.jpg'
    },
    {
        name: 'Expanding Brain',
        url: 'https://i.imgflip.com/1jhlb5.jpg'
    },
    {
        name: 'Change My Mind',
        url: 'https://i.imgflip.com/24y43o.jpg'
    },
    {
        name: 'This Is Fine',
        url: 'https://i.imgflip.com/26am.jpg'
    },
    {
        name: 'Two Buttons',
        url: 'https://i.imgflip.com/1g8my4.jpg'
    }
];

// CORS proxy function (using a public CORS proxy)
function getCorsProxyUrl(url) {
    // Try multiple CORS proxy services for reliability
    // Option 1: corsproxy.io (most reliable)
    return `https://corsproxy.io/?${encodeURIComponent(url)}`;
    
    // Alternative proxies (uncomment if above doesn't work):
    // return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    // return `https://cors-anywhere.herokuapp.com/${url}`;
}

// Store original image URL for CORS proxy when downloading
let originalImageUrl = null;

// IndexedDB for storing uploaded images
let db = null;
const DB_NAME = 'MemeGeneratorDB';
const DB_VERSION = 1;
const STORE_NAME = 'uploadedImages';

// Initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

// Save uploaded image to IndexedDB
async function saveImageToAssets(file) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const imageData = {
                name: file.name,
                dataUrl: e.target.result,
                type: file.type,
                size: file.size,
                uploadedAt: new Date().toISOString()
            };
            
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(imageData);
            
            request.onsuccess = () => {
                imageData.id = request.result;
                resolve(imageData);
            };
            
            request.onerror = () => reject(request.error);
        };
        
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

// Load all images from IndexedDB
async function loadImagesFromAssets() {
    return new Promise((resolve, reject) => {
        if (!db) {
            resolve([]);
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Add image to gallery
function addImageToGallery(imageData) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item uploaded-template';
    galleryItem.setAttribute('data-image-id', imageData.id);
    galleryItem.title = imageData.name || 'Uploaded template';
    
    const img = document.createElement('img');
    img.src = imageData.dataUrl;
    img.alt = imageData.name || 'Uploaded template';
    img.loading = 'lazy';
    
    galleryItem.appendChild(img);
    galleryItem.addEventListener('click', () => {
        // Load the image from data URL
        loadImage(imageData.dataUrl);
    });
    
    // Insert at the beginning of gallery (newest first)
    gallery.insertBefore(galleryItem, gallery.firstChild);
}

// Initialize gallery
async function initGallery() {
    // Load default templates
    memeTemplates.forEach(template => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        const img = document.createElement('img');
        img.src = template.url;
        img.alt = template.name;
        img.loading = 'lazy';
        // Don't set crossOrigin for gallery thumbnails - load normally for faster display
        galleryItem.appendChild(img);
        galleryItem.addEventListener('click', () => loadImage(template.url));
        gallery.appendChild(galleryItem);
    });
    
    // Load uploaded images from IndexedDB
    try {
        const uploadedImages = await loadImagesFromAssets();
        uploadedImages.forEach(imageData => {
            addImageToGallery(imageData);
        });
    } catch (error) {
        console.warn('Could not load uploaded images:', error);
    }
}

// Load image from URL or file
function loadImage(src) {
    // Prevent loading if already loading
    if (memeImage.src && memeImage.src !== '' && !memeImage.complete) {
        console.warn('Image already loading, skipping...');
        return;
    }
    
    // Reset image element state
    memeImage.onload = null;
    memeImage.onerror = null;
    
    // Check if it's a data URL (from IndexedDB uploads)
    const isDataUrl = typeof src === 'string' && src.startsWith('data:');
    // Check if it's a local file path (relative path)
    const isLocalPath = typeof src === 'string' && !src.startsWith('http') && !isDataUrl;
    
    if (typeof src === 'string') {
        // URL source - store original URL for CORS proxy when downloading
        originalImageUrl = src;
        
        // For local paths and data URLs, don't use CORS
        if (isLocalPath || isDataUrl) {
            memeImage.crossOrigin = null;
            memeImage.src = src;
            
            memeImage.onload = () => {
                currentImage = memeImage;
                showEditor();
            };
            
            memeImage.onerror = () => {
                console.error('Failed to load image:', src);
                handleImageError();
            };
        } else {
            // External URL - try loading with CORS first for better download support
            memeImage.crossOrigin = 'anonymous';
            memeImage.src = src;
            
            memeImage.onerror = () => {
                // If CORS fails, try without CORS for display
                console.warn('CORS load failed, trying without CORS for display');
                memeImage.crossOrigin = null;
                memeImage.src = src;
                
                memeImage.onerror = () => {
                    console.error('Failed to load image:', src);
                    handleImageError();
                };
            };
            
            memeImage.onload = () => {
                currentImage = memeImage;
                showEditor();
            };
        }
    } else {
        // File upload - no CORS issues with local files
        originalImageUrl = null; // No external URL
        memeImage.crossOrigin = null;
        const reader = new FileReader();
        reader.onload = (e) => {
            memeImage.onload = () => {
                currentImage = memeImage;
                showEditor();
            };
            memeImage.onerror = () => {
                console.error('Failed to load image from FileReader');
                handleImageError();
            };
            memeImage.src = e.target.result;
        };
        reader.onerror = () => {
            console.error('FileReader error');
            handleImageError();
        };
        reader.readAsDataURL(src);
    }
}

// Handle image loading errors
function handleImageError() {
    console.error('Image loading failed. Current image src:', memeImage.src);
    console.error('Original URL:', originalImageUrl);
    alert('Error loading image. Please try uploading your own image or try again.\n\nIf this is a template image, it may be temporarily unavailable.');
}

// Show editor container
function showEditor() {
    uploadSection.style.display = 'none';
    gallerySection.style.display = 'none';
    canvasSection.style.display = 'block';
    rightPanel.style.display = 'flex';
    canvasPlaceholder.style.display = 'none';
    memeImage.style.display = 'block';
    textBoxes = [];
    textOverlay.innerHTML = '';
    textBoxesList.innerHTML = '';
    activeTextBox = null;
    textInput.value = '';
    textSizeSlider.value = 40;
    currentTextSize = 40;
    textSizeValue.textContent = '40';
    textColorPicker.value = '#FFFFFF';
    textColorHex.value = '#FFFFFF';
    currentTextColor = '#FFFFFF';
    borderColorPicker.value = '#000000';
    borderColorHex.value = '#000000';
    currentBorderColor = '#000000';
    borderThicknessSlider.value = 3;
    currentBorderThickness = 3;
    borderThicknessValue.textContent = '3';
    updateTextBoxesList();
}

// Show gallery container
function showGallery() {
    uploadSection.style.display = 'block';
    gallerySection.style.display = 'block';
    canvasSection.style.display = 'none';
    rightPanel.style.display = 'none';
    currentImage = null;
    
    // Reset image element completely
    memeImage.onload = null;
    memeImage.onerror = null;
    memeImage.src = '';
    memeImage.crossOrigin = null;
    memeImage.style.display = 'none';
    
    originalImageUrl = null;
    textBoxes = [];
    textOverlay.innerHTML = '';
    textBoxesList.innerHTML = '';
    activeTextBox = null;
    textInput.value = '';
}

// Image upload handler
imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        // Save to assets (IndexedDB) and add to gallery
        try {
            const imageData = await saveImageToAssets(file);
            addImageToGallery(imageData);
            showNotification('Image added to gallery!', 'success');
        } catch (error) {
            console.error('Error saving image to assets:', error);
            showNotification('Image loaded but could not be saved to gallery.', 'error');
        }
        
        // Load the image for editing
        loadImage(file);
        
        // Reset input to allow uploading the same file again
        e.target.value = '';
    }
});

// Upload area click handler
uploadArea.addEventListener('click', () => {
    imageUpload.click();
});

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary-color)';
    uploadArea.style.backgroundColor = '#2a2a2a';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--border-dashed)';
    uploadArea.style.backgroundColor = 'var(--card-bg)';
});

uploadArea.addEventListener('drop', async (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--border-dashed)';
    uploadArea.style.backgroundColor = 'var(--card-bg)';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        // Save to assets (IndexedDB) and add to gallery
        try {
            const imageData = await saveImageToAssets(file);
            addImageToGallery(imageData);
            showNotification('Image added to gallery!', 'success');
        } catch (error) {
            console.error('Error saving image to assets:', error);
            showNotification('Image loaded but could not be saved to gallery.', 'error');
        }
        
        // Load the image for editing
        loadImage(file);
    }
});

// Update text border styling
function updateTextBorder(textContent, borderColor, borderThickness) {
    if (borderThickness > 0) {
        textContent.style.webkitTextStroke = `${borderThickness}px ${borderColor}`;
        textContent.style.textStroke = `${borderThickness}px ${borderColor}`;
        
        // Update text-shadow for better border effect
        const shadowOffset = Math.max(1, Math.ceil(borderThickness / 2));
        textContent.style.textShadow = `
            -${shadowOffset}px -${shadowOffset}px 0 ${borderColor},
            ${shadowOffset}px -${shadowOffset}px 0 ${borderColor},
            -${shadowOffset}px ${shadowOffset}px 0 ${borderColor},
            ${shadowOffset}px ${shadowOffset}px 0 ${borderColor},
            0 0 ${Math.max(2, borderThickness)}px ${borderColor}
        `;
    } else {
        textContent.style.webkitTextStroke = 'none';
        textContent.style.textStroke = 'none';
        textContent.style.textShadow = 'none';
    }
}

// Create new text box
function createTextBox() {
    const textBox = document.createElement('div');
    textBox.className = 'text-box active';
    
    const textContent = document.createElement('div');
    textContent.className = 'text-box-content';
    textContent.textContent = 'Your Text Here';
    textContent.style.fontSize = `${currentTextSize}px`;
    textContent.style.color = currentTextColor;
    updateTextBorder(textContent, currentBorderColor, currentBorderThickness);
    
    textBox.appendChild(textContent);
    textOverlay.appendChild(textBox);
    
    // Position in center initially
    const imageRect = memeImage.getBoundingClientRect();
    const overlayRect = textOverlay.getBoundingClientRect();
    const centerX = (overlayRect.width - textBox.offsetWidth) / 2;
    const centerY = (overlayRect.height - textBox.offsetHeight) / 2;
    
    textBox.style.left = `${centerX}px`;
    textBox.style.top = `${centerY}px`;
    
    // Store text box data
    const textBoxData = {
        element: textBox,
        content: textContent,
        text: 'Your Text Here',
        fontSize: currentTextSize,
        color: currentTextColor,
        borderColor: currentBorderColor,
        borderThickness: currentBorderThickness,
        x: centerX,
        y: centerY,
        id: Date.now()
    };
    
    textBoxes.push(textBoxData);
    setActiveTextBox(textBoxData);
    makeDraggable(textBoxData);
    updateTextBoxesList();
    
    // Focus text input
    textInput.focus();
    textInput.select();
}

// Update text boxes list
function updateTextBoxesList() {
    textBoxesList.innerHTML = '';
    textBoxes.forEach((textBoxData, index) => {
        const item = document.createElement('div');
        item.className = 'text-box-item';
        if (activeTextBox && activeTextBox.id === textBoxData.id) {
            item.classList.add('active');
        }
        item.textContent = textBoxData.text || `Text Box ${index + 1}`;
        item.addEventListener('click', () => setActiveTextBox(textBoxData));
        textBoxesList.appendChild(item);
    });
}

// Set active text box
function setActiveTextBox(textBoxData) {
    // Remove active class from all
    textBoxes.forEach(tb => tb.element.classList.remove('active'));
    
    // Set new active
    activeTextBox = textBoxData;
    if (textBoxData) {
        textBoxData.element.classList.add('active');
        textInput.value = textBoxData.text;
        textSizeSlider.value = textBoxData.fontSize;
        currentTextSize = textBoxData.fontSize;
        textSizeValue.textContent = textBoxData.fontSize;
        textColorPicker.value = textBoxData.color;
        textColorHex.value = textBoxData.color;
        currentTextColor = textBoxData.color;
        borderColorPicker.value = textBoxData.borderColor;
        borderColorHex.value = textBoxData.borderColor;
        currentBorderColor = textBoxData.borderColor;
        borderThicknessSlider.value = textBoxData.borderThickness || 3;
        currentBorderThickness = textBoxData.borderThickness || 3;
        borderThicknessValue.textContent = textBoxData.borderThickness || 3;
    } else {
        textInput.value = '';
    }
    updateTextBoxesList();
}

// Make text box draggable
function makeDraggable(textBoxData) {
    const textBox = textBoxData.element;
    
    textBox.addEventListener('mousedown', (e) => {
        if (e.target === textBox || e.target === textBoxData.content) {
            setActiveTextBox(textBoxData);
            isDragging = true;
            
            const rect = textBox.getBoundingClientRect();
            const overlayRect = textOverlay.getBoundingClientRect();
            
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            
            e.preventDefault();
        }
    });
    
    textBox.addEventListener('click', (e) => {
        if (!isDragging) {
            setActiveTextBox(textBoxData);
        }
    });
}

// Handle mouse move for dragging
document.addEventListener('mousemove', (e) => {
    if (isDragging && activeTextBox) {
        const overlayRect = textOverlay.getBoundingClientRect();
        const textBox = activeTextBox.element;
        
        let x = e.clientX - overlayRect.left - dragOffset.x;
        let y = e.clientY - overlayRect.top - dragOffset.y;
        
        // Boundary checking
        const maxX = overlayRect.width - textBox.offsetWidth;
        const maxY = overlayRect.height - textBox.offsetHeight;
        
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
        
        textBox.style.left = `${x}px`;
        textBox.style.top = `${y}px`;
        
        activeTextBox.x = x;
        activeTextBox.y = y;
    }
});

// Handle mouse up
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Add text button handler
addTextBtn.addEventListener('click', createTextBox);

// Text input handler
textInput.addEventListener('input', (e) => {
    if (activeTextBox) {
        const text = e.target.value;
        activeTextBox.text = text;
        activeTextBox.content.textContent = text || 'Your Text Here';
        updateTextBoxesList();
    }
});

// Text size slider handler
textSizeSlider.addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    currentTextSize = size;
    textSizeValue.textContent = size;
    
    if (activeTextBox) {
        activeTextBox.fontSize = size;
        activeTextBox.content.style.fontSize = `${size}px`;
    }
});

// Text color picker handler
textColorPicker.addEventListener('input', (e) => {
    const color = e.target.value.toUpperCase();
    currentTextColor = color;
    textColorHex.value = color;
    
    if (activeTextBox) {
        activeTextBox.color = color;
        activeTextBox.content.style.color = color;
    }
});

// Text color hex input handler
textColorHex.addEventListener('input', (e) => {
    const color = e.target.value.toUpperCase();
    if (/^#[0-9A-F]{6}$/i.test(color)) {
        currentTextColor = color;
        textColorPicker.value = color;
        
        if (activeTextBox) {
            activeTextBox.color = color;
            activeTextBox.content.style.color = color;
        }
    }
});

// Border color picker handler
borderColorPicker.addEventListener('input', (e) => {
    const color = e.target.value.toUpperCase();
    currentBorderColor = color;
    borderColorHex.value = color;
    
    if (activeTextBox) {
        activeTextBox.borderColor = color;
        updateTextBorder(activeTextBox.content, color, activeTextBox.borderThickness || currentBorderThickness);
    }
});

// Border color hex input handler
borderColorHex.addEventListener('input', (e) => {
    const color = e.target.value.toUpperCase();
    if (/^#[0-9A-F]{6}$/i.test(color)) {
        currentBorderColor = color;
        borderColorPicker.value = color;
        
        if (activeTextBox) {
            activeTextBox.borderColor = color;
            updateTextBorder(activeTextBox.content, color, activeTextBox.borderThickness || currentBorderThickness);
        }
    }
});

// Border thickness slider handler
borderThicknessSlider.addEventListener('input', (e) => {
    const thickness = parseFloat(e.target.value);
    currentBorderThickness = thickness;
    borderThicknessValue.textContent = thickness;
    
    if (activeTextBox) {
        activeTextBox.borderThickness = thickness;
        updateTextBorder(activeTextBox.content, activeTextBox.borderColor || currentBorderColor, thickness);
    }
});

// Render to canvas with a specific image element
function renderToCanvas(imageElement) {
    const img = imageElement || memeImage;
    
    if (!img || !img.complete) {
        console.error('Image not loaded');
        return false;
    }
    
    const canvas = memeCanvas;
    const ctx = canvas.getContext('2d');
    
    // Get image dimensions
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;
    
    if (imgWidth === 0 || imgHeight === 0) {
        console.error('Invalid image dimensions');
        return false;
    }
    
    // Set canvas size to match image (this clears the canvas)
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    
    // Clear canvas to ensure no tainted state
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image - handle CORS errors
    try {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch (error) {
        console.error('Error drawing image to canvas (CORS issue):', error);
        throw new Error('CORS_ERROR');
    }
    
    // Get displayed image dimensions from the displayed memeImage (not the CORS image)
    // This is needed for proper text positioning scaling
    const displayedWidth = memeImage.offsetWidth || memeImage.width;
    const displayedHeight = memeImage.offsetHeight || memeImage.height;
    
    if (displayedWidth === 0 || displayedHeight === 0) {
        console.error('Image not displayed');
        return false;
    }
    
    // Calculate scale factors based on displayed vs actual image size
    const scaleX = canvas.width / displayedWidth;
    const scaleY = canvas.height / displayedHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Draw text boxes
    textBoxes.forEach(textBoxData => {
        const { x, y, text, fontSize, color, borderColor, borderThickness } = textBoxData;
        
        if (!text || text.trim() === '') return; // Skip empty text
        
        // Calculate scaled position and size
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledFontSize = fontSize * scale;
        
        // Set font and measure text
        ctx.font = `bold ${scaledFontSize}px Impact, "Arial Black", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Measure text to get actual dimensions
        const textMetrics = ctx.measureText(text);
        const textBox = textBoxData.element;
        
        // Calculate center position based on text box position
        // The x, y stored are the top-left of the text box container
        // We need to center the text within that container
        const textBoxWidth = textBox.offsetWidth * scaleX;
        const textBoxHeight = textBox.offsetHeight * scaleY;
        const centerX = scaledX + textBoxWidth / 2;
        const centerY = scaledY + textBoxHeight / 2;
        
        // Draw text with border (stroke) if border thickness > 0
        const thickness = borderThickness || 3;
        if (thickness > 0) {
            const scaledBorderThickness = thickness * scale;
            ctx.strokeStyle = borderColor || '#000000';
            ctx.lineWidth = Math.max(1, scaledBorderThickness);
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            
            // Draw stroke (border)
            ctx.strokeText(text, centerX, centerY);
        }
        
        // Draw fill (with selected color)
        ctx.fillStyle = color || '#FFFFFF';
        ctx.fillText(text, centerX, centerY);
    });
    
    return true;
}

// Download meme
function downloadMeme() {
    if (!currentImage) {
        alert('Please select an image first.');
        return;
    }
    
    if (textBoxes.length === 0) {
        alert('Please add at least one text box before downloading.');
        return;
    }
    
    // Wait for image to be fully loaded
    if (!memeImage.complete || memeImage.naturalWidth === 0) {
        const handleLoad = () => {
            memeImage.removeEventListener('load', handleLoad);
            downloadMeme();
        };
        memeImage.addEventListener('load', handleLoad);
        return;
    }
    
    // Check if we need to use CORS proxy (external URL)
    const isExternalUrl = originalImageUrl && originalImageUrl.startsWith('http') && !originalImageUrl.startsWith(window.location.origin);
    
    // Check if current image is already CORS-enabled
    const isCorsEnabled = memeImage.crossOrigin === 'anonymous' && memeImage.complete;
    
    // Function to perform download after rendering
    const performDownload = (imageToUse) => {
        try {
            // Create a fresh canvas for download to avoid taint issues
            const downloadCanvas = document.createElement('canvas');
            const downloadCtx = downloadCanvas.getContext('2d');
            
            // Get image dimensions
            const imgWidth = imageToUse.naturalWidth || imageToUse.width;
            const imgHeight = imageToUse.naturalHeight || imageToUse.height;
            
            if (imgWidth === 0 || imgHeight === 0) {
                alert('Error: Invalid image dimensions');
                return;
            }
            
            // Set canvas size
            downloadCanvas.width = imgWidth;
            downloadCanvas.height = imgHeight;
            
            // Draw image to fresh canvas
            downloadCtx.drawImage(imageToUse, 0, 0, downloadCanvas.width, downloadCanvas.height);
            
            // Get displayed image dimensions for text scaling
            const displayedWidth = memeImage.offsetWidth || memeImage.width;
            const displayedHeight = memeImage.offsetHeight || memeImage.height;
            
            if (displayedWidth === 0 || displayedHeight === 0) {
                alert('Error: Image not displayed');
                return;
            }
            
            // Calculate scale factors
            const scaleX = downloadCanvas.width / displayedWidth;
            const scaleY = downloadCanvas.height / displayedHeight;
            const scale = Math.min(scaleX, scaleY);
            
            // Draw text boxes
            textBoxes.forEach(textBoxData => {
                const { x, y, text, fontSize, color, borderColor, borderThickness } = textBoxData;
                
                if (!text || text.trim() === '') return;
                
                const scaledX = x * scaleX;
                const scaledY = y * scaleY;
                const scaledFontSize = fontSize * scale;
                
                downloadCtx.font = `bold ${scaledFontSize}px Impact, "Arial Black", sans-serif`;
                downloadCtx.textAlign = 'center';
                downloadCtx.textBaseline = 'middle';
                
                const textBox = textBoxData.element;
                const textBoxWidth = textBox.offsetWidth * scaleX;
                const textBoxHeight = textBox.offsetHeight * scaleY;
                const centerX = scaledX + textBoxWidth / 2;
                const centerY = scaledY + textBoxHeight / 2;
                
                const thickness = borderThickness || 3;
                if (thickness > 0) {
                    const scaledBorderThickness = thickness * scale;
                    downloadCtx.strokeStyle = borderColor || '#000000';
                    downloadCtx.lineWidth = Math.max(1, scaledBorderThickness);
                    downloadCtx.lineJoin = 'round';
                    downloadCtx.miterLimit = 2;
                    downloadCtx.strokeText(text, centerX, centerY);
                }
                
                downloadCtx.fillStyle = color || '#FFFFFF';
                downloadCtx.fillText(text, centerX, centerY);
            });
            
            // Convert canvas to blob and download
            downloadCanvas.toBlob((blob) => {
                if (!blob) {
                    alert('Error creating image. Please try again.');
                    return;
                }
                
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'meme.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 'image/png');
        } catch (error) {
            if (error.message === 'CORS_ERROR' || error.name === 'SecurityError') {
                alert('Unable to download meme due to CORS restrictions. Please upload your own image instead, or try a different meme template.');
            } else {
                alert('Error rendering meme: ' + error.message);
            }
        }
    };
    
    // If external URL, try to get CORS-enabled version
    if (isExternalUrl) {
        // If image is already CORS-enabled, use it directly
        if (isCorsEnabled) {
            try {
                performDownload(memeImage);
                return;
            } catch (error) {
                // If it fails, try proxy
                console.warn('Direct CORS image failed, trying proxy');
            }
        }
        
        // Show loading indicator
        const originalButtonText = downloadBtn.textContent;
        downloadBtn.disabled = true;
        downloadBtn.textContent = '⏳ Loading...';
        
        // Try multiple proxy services as fallback
        const proxyServices = [
            () => `https://corsproxy.io/?${encodeURIComponent(originalImageUrl)}`,
            () => `https://api.allorigins.win/raw?url=${encodeURIComponent(originalImageUrl)}`,
            () => `https://cors-anywhere.herokuapp.com/${originalImageUrl}`
        ];
        
        let proxyIndex = 0;
        
        const tryNextProxy = () => {
            if (proxyIndex >= proxyServices.length) {
                downloadBtn.disabled = false;
                downloadBtn.textContent = originalButtonText;
                alert('Unable to download meme due to CORS restrictions. The image server does not allow cross-origin access.\n\nPlease upload your own image instead - uploaded images work perfectly for downloading!');
                return;
            }
            
            const corsImage = new Image();
            corsImage.crossOrigin = 'anonymous';
            
            corsImage.onload = () => {
                // Use the CORS-enabled image for rendering
                performDownload(corsImage);
                downloadBtn.disabled = false;
                downloadBtn.textContent = originalButtonText;
            };
            
            corsImage.onerror = () => {
                // Try next proxy
                proxyIndex++;
                tryNextProxy();
            };
            
            corsImage.src = proxyServices[proxyIndex]();
        };
        
        tryNextProxy();
        return;
    }
    
    // For local/uploaded images, render directly
    performDownload(memeImage);
}

// Save meme function
async function saveMeme() {
    if (!currentImage) {
        showNotification('Please select an image first.', 'error');
        return;
    }
    
    if (textBoxes.length === 0) {
        showNotification('Please add at least one text box before saving.', 'error');
        return;
    }
    
    // Wait for image to be fully loaded
    if (!memeImage.complete || memeImage.naturalWidth === 0) {
        const handleLoad = () => {
            memeImage.removeEventListener('load', handleLoad);
            saveMeme();
        };
        memeImage.addEventListener('load', handleLoad);
        return;
    }
    
    // Check if we need to use CORS proxy (external URL)
    const isExternalUrl = originalImageUrl && originalImageUrl.startsWith('http') && !originalImageUrl.startsWith(window.location.origin);
    const isCorsEnabled = memeImage.crossOrigin === 'anonymous' && memeImage.complete;
    
    // Function to perform save after rendering
    const performSave = async (imageToUse) => {
        try {
            // Create a fresh canvas for saving
            const saveCanvas = document.createElement('canvas');
            const saveCtx = saveCanvas.getContext('2d');
            
            // Get image dimensions
            const imgWidth = imageToUse.naturalWidth || imageToUse.width;
            const imgHeight = imageToUse.naturalHeight || imageToUse.height;
            
            if (imgWidth === 0 || imgHeight === 0) {
                showNotification('Error: Invalid image dimensions', 'error');
                return;
            }
            
            // Set canvas size
            saveCanvas.width = imgWidth;
            saveCanvas.height = imgHeight;
            
            // Draw image to canvas
            saveCtx.drawImage(imageToUse, 0, 0, saveCanvas.width, saveCanvas.height);
            
            // Get displayed image dimensions for text scaling
            const displayedWidth = memeImage.offsetWidth || memeImage.width;
            const displayedHeight = memeImage.offsetHeight || memeImage.height;
            
            if (displayedWidth === 0 || displayedHeight === 0) {
                showNotification('Error: Image not displayed', 'error');
                return;
            }
            
            // Calculate scale factors
            const scaleX = saveCanvas.width / displayedWidth;
            const scaleY = saveCanvas.height / displayedHeight;
            const scale = Math.min(scaleX, scaleY);
            
            // Draw text boxes
            textBoxes.forEach(textBoxData => {
                const { x, y, text, fontSize, color, borderColor, borderThickness } = textBoxData;
                
                if (!text || text.trim() === '') return;
                
                const scaledX = x * scaleX;
                const scaledY = y * scaleY;
                const scaledFontSize = fontSize * scale;
                
                saveCtx.font = `bold ${scaledFontSize}px Impact, "Arial Black", sans-serif`;
                saveCtx.textAlign = 'center';
                saveCtx.textBaseline = 'middle';
                
                const textBox = textBoxData.element;
                const textBoxWidth = textBox.offsetWidth * scaleX;
                const textBoxHeight = textBox.offsetHeight * scaleY;
                const centerX = scaledX + textBoxWidth / 2;
                const centerY = scaledY + textBoxHeight / 2;
                
                const thickness = borderThickness || 3;
                if (thickness > 0) {
                    const scaledBorderThickness = thickness * scale;
                    saveCtx.strokeStyle = borderColor || '#000000';
                    saveCtx.lineWidth = Math.max(1, scaledBorderThickness);
                    saveCtx.lineJoin = 'round';
                    saveCtx.miterLimit = 2;
                    saveCtx.strokeText(text, centerX, centerY);
                }
                
                saveCtx.fillStyle = color || '#FFFFFF';
                saveCtx.fillText(text, centerX, centerY);
            });
            
            // Convert canvas to blob
            saveCanvas.toBlob(async (blob) => {
                if (!blob) {
                    showNotification('Error creating image. Please try again.', 'error');
                    return;
                }
                
                // Generate filename with timestamp
                const now = new Date();
                const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const filename = `meme_${timestamp}.png`;
                
                // Try to use File System Access API (if available)
                if ('showSaveFilePicker' in window) {
                    try {
                        const fileHandle = await window.showSaveFilePicker({
                            suggestedName: filename,
                            types: [{
                                description: 'PNG Image',
                                accept: { 'image/png': ['.png'] }
                            }]
                        });
                        
                        const writable = await fileHandle.createWritable();
                        await writable.write(blob);
                        await writable.close();
                        
                        showNotification('Meme saved successfully!', 'success');
                    } catch (error) {
                        if (error.name !== 'AbortError') {
                            console.error('Error saving file:', error);
                            // Fallback to download
                            downloadBlob(blob, filename);
                        }
                    }
                } else {
                    // Fallback: trigger download
                    downloadBlob(blob, filename);
                }
            }, 'image/png');
        } catch (error) {
            if (error.message === 'CORS_ERROR' || error.name === 'SecurityError') {
                showNotification('Unable to save meme due to CORS restrictions. Please upload your own image instead.', 'error');
            } else {
                showNotification('Error saving meme: ' + error.message, 'error');
            }
        }
    };
    
    // Helper function to download blob
    const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Meme saved successfully!', 'success');
    };
    
    // If external URL, try to get CORS-enabled version
    if (isExternalUrl) {
        if (isCorsEnabled) {
            try {
                await performSave(memeImage);
                return;
            } catch (error) {
                console.warn('Direct CORS image failed, trying proxy');
            }
        }
        
        // Show loading indicator
        const originalButtonText = saveBtn.textContent;
        saveBtn.disabled = true;
        saveBtn.textContent = '⏳ Saving...';
        
        // Try proxy services
        const proxyServices = [
            () => `https://corsproxy.io/?${encodeURIComponent(originalImageUrl)}`,
            () => `https://api.allorigins.win/raw?url=${encodeURIComponent(originalImageUrl)}`
        ];
        
        let proxyIndex = 0;
        
        const tryNextProxy = async () => {
            if (proxyIndex >= proxyServices.length) {
                saveBtn.disabled = false;
                saveBtn.textContent = originalButtonText;
                showNotification('Unable to save meme due to CORS restrictions. Please upload your own image instead.', 'error');
                return;
            }
            
            const corsImage = new Image();
            corsImage.crossOrigin = 'anonymous';
            
            corsImage.onload = async () => {
                await performSave(corsImage);
                saveBtn.disabled = false;
                saveBtn.textContent = originalButtonText;
            };
            
            corsImage.onerror = () => {
                proxyIndex++;
                tryNextProxy();
            };
            
            corsImage.src = proxyServices[proxyIndex]();
        };
        
        tryNextProxy();
        return;
    }
    
    // For local/uploaded images, save directly
    await performSave(memeImage);
}

// Show notification function
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Download button handler
downloadBtn.addEventListener('click', downloadMeme);

// Save button handler
if (saveBtn) {
    saveBtn.addEventListener('click', saveMeme);
}

// Back to gallery button handler
if (backToGalleryBtn) {
    backToGalleryBtn.addEventListener('click', showGallery);
}

// Click on overlay to deselect
textOverlay.addEventListener('click', (e) => {
    if (e.target === textOverlay) {
        setActiveTextBox(null);
        textInput.value = '';
    }
});

// Initialize
(async () => {
    try {
        await initDB();
    } catch (error) {
        console.error('Database initialization error:', error);
    }
    
    // Initialize gallery (works with or without DB)
    await initGallery();
})();

