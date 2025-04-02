// Utils.js - Utility functions for the demolition project dashboard

/**
 * Shows a modal by ID
 * @param {string} modalId - The ID of the modal to show
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // First set display to flex, then add active class after a short delay
    // This allows for transition animation
    modal.style.display = 'flex';
    
    // Trigger reflow to ensure transition works
    modal.offsetHeight;
    
    // Add active class for animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

/**
 * Hides a modal by ID
 * @param {string} modalId - The ID of the modal to hide
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // First remove active class, then hide after transition ends
    modal.classList.remove('active');
    
    // Wait for transition to finish before setting display to none
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Match this with your CSS transition duration
}

/**
 * Handles Excel file import
 * @param {Function} callback - Callback function to process imported data
 */
function handleExcelImport(callback) {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls, .csv';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Show loading message
        showToast('Import Started', 'Processing Excel file...', 'info');
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = event.target.result;
                
                // Check if XLSX is available
                if (typeof XLSX === 'undefined') {
                    throw new Error('XLSX library not loaded');
                }
                
                // Parse Excel data
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { 
                    raw: false,
                    dateNF: 'YYYY-MM-DD'
                });
                
                // Process the data
                if (typeof callback === 'function') {
                    callback(jsonData);
                }
            } catch (error) {
                console.error('Error processing Excel file:', error);
                showToast('Import Failed', 'Failed to process Excel file. Please check the format and try again.', 'error');
            }
        };
        
        reader.onerror = () => {
            console.error('Error reading file');
            showToast('Import Failed', 'Error reading file. Please try again.', 'error');
        };
        
        reader.readAsBinaryString(file);
    };
    
    // Trigger file selection
    input.click();
}

/**
 * Exports data to Excel file
 * @param {Array} data - Data to export
 * @param {string} filename - Name of the exported file
 * @returns {boolean} Success status
 */
function exportToExcel(data, filename) {
    if (!data || !data.length) {
        showToast('Export Failed', 'No data to export', 'error');
        return false;
    }
    
    try {
        // Check if XLSX is available
        if (typeof XLSX === 'undefined') {
            throw new Error('XLSX library not loaded');
        }
        
        // Convert data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // Create workbook and add worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        
        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, filename);
        
        showToast('Export Complete', 'Data exported successfully', 'success');
        return true;
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showToast('Export Failed', 'Failed to export data to Excel. Please try again.', 'error');
        return false;
    }
}

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    if (isNaN(amount)) return '$0';
    
    // Format large numbers with abbreviations
    if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(0)}K`;
    } else {
        return `$${amount.toFixed(0)}`;
    }
}

/**
 * Format date for display
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (error) {
        return 'Invalid Date';
    }
}

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date string for input fields
 */
function formatDateForInput(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch (error) {
        return '';
    }
}

/**
 * Get days remaining until a date
 * @param {string} dateString - Target date
 * @returns {string} Days remaining text
 */
function getDaysRemaining(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const dueDate = new Date(dateString);
        const today = new Date();
        
        // Reset time to compare just the dates
        dueDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        // Calculate difference in days
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return 'Overdue';
        } else if (diffDays === 0) {
            return 'Due today';
        } else if (diffDays === 1) {
            return '1 day';
        } else {
            return `${diffDays} days`;
        }
    } catch (error) {
        return 'N/A';
    }
}

/**
 * Shows a toast notification
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, warning, info)
 */
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        // Create toast container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
        
        // Use the new container
        return showToast(title, message, type);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    } else if (type === 'error') {
        iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else if (type === 'warning') {
        iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    } else {
        iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
    
    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add event listener to close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

/**
 * Creates a mock API for development and testing
 * This allows the dashboard to function without a server
 */
function setupMockAPI() {
    // Check if running from file (no server)
    if (window.location.protocol === 'file:') {
        console.log('Running locally - using mock API');
        
        // Intercept fetch requests
        const originalFetch = window.fetch;
        window.fetch = function(url, options = {}) {
            // API endpoints
            if (typeof url === 'string' && url.includes('/api/')) {
                return handleMockRequest(url, options);
            }
            
            // Pass through other requests
            return originalFetch(url, options);
        };
    }
}

/**
 * Handle mock API requests
 * @param {string} url - Request URL
 * @param {object} options - Request options
 * @returns {Promise} Mock response
 */
function handleMockRequest(url, options) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            // Determine endpoint
            const endpoint = url.split('/api/')[1].split('/')[0];
            const id = url.split('/api/')[1].split('/')[1];
            
            // Prepare response
            let status = 200;
            let responseData = [];
            
            // Get localStorage data
            const storedData = localStorage.getItem('dashboardData');
            const data = storedData ? JSON.parse(storedData) : {
                projects: [],
                rfis: [],
                tasks: []
            };
            
            // Handle GET requests
            if (options.method === undefined || options.method === 'GET') {
                if (endpoint === 'projects') {
                    responseData = data.projects || [];
                } else if (endpoint === 'rfis') {
                    responseData = data.rfis || [];
                } else if (endpoint === 'tasks') {
                    responseData = data.tasks || [];
                } else {
                    status = 404;
                    responseData = { error: 'Not found' };
                }
            }
            // Handle POST requests (create)
            else if (options.method === 'POST') {
                try {
                    const body = JSON.parse(options.body);
                    const newId = Date.now(); // Generate unique ID
                    
                    if (endpoint === 'projects') {
                        const newProject = { id: newId, ...body };
                        data.projects.push(newProject);
                        responseData = { id: newId };
                    } else if (endpoint === 'rfis') {
                        const newRFI = { id: newId, ...body };
                        data.rfis.push(newRFI);
                        responseData = { id: newId };
                    } else if (endpoint === 'tasks') {
                        const newTask = { id: newId, ...body };
                        data.tasks.push(newTask);
                        responseData = { id: newId };
                    } else {
                        status = 404;
                        responseData = { error: 'Not found' };
                    }
                    
                    // Save updated data
                    localStorage.setItem('dashboardData', JSON.stringify(data));
                } catch (e) {
                    status = 400;
                    responseData = { error: 'Invalid request' };
                }
            }
            // Handle PUT requests (update)
            else if (options.method === 'PUT') {
                try {
                    const body = JSON.parse(options.body);
                    
                    if (endpoint === 'projects') {
                        const index = data.projects.findIndex(p => p.id === parseInt(id));
                        if (index !== -1) {
                            data.projects[index] = { ...data.projects[index], ...body };
                            responseData = { id: parseInt(id) };
                        } else {
                            status = 404;
                            responseData = { error: 'Project not found' };
                        }
                    } else if (endpoint === 'rfis') {
                        const index = data.rfis.findIndex(r => r.id === parseInt(id));
                        if (index !== -1) {
                            data.rfis[index] = { ...data.rfis[index], ...body };
                            responseData = { id: parseInt(id) };
                        } else {
                            status = 404;
                            responseData = { error: 'RFI not found' };
                        }
                    } else if (endpoint === 'tasks') {
                        const index = data.tasks.findIndex(t => t.id === parseInt(id));
                        if (index !== -1) {
                            data.tasks[index] = { ...data.tasks[index], ...body };
                            responseData = { id: parseInt(id) };
                        } else {
                            status = 404;
                            responseData = { error: 'Task not found' };
                        }
                    } else {
                        status = 404;
                        responseData = { error: 'Not found' };
                    }
                    
                    // Save updated data
                    localStorage.setItem('dashboardData', JSON.stringify(data));
                } catch (e) {
                    status = 400;
                    responseData = { error: 'Invalid request' };
                }
            }
            // Handle PATCH requests (partial update)
            else if (options.method === 'PATCH') {
                try {
                    const body = JSON.parse(options.body);
                    
                    if (endpoint === 'projects') {
                        const index = data.projects.findIndex(p => p.id === parseInt(id));
                        if (index !== -1) {
                            data.projects[index] = { ...data.projects[index], ...body };
                            responseData = { id: parseInt(id) };
                        } else {
                            status = 404;
                            responseData = { error: 'Project not found' };
                        }
                    } else if (endpoint === 'rfis') {
                        const index = data.rfis.findIndex(r => r.id === parseInt(id));
                        if (index !== -1) {
                            data.rfis[index] = { ...data.rfis[index], ...body };
                            responseData = { id: parseInt(id) };
                        } else {
                            status = 404;
                            responseData = { error: 'RFI not found' };
                        }
                    } else if (endpoint === 'tasks') {
                        const index = data.tasks.findIndex(t => t.id === parseInt(id));
                        if (index !== -1) {
                            data.tasks[index] = { ...data.tasks[index], ...body };
                            responseData = { id: parseInt(id) };
                        } else {
                            status = 404;
                            responseData = { error: 'Task not found' };
                        }
                    } else {
                        status = 404;
                        responseData = { error: 'Not found' };
                    }
                    
                    // Save updated data
                    localStorage.setItem('dashboardData', JSON.stringify(data));
                } catch (e) {
                    status = 400;
                    responseData = { error: 'Invalid request' };
                }
            }
            // Handle DELETE requests
            else if (options.method === 'DELETE') {
                if (endpoint === 'projects') {
                    data.projects = data.projects.filter(p => p.id !== parseInt(id));
                    // Also remove associated RFIs and tasks
                    data.rfis = data.rfis.filter(r => r.project_id !== parseInt(id));
                    data.tasks = data.tasks.filter(t => t.project_id !== parseInt(id));
                    responseData = { id: parseInt(id) };
                } else if (endpoint === 'rfis') {
                    data.rfis = data.rfis.filter(r => r.id !== parseInt(id));
                    responseData = { id: parseInt(id) };
                } else if (endpoint === 'tasks') {
                    data.tasks = data.tasks.filter(t => t.id !== parseInt(id));
                    responseData = { id: parseInt(id) };
                } else {
                    status = 404;
                    responseData = { error: 'Not found' };
                }
                
                // Save updated data
                localStorage.setItem('dashboardData', JSON.stringify(data));
            }
            
            // Create mock response
            resolve({
                ok: status >= 200 && status < 300,
                status: status,
                json: () => Promise.resolve(responseData)
            });
        }, 300); // Simulate network delay
    });
}

// Initialize mock API for local development
document.addEventListener('DOMContentLoaded', setupMockAPI);