/**
 * Enhanced Dashboard Functionality
 * This script adds interactive functionality to the existing dashboard
 * using the established CSS classes and styling
 */

// Store dashboard data in a central state object
let dashboardData = {
    projects: [
        {
            id: 1,
            name: "Highland Office Tower",
            value: 4500000,
            due_date: "2025-10-30",
            status: "active",
            description: "Demolition of 15-story office building",
            location: "Downtown district",
            progress: 35
        },
        {
            id: 2,
            name: "Riverside Apartments",
            value: 8200000,
            due_date: "2026-08-15",
            status: "bidding",
            description: "Complete demolition of apartment complex",
            location: "Riverside area",
            progress: 10
        },
        {
            id: 3,
            name: "Central Park Renovation",
            value: 1800000,
            due_date: "2025-05-20",
            status: "active",
            description: "Partial demolition and renovation",
            location: "Central Park",
            progress: 65
        },
        {
            id: 4,
            name: "Oakridge Elementary School",
            value: 3200000,
            due_date: "2025-01-15",
            status: "completed",
            description: "School building demolition",
            location: "Oakridge district",
            progress: 100
        }
    ],
    rfis: [
        {
            id: 1,
            title: "HVAC Duct Conflict",
            project_id: 1,
            due_date: "2025-03-25",
            priority: "urgent",
            status: "pending",
            description: "Need clarification on HVAC duct routing through structural beams."
        },
        {
            id: 2,
            title: "Structural Support Detail",
            project_id: 3,
            due_date: "2025-03-28",
            priority: "high",
            status: "pending",
            description: "Request detailed information on temporary structural supports during demolition."
        },
        {
            id: 3,
            title: "Exterior Finish Specification",
            project_id: 3,
            due_date: "2025-04-05",
            priority: "medium",
            status: "pending",
            description: "Need clarification on exterior finish removal process."
        }
    ],
    tasks: [
        {
            id: 1,
            title: "Review structural drawings",
            project_id: 1,
            due_date: "2025-03-22",
            priority: "high",
            completed: false,
            description: "Complete structural drawing review for demo sequence planning."
        },
        {
            id: 2,
            title: "Prepare bid package for subcontractors",
            project_id: 2,
            due_date: "2025-03-25",
            priority: "medium",
            completed: false,
            description: "Finalize and distribute bid package to qualified subcontractors."
        },
        {
            id: 3,
            title: "Schedule site inspection",
            project_id: 3,
            due_date: "2025-03-21",
            priority: "medium",
            completed: false,
            description: "Coordinate pre-demolition site inspection with city officials."
        }
    ],
    metrics: {
        activeValue: 0,
        pendingRFIs: 0,
        currentBids: 0,
        completionRate: 0
    },
    activeView: 'dashboard' // Can be 'dashboard', 'projects', 'rfis', 'tasks'
};

// Initialize the dashboard when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced Dashboard Initialized');
    initializeDashboard();
});

/**
 * Initialize the dashboard with enhanced functionality
 */
function initializeDashboard() {
    // Create the dashboard tabs if they don't exist
    createDashboardTabs();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial data load
    updateDashboardData();
    
    // Update dashboard components
    renderDashboard();
    
    // Set current date
    updateCurrentDate();
}

/**
 * Create dashboard tabs for better navigation
 */
function createDashboardTabs() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Don't create tabs if they already exist
    if (document.querySelector('.dashboard-tabs')) return;
    
    // Create tabs container
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'dashboard-tabs';
    
    // Define tabs
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', active: true },
        { id: 'projects', label: 'Projects' },
        { id: 'rfis', label: 'RFIs' },
        { id: 'tasks', label: 'Tasks' }
    ];
    
    // Create tab buttons
    tabs.forEach(tab => {
        const tabButton = document.createElement('div');
        tabButton.className = `dashboard-tab${tab.active ? ' active' : ''}`;
        tabButton.setAttribute('data-tab', tab.id);
        tabButton.textContent = tab.label;
        
        tabButton.addEventListener('click', () => {
            // Set active tab
            document.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
            tabButton.classList.add('active');
            
            // Update active view
            dashboardData.activeView = tab.id;
            
            // Render appropriate view
            renderDashboard();
        });
        
        tabsContainer.appendChild(tabButton);
    });
    
    // Insert tabs after dashboard header
    const dashboardHeader = document.querySelector('.dashboard-header');
    if (dashboardHeader) {
        dashboardHeader.insertAdjacentElement('afterend', tabsContainer);
    } else {
        container.prepend(tabsContainer);
    }
}

/**
 * Setup all event listeners for interactive components
 */
function setupEventListeners() {
    // Refresh button
    const refreshButton = document.getElementById('refreshDashboard');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            // Show loading indicator
            showGlobalLoader();
            
            // Simulate data refresh (1 second)
            setTimeout(function() {
                updateDashboardData();
                renderDashboard();
                hideGlobalLoader();
                showToast('Dashboard Refreshed', 'Data has been updated successfully', 'success');
            }, 1000);
        });
    }
    
    // Excel import button
    const importExcelBtn = document.getElementById('importExcel');
    if (importExcelBtn) {
        importExcelBtn.addEventListener('click', handleExcelImport);
    }
    
    // Excel export button
    const exportExcelBtn = document.getElementById('exportExcel');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', handleExcelExport);
    }
    
    // Sync files button
    const syncFilesBtn = document.getElementById('syncFiles');
    if (syncFilesBtn) {
        syncFilesBtn.addEventListener('click', function() {
            showToast('Sync Started', 'Synchronizing project files...', 'info');
            showGlobalLoader();
            
            // Simulate sync process (2 seconds)
            setTimeout(function() {
                hideGlobalLoader();
                showToast('Sync Complete', 'Project files synchronized successfully', 'success');
            }, 2000);
        });
    }
    
    // Add project button
    const addProjectBtn = document.getElementById('addNewProject');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', function() {
            // Reset project form
            resetProjectForm();
            // Show add project modal
            showModal('addProjectModal');
        });
    }
    
    // Project form submission
    const projectForm = document.getElementById('addProjectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleProjectFormSubmit();
        });
    }
    
    // RFI buttons
    const quickRFIBtn = document.getElementById('quickRFI');
    if (quickRFIBtn) {
        quickRFIBtn.addEventListener('click', function() {
            // Reset RFI form
            resetRFIForm();
            // Show RFI modal
            showModal('quickRFIModal');
        });
    }
    
    // Generate RFI button
    const generateRFIBtn = document.getElementById('generateRFI');
    if (generateRFIBtn) {
        generateRFIBtn.addEventListener('click', function() {
            // Reset RFI form
            resetRFIForm();
            // Show RFI modal
            showModal('quickRFIModal');
        });
    }
    
    // RFI form submission
    const rfiForm = document.getElementById('quickRFIForm');
    if (rfiForm) {
        rfiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRFIFormSubmit();
        });
    }
    
    // Add task button
    const addTaskBtn = document.getElementById('addTask');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', function() {
            // Reset task form
            resetTaskForm();
            // Show task modal
            showModal('addTaskModal');
        });
    }
    
    // Task form submission
    const taskForm = document.getElementById('addTaskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleTaskFormSubmit();
        });
    }
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(function(button) {
        button.addEventListener('click', function() {
            const modal = button.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });
    
    // Upload document button
    const quickUploadBtn = document.getElementById('quickUpload');
    if (quickUploadBtn) {
        quickUploadBtn.addEventListener('click', function() {
            // Create a file input element programmatically
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            
            fileInput.addEventListener('change', function(e) {
                if (e.target.files.length > 0) {
                    showToast('Upload Started', `Uploading ${e.target.files.length} file(s)...`, 'info');
                    
                    // Simulate file upload process (1.5 seconds)
                    setTimeout(function() {
                        showToast('Upload Complete', `${e.target.files.length} file(s) uploaded successfully`, 'success');
                    }, 1500);
                }
            });
            
            // Trigger the file input click
            fileInput.click();
        });
    }
    
    // Week navigation buttons
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    const weekRangeEl = document.getElementById('weekRange');
    
    if (prevWeekBtn && weekRangeEl) {
        prevWeekBtn.addEventListener('click', function() {
            // Simulate navigation to previous week
            weekRangeEl.textContent = 'Mar 6 - Mar 12, 2025';
            showToast('Week Changed', 'Viewing previous week', 'info');
            
            // Redraw tasks for the "new" week
            renderTasks();
        });
    }
    
    if (nextWeekBtn && weekRangeEl) {
        nextWeekBtn.addEventListener('click', function() {
            // Simulate navigation to next week
            weekRangeEl.textContent = 'Mar 20 - Mar 26, 2025';
            showToast('Week Changed', 'Viewing next week', 'info');
            
            // Redraw tasks for the "new" week
            renderTasks();
        });
    }
    
    // Export dropdown toggle
    const exportDropdownToggle = document.getElementById('exportDropdownToggle');
    const exportDropdown = document.getElementById('exportDropdown');
    
    if (exportDropdownToggle && exportDropdown) {
        exportDropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            exportDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (exportDropdown.classList.contains('show') && 
                !exportDropdown.contains(e.target) && 
                !exportDropdownToggle.contains(e.target)) {
                exportDropdown.classList.remove('show');
            }
        });
    }
    
    // PDF export option
    const exportPDF = document.getElementById('exportPDF');
    if (exportPDF) {
        exportPDF.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Export Started', 'Exporting dashboard as PDF...', 'info');
            
            // Simulate PDF export process (1.5 seconds)
            setTimeout(function() {
                showToast('Export Complete', 'Dashboard exported as PDF successfully', 'success');
                if (exportDropdown) exportDropdown.classList.remove('show');
            }, 1500);
        });
    }
    
    // CSV export option
    const exportCSV = document.getElementById('exportCSV');
    if (exportCSV) {
        exportCSV.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Export Started', 'Exporting dashboard as CSV...', 'info');
            
            // Simulate CSV export process (1.5 seconds)
            setTimeout(function() {
                showToast('Export Complete', 'Dashboard exported as CSV successfully', 'success');
                if (exportDropdown) exportDropdown.classList.remove('show');
            }, 1500);
        });
    }
    
    // Period selector for chart
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Remove active class from all period buttons
            periodButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to the clicked button
            button.classList.add('active');
            
            // Update chart with the selected period
            const period = button.getAttribute('data-period');
            updateChartPeriod(period);
        });
    });
    
    // Initialize nav toggle button if it exists
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    
    if (navToggle && nav) {
        navToggle.addEventListener('click', function() {
            nav.classList.toggle('collapsed');
            document.body.classList.toggle('nav-collapsed');
        });
    }
}

/**
 * Update the current date display
 */
function updateCurrentDate() {
    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) {
        const now = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        currentDateEl.textContent = now.toLocaleDateString('en-US', options);
    }
}

/**
 * Calculate and update dashboard metrics
 */
function updateDashboardData() {
    // Calculate active projects value
    const activeProjects = dashboardData.projects.filter(p => p.status === 'active');
    const activeValue = activeProjects.reduce((sum, p) => sum + p.value, 0);
    
    // Calculate other metrics
    const pendingRFIs = dashboardData.rfis.length;
    const biddingProjects = dashboardData.projects.filter(p => p.status === 'bidding').length;
    const completedProjects = dashboardData.projects.filter(p => p.status === 'completed').length;
    const completionRate = dashboardData.projects.length > 0 ? 
        Math.round((completedProjects / dashboardData.projects.length) * 100) : 0;
    
    // Update metrics
    dashboardData.metrics = {
        activeValue,
        pendingRFIs,
        currentBids: biddingProjects,
        completionRate
    };
}

/**
 * Render the appropriate view based on the active view
 */
function renderDashboard() {
    updateDashboardComponents();
    
    // Update the view based on the active view
    switch (dashboardData.activeView) {
        case 'dashboard':
            renderDashboardView();
            break;
        case 'projects':
            renderProjectsView();
            break;
        case 'rfis':
            renderRFIsView();
            break;
        case 'tasks':
            renderTasksView();
            break;
    }
}

/**
 * Update dashboard components that are shown on all views
 */
function updateDashboardComponents() {
    // Update metrics display
    updateMetricsDisplay();
    
    // Update project list
    renderProjects();
    
    // Update RFI list
    renderRFIs();
    
    // Update task list
    renderTasks();
    
    // Update charts
    updateCharts();
    
    // Update form dropdowns with projects
    updateProjectDropdowns();
}

/**
 * Render the main dashboard view
 */
function renderDashboardView() {
    // Show all sections relevant to the dashboard
    document.querySelectorAll('.card, .quick-stats, .excel-integration').forEach(el => {
        el.style.display = 'flex';
    });
}

/**
 * Render the projects view
 */
function renderProjectsView() {
    // Hide all sections initially
    document.querySelectorAll('.card, .quick-stats, .excel-integration').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show only the projects card
    const projectsCard = document.querySelector('.card:has(.card-title:contains("Active Projects"))');
    if (projectsCard) {
        projectsCard.style.display = 'flex';
    }
    
    // Create a filter section if it doesn't exist
    let filterSection = document.querySelector('.projects-filter');
    if (!filterSection) {
        filterSection = document.createElement('div');
        filterSection.className = 'projects-filter card';
        filterSection.innerHTML = `
            <div class="card-header">
                <h2 class="card-title">Project Filters</h2>
            </div>
            <div class="card-content">
                <div class="filter-buttons">
                    <button class="btn btn-sm active" data-filter="all">All Projects</button>
                    <button class="btn btn-sm" data-filter="active">Active</button>
                    <button class="btn btn-sm" data-filter="bidding">Bidding</button>
                    <button class="btn btn-sm" data-filter="completed">Completed</button>
                </div>
                <div class="search-box mt-4">
                    <input type="text" id="projectSearch" placeholder="Search projects..." class="form-control">
                </div>
            </div>
        `;
        
        // Insert filter section before first card
        const firstCard = document.querySelector('.card');
        if (firstCard) {
            firstCard.parentNode.insertBefore(filterSection, firstCard);
        }
        
        // Add event listeners to filter buttons
        filterSection.querySelectorAll('.btn[data-filter]').forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all filter buttons
                filterSection.querySelectorAll('.btn[data-filter]').forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Apply filter
                const filter = btn.getAttribute('data-filter');
                applyProjectFilter(filter);
            });
        });
        
        // Add event listener to search input
        const searchInput = filterSection.querySelector('#projectSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                applyProjectSearch(searchTerm);
            });
        }
    }
    
    // Show filter section
    filterSection.style.display = 'flex';
}

/**
 * Apply filter to projects list
 * @param {string} filter - Filter type (all, active, bidding, completed)
 */
function applyProjectFilter(filter) {
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        const status = item.querySelector('.project-status').textContent.toLowerCase();
        
        if (filter === 'all' || status === filter) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Apply search filter to projects list
 * @param {string} searchTerm - Search term
 */
function applyProjectSearch(searchTerm) {
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        const projectName = item.querySelector('.project-title').textContent.toLowerCase();
        const projectDetails = item.querySelector('.project-details').textContent.toLowerCase();
        
        if (projectName.includes(searchTerm) || projectDetails.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Render the RFIs view
 */
function renderRFIsView() {
    // Hide all sections initially
    document.querySelectorAll('.card, .quick-stats, .excel-integration').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show only the RFIs card
    const rfisCard = document.querySelector('.card:has(.card-title:contains("Pending RFIs"))');
    if (rfisCard) {
        rfisCard.style.display = 'flex';
    }
    
    // Create a RFI details section if it doesn't exist
    let rfiDetailsSection = document.querySelector('.rfi-details');
    if (!rfiDetailsSection) {
        rfiDetailsSection = document.createElement('div');
        rfiDetailsSection.className = 'rfi-details card';
        rfiDetailsSection.innerHTML = `
            <div class="card-header">
                <h2 class="card-title">RFI Details</h2>
                <div class="card-actions">
                    <button class="btn btn-primary" id="createRFI">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create RFI
                    </button>
                </div>
            </div>
            <div class="card-content">
                <p class="empty-message">Select an RFI to view details</p>
                <div class="rfi-detail-content" style="display: none;">
                    <h3 class="rfi-detail-title"></h3>
                    <div class="rfi-detail-meta">
                        <div class="rfi-detail-project"></div>
                        <div class="rfi-detail-due"></div>
                        <div class="rfi-detail-priority"></div>
                    </div>
                    <div class="rfi-detail-description mt-4"></div>
                </div>
            </div>
        `;
        
        // Insert RFI details section after RFIs card
        if (rfisCard) {
            rfisCard.parentNode.insertBefore(rfiDetailsSection, rfisCard.nextSibling);
        }
        
        // Add event listener to Create RFI button
        const createRFIBtn = rfiDetailsSection.querySelector('#createRFI');
        if (createRFIBtn) {
            createRFIBtn.addEventListener('click', function() {
                resetRFIForm();
                showModal('quickRFIModal');
            });
        }
    }
    
    // Add click event listeners to RFI items
    const rfiItems = document.querySelectorAll('.rfi-item');
    rfiItems.forEach(item => {
        item.addEventListener('click', function() {
            const rfiId = parseInt(this.getAttribute('data-id'));
            displayRFIDetails(rfiId, rfiDetailsSection);
        });
    });
    
    // Show RFI details section
    rfiDetailsSection.style.display = 'flex';
}

/**
 * Display RFI details in the details section
 * @param {number} rfiId - RFI ID
 * @param {HTMLElement} detailsSection - Details section element
 */
function displayRFIDetails(rfiId, detailsSection) {
    const rfi = dashboardData.rfis.find(r => r.id === rfiId);
    if (!rfi || !detailsSection) return;
    
    const emptyMessage = detailsSection.querySelector('.empty-message');
    const detailContent = detailsSection.querySelector('.rfi-detail-content');
    
    if (emptyMessage && detailContent) {
        emptyMessage.style.display = 'none';
        detailContent.style.display = 'block';
        
        // Update RFI details
        detailContent.querySelector('.rfi-detail-title').textContent = rfi.title;
        
        // Get project name
        const project = dashboardData.projects.find(p => p.id === rfi.project_id);
        const projectName = project ? project.name : 'Unknown Project';
        
        detailContent.querySelector('.rfi-detail-project').textContent = `Project: ${projectName}`;
        detailContent.querySelector('.rfi-detail-due').textContent = `Due: ${formatDate(rfi.due_date)}`;
        
        const priorityEl = detailContent.querySelector('.rfi-detail-priority');
        priorityEl.textContent = rfi.priority.charAt(0).toUpperCase() + rfi.priority.slice(1);
        priorityEl.className = `rfi-detail-priority rfi-badge ${rfi.priority}`;
        
        detailContent.querySelector('.rfi-detail-description').textContent = rfi.description || 'No description provided.';
    }
}

/**
 * Render the tasks view
 */
function renderTasksView() {
    // Hide all sections initially
    document.querySelectorAll('.card, .quick-stats, .excel-integration').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show only the tasks card
    const tasksCard = document.querySelector('.card:has(.card-title:contains("Upcoming Tasks"))');
    if (tasksCard) {
        tasksCard.style.display = 'flex';
    }
    
    // Create a calendar view if it doesn't exist
    let calendarView = document.querySelector('.task-calendar');
    if (!calendarView) {
        calendarView = document.createElement('div');
        calendarView.className = 'task-calendar card';
        calendarView.innerHTML = `
            <div class="card-header">
                <h2 class="card-title">Task Calendar</h2>
                <div class="card-actions">
                    <button class="btn btn-primary" id="createTask">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Task
                    </button>
                </div>
            </div>
            <div class="card-content">
                <div class="calendar-header">
                    <div class="calendar-navigation">
                        <button class="nav-btn" id="prevMonth">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <span id="currentMonth">March 2025</span>
                        <button class="nav-btn" id="nextMonth">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="calendar-grid">
                    <div class="calendar-day-header">Sun</div>
                    <div class="calendar-day-header">Mon</div>
                    <div class="calendar-day-header">Tue</div>
                    <div class="calendar-day-header">Wed</div>
                    <div class="calendar-day-header">Thu</div>
                    <div class="calendar-day-header">Fri</div>
                    <div class="calendar-day-header">Sat</div>
                    ${generateCalendarDays()}
                </div>
            </div>
        `;
        
        // Insert calendar view after tasks card
        if (tasksCard) {
            tasksCard.parentNode.insertBefore(calendarView, tasksCard.nextSibling);
        }
        
        // Add event listener to Create Task button
        const createTaskBtn = calendarView.querySelector('#createTask');
        if (createTaskBtn) {
            createTaskBtn.addEventListener('click', function() {
                resetTaskForm();
                showModal('addTaskModal');
            });
        }
        
        // Add event listeners to month navigation
        const prevMonthBtn = calendarView.querySelector('#prevMonth');
        const nextMonthBtn = calendarView.querySelector('#nextMonth');
        const currentMonthEl = calendarView.querySelector('#currentMonth');
        
        if (prevMonthBtn && currentMonthEl) {
            prevMonthBtn.addEventListener('click', function() {
                currentMonthEl.textContent = 'February 2025';
                showToast('Calendar Updated', 'Viewing February 2025', 'info');
            });
        }
        
        if (nextMonthBtn && currentMonthEl) {
            nextMonthBtn.addEventListener('click', function() {
                currentMonthEl.textContent = 'April 2025';
                showToast('Calendar Updated', 'Viewing April 2025', 'info');
            });
        }
        
        // Add task indicators to calendar days
        populateCalendarWithTasks();
    }
    
    // Show calendar view
    calendarView.style.display = 'flex';
}

/**
 * Generate calendar days HTML
 * @returns {string} HTML for calendar days
 */
function generateCalendarDays() {
    // For March 2025, first day is a Saturday (index 6)
    const firstDayIndex = 6;
    const daysInMonth = 31;
    
    let html = '';
    
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === 13; // Assuming today is March 13, 2025
        html += `<div class="calendar-day${isToday ? ' today' : ''}" data-day="${day}">${day}</div>`;
    }
    
    return html;
}

/**
 * Add task indicators to calendar days
 */
function populateCalendarWithTasks() {
    dashboardData.tasks.forEach(task => {
        if (!task.due_date) return;
        
        const dueDate = new Date(task.due_date);
        if (dueDate.getMonth() === 2) { // March is month 2 (0-indexed)
            const day = dueDate.getDate();
            const dayCell = document.querySelector(`.calendar-day[data-day="${day}"]`);
            
            if (dayCell) {
                // Check if task indicator already exists
                if (!dayCell.querySelector('.task-indicator')) {
                    const indicator = document.createElement('div');
                    indicator.className = `task-indicator ${task.priority}`;
                    indicator.setAttribute('title', task.title);
                    dayCell.appendChild(indicator);
                }
            }
        }
    });
}

/**
 * Update metrics display
 */
function updateMetricsDisplay() {
    // Update metric values on the dashboard
    const activeValueEl = document.getElementById('activeValue');
    const pendingRFIsEl = document.getElementById('pendingRFIs');
    const currentBidsEl = document.getElementById('currentBids');
    const completionRateEl = document.getElementById('completionRate');
    
    if (activeValueEl) activeValueEl.textContent = formatCurrency(dashboardData.metrics.activeValue);
    if (pendingRFIsEl) pendingRFIsEl.textContent = dashboardData.metrics.pendingRFIs;
    if (currentBidsEl) currentBidsEl.textContent = dashboardData.metrics.currentBids;
    if (completionRateEl) completionRateEl.textContent = `${dashboardData.metrics.completionRate}%`;
}

/**
 * Render projects list
 */
function renderProjects() {
    const projectList = document.getElementById('projectList');
    if (!projectList) return;
    
    // Clear existing content
    projectList.innerHTML = '';
    
    // Sort projects by status and due date
    const sortedProjects = [...dashboardData.projects].sort((a, b) => {
        // Sort by status priority (active > bidding > completed)
        const statusPriority = { active: 0, bidding: 1, completed: 2 };
        const statusDiff = statusPriority[a.status] - statusPriority[b.status];
        
        if (statusDiff !== 0) return statusDiff;
        
        // Then sort by due date
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);
        return dateA - dateB;
    });
    
    // Add projects to the list
    sortedProjects.forEach(project => {
        const li = document.createElement('li');
        li.className = 'project-item';
        li.dataset.id = project.id;
        
        li.innerHTML = `
            <div class="project-info">
                <div class="project-title">${project.name}</div>
                <div class="project-details">Value: ${formatCurrency(project.value)} | Due: ${formatDate(project.due_date)}</div>
            </div>
            <div class="project-actions">
                <span class="project-status status-${project.status}">${project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
                <div class="action-buttons">
                    <button class="btn-icon edit-project" title="Edit Project" data-id="${project.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete-project" title="Delete Project" data-id="${project.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        projectList.appendChild(li);
        
        // Add event listeners to action buttons
        li.querySelector('.edit-project').addEventListener('click', e => {
            e.stopPropagation(); // Prevent triggering the parent click event
            editProject(project.id);
        });
        
        li.querySelector('.delete-project').addEventListener('click', e => {
            e.stopPropagation(); // Prevent triggering the parent click event
            deleteProject(project.id);
        });
        
        // Add click event to the entire project item to view project details
        li.addEventListener('click', () => {
            // This would normally navigate to a project details page
            // For the demo, we'll show a toast
            showToast('Project Selected', `Viewing details for ${project.name}`, 'info');
        });
    });
}
/**
 * Render RFIs list
 */
function renderRFIs() {
    const rfiList = document.getElementById('rfiList');
    if (!rfiList) return;
    
    // Clear existing content
    rfiList.innerHTML = '';
    
    // Sort RFIs by priority and due date
    const sortedRFIs = [...dashboardData.rfis].sort((a, b) => {
        // Sort by priority (urgent > high > medium > low)
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then sort by due date
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);
        return dateA - dateB;
    });
    
    // Add RFIs to the list
    sortedRFIs.forEach(rfi => {
        const li = document.createElement('li');
        li.className = 'rfi-item';
        li.dataset.id = rfi.id;
        
        // Find project name
        const project = dashboardData.projects.find(p => p.id === rfi.project_id);
        const projectName = project ? project.name : 'Unknown Project';
        
        li.innerHTML = `
            <div class="rfi-header">
                <div>
                    <div class="rfi-title">${rfi.title}</div>
                    <div class="rfi-project">${projectName}</div>
                </div>
                <div class="rfi-actions">
                    <span class="rfi-badge ${rfi.priority}">${rfi.priority.charAt(0).toUpperCase() + rfi.priority.slice(1)}</span>
                    <div class="action-buttons">
                        <button class="btn-icon edit-rfi" title="Edit RFI" data-id="${rfi.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-icon delete-rfi" title="Delete RFI" data-id="${rfi.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="rfi-meta">
                <div class="rfi-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Due: ${formatDate(rfi.due_date)}
                </div>
                <span>${getDaysRemaining(rfi.due_date)}</span>
            </div>
        `;
        
        rfiList.appendChild(li);
        
        // Add event listeners to action buttons
        li.querySelector('.edit-rfi').addEventListener('click', e => {
            e.stopPropagation(); // Prevent triggering the parent click event
            editRFI(rfi.id);
        });
        
        li.querySelector('.delete-rfi').addEventListener('click', e => {
            e.stopPropagation(); // Prevent triggering the parent click event
            deleteRFI(rfi.id);
        });
    });
    
    // Update RFI badge count
    const rfiNavBadge = document.getElementById('rfiNavBadge');
    if (rfiNavBadge) {
        rfiNavBadge.textContent = dashboardData.rfis.length;
    }
}

/**
 * Render tasks list
 */
function renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;
    
    // Clear existing content
    taskList.innerHTML = '';
    
    // Filter tasks for current week and sort by due date and priority
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    
    const currentWeekTasks = dashboardData.tasks.filter(task => {
        if (!task.due_date) return false;
        
        const dueDate = new Date(task.due_date);
        return dueDate >= startOfWeek && dueDate <= endOfWeek && !task.completed;
    }).sort((a, b) => {
        // Sort by due date first
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);
        const dateDiff = dateA - dateB;
        
        if (dateDiff !== 0) return dateDiff;
        
        // Then by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // Show empty message if no tasks
    if (currentWeekTasks.length === 0) {
        taskList.innerHTML = '<li class="empty-message">No tasks scheduled for this week</li>';
        return;
    }
    
    // Add tasks to the list
    currentWeekTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;
        
        // Find project name
        const project = dashboardData.projects.find(p => p.id === task.project_id);
        const projectName = project ? project.name : 'Unknown Project';
        
        li.innerHTML = `
            <div class="task-checkbox">
                <input type="checkbox" id="task${task.id}" ${task.completed ? 'checked' : ''}>
            </div>
            <div class="task-content">
                <div class="task-header">
                    <div class="task-title">${task.title}</div>
                    <div class="task-actions">
                        <span class="task-badge ${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                        <div class="action-buttons">
                            <button class="btn-icon edit-task" title="Edit Task" data-id="${task.id}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="btn-icon delete-task" title="Delete Task" data-id="${task.id}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="task-project">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    ${projectName} | Due: ${formatDate(task.due_date)}
                </div>
            </div>
        `;
        
        taskList.appendChild(li);
        
        // Add event listeners
        const checkbox = li.querySelector(`#task${task.id}`);
        checkbox.addEventListener('change', e => {
            const isCompleted = e.target.checked;
            updateTaskStatus(task.id, isCompleted);
            
            // Visual update for completed tasks
            if (isCompleted) {
                li.querySelector('.task-title').style.textDecoration = 'line-through';
                li.querySelector('.task-title').style.opacity = '0.7';
                
                // Remove from list after a short delay
                setTimeout(() => {
                    li.style.opacity = '0';
                    setTimeout(() => {
                        li.remove();
                        
                        // Show empty message if no tasks left
                        if (taskList.children.length === 0) {
                            taskList.innerHTML = '<li class="empty-message">No tasks scheduled for this week</li>';
                        }
                    }, 300);
                }, 500);
            }
        });
        
        li.querySelector('.edit-task').addEventListener('click', e => {
            e.stopPropagation(); // Prevent triggering the parent click event
            editTask(task.id);
        });
        
        li.querySelector('.delete-task').addEventListener('click', e => {
            e.stopPropagation(); // Prevent triggering the parent click event
            deleteTask(task.id);
        });
    });
    
    // Update week range display
    const weekRangeEl = document.getElementById('weekRange');
    if (weekRangeEl) {
        weekRangeEl.textContent = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
    }
}

/**
 * Update project dropdowns in forms
 */
function updateProjectDropdowns() {
    const rfiProjectDropdown = document.getElementById('rfiProject');
    const taskProjectDropdown = document.getElementById('taskProject');
    
    // Function to populate a dropdown
    const populateDropdown = (dropdown, selectedId) => {
        if (!dropdown) return;
        
        // Clear existing options except the first one (placeholder)
        while (dropdown.options.length > 1) {
            dropdown.options.remove(1);
        }
        
        // Sort projects by name
        const sortedProjects = [...dashboardData.projects].sort((a, b) => a.name.localeCompare(b.name));
        
        // Add options
        sortedProjects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            if (selectedId && project.id === selectedId) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        });
    };
    
    // Populate both dropdowns
    populateDropdown(rfiProjectDropdown);
    populateDropdown(taskProjectDropdown);
}

/**
 * Update dashboard charts
 */
function updateCharts() {
    // Project costs chart
    const projectsChart = document.getElementById('projectsChart');
    if (projectsChart && window.Chart) {
        // Create sample data for charts
        const chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Budget',
                    data: [250000, 350000, 450000, 550000, 650000, 750000],
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderColor: 'rgba(52, 152, 219, 0.7)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Actual Cost',
                    data: [230000, 370000, 460000, 520000, 600000, 720000],
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderColor: 'rgba(231, 76, 60, 0.7)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Projected',
                    data: [250000, 350000, 450000, 550000, 700000, 800000],
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderColor: 'rgba(46, 204, 113, 0.7)',
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: true
                }
            ]
        };
        
        // Create chart if it doesn't exist
        if (!window.projectCostChart) {
            window.projectCostChart = new Chart(projectsChart, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += formatCurrency(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    },
                    scales: {
                        y: {
                            ticks: {
                                callback: function(value) {
                                    return formatCurrency(value);
                                }
                            }
                        }
                    }
                }
            });
        } else {
            // Update existing chart
            window.projectCostChart.data = chartData;
            window.projectCostChart.update();
        }
    }
}

/**
 * Update chart based on selected period
 * @param {string} period - Week, Month, or Quarter
 */
function updateChartPeriod(period) {
    if (!window.projectCostChart) return;
    
    // In a real application, this would fetch different data based on the period
    // For demo purposes, we'll just modify the existing data
    
    let chartData;
    
    switch (period) {
        case 'week':
            chartData = {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Budget',
                        data: [50000, 55000, 60000, 58000, 65000, 40000, 35000],
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderColor: 'rgba(52, 152, 219, 0.7)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Actual Cost',
                        data: [48000, 57000, 61000, 59000, 64000, 38000, 33000],
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderColor: 'rgba(231, 76, 60, 0.7)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Projected',
                        data: [50000, 55000, 60000, 58000, 65000, 45000, 40000],
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderColor: 'rgba(46, 204, 113, 0.7)',
                        borderDash: [5, 5],
                        tension: 0.4,
                        fill: true
                    }
                ]
            };
            break;
        case 'month':
            chartData = {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                    {
                        label: 'Budget',
                        data: [220000, 240000, 270000, 290000],
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderColor: 'rgba(52, 152, 219, 0.7)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Actual Cost',
                        data: [210000, 250000, 265000, 280000],
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderColor: 'rgba(231, 76, 60, 0.7)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Projected',
                        data: [220000, 240000, 270000, 300000],
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderColor: 'rgba(46, 204, 113, 0.7)',
                        borderDash: [5, 5],
                        tension: 0.4,
                        fill: true
                    }
                ]
            };
            break;
        case 'quarter':
            chartData = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Budget',
                        data: [250000, 350000, 450000, 550000, 650000, 750000],
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderColor: 'rgba(52, 152, 219, 0.7)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Actual Cost',
                        data: [230000, 370000, 460000, 520000, 600000, 720000],
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderColor: 'rgba(231, 76, 60, 0.7)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Projected',
                        data: [250000, 350000, 450000, 550000, 700000, 800000],
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderColor: 'rgba(46, 204, 113, 0.7)',
                        borderDash: [5, 5],
                        tension: 0.4,
                        fill: true
                    }
                ]
            };
            break;
    }
    
    window.projectCostChart.data = chartData;
    window.projectCostChart.update();
    
    showToast('Chart Updated', `Showing ${period} data`, 'info');
}

// Form handling functions

/**
 * Reset project form for adding a new project
 */
function resetProjectForm() {
    const form = document.getElementById('addProjectForm');
    if (!form) return;
    
    form.reset();
    
    // Reset any hidden fields
    const projectIdField = document.getElementById('projectId');
    if (projectIdField) projectIdField.value = '';
    
    // Set default values
    const startDateField = document.getElementById('projectStartDate');
    const dueDateField = document.getElementById('projectDueDate');
    const statusField = document.getElementById('projectStatus');
    
    if (startDateField) startDateField.value = formatDateForInput(new Date());
    if (dueDateField) dueDateField.value = formatDateForInput(new Date(new Date().setMonth(new Date().getMonth() + 3)));
    if (statusField) statusField.value = 'active';
    
    // Update modal title
    const modalTitle = document.getElementById('projectModalTitle');
    if (modalTitle) modalTitle.textContent = 'Add New Project';
}

/**
 * Reset RFI form for adding a new RFI
 */
function resetRFIForm() {
    const form = document.getElementById('quickRFIForm');
    if (!form) return;
    
    form.reset();
    
    // Reset any hidden fields
    const rfiIdField = document.getElementById('rfiId');
    if (rfiIdField) rfiIdField.value = '';
    
    // Set default values
    const dueDateField = document.getElementById('rfiDueDate');
    const priorityField = document.getElementById('rfiPriority');
    
    if (dueDateField) dueDateField.value = formatDateForInput(new Date(new Date().setDate(new Date().getDate() + 7)));
    if (priorityField) priorityField.value = 'medium';
    
    // Update modal title
    const modalHeader = document.querySelector('#quickRFIModal .modal-header h2');
    if (modalHeader) modalHeader.textContent = 'Create RFI';
}

/**
 * Reset task form for adding a new task
 */
function resetTaskForm() {
    const form = document.getElementById('addTaskForm');
    if (!form) return;
    
    form.reset();
    
    // Reset any hidden fields
    const taskIdField = document.getElementById('taskId');
    if (taskIdField) taskIdField.value = '';
    
    // Set default values
    const dueDateField = document.getElementById('taskDueDate');
    const priorityField = document.getElementById('taskPriority');
    
    if (dueDateField) dueDateField.value = formatDateForInput(new Date(new Date().setDate(new Date().getDate() + 3)));
    if (priorityField) priorityField.value = 'medium';
    
    // Update modal title
    const modalHeader = document.querySelector('#addTaskModal .modal-header h2');
    if (modalHeader) modalHeader.textContent = 'Add Task';
}

/**
 * Handle project form submission
 */
function handleProjectFormSubmit() {
    const projectId = document.getElementById('projectId')?.value;
    const projectName = document.getElementById('projectName')?.value;
    const projectValue = parseFloat(document.getElementById('projectValue')?.value) || 0;
    const projectStatus = document.getElementById('projectStatus')?.value;
    const projectStartDate = document.getElementById('projectStartDate')?.value;
    const projectDueDate = document.getElementById('projectDueDate')?.value;
    const projectDescription = document.getElementById('projectDescription')?.value;
    const projectLocation = document.getElementById('projectLocation')?.value;
    
    if (!projectName) {
        showToast('Validation Error', 'Project name is required', 'error');
        return;
    }
    
    const projectData = {
        name: projectName,
        value: projectValue,
        status: projectStatus || 'active',
        start_date: projectStartDate,
        due_date: projectDueDate,
        description: projectDescription || '',
        location: projectLocation || '',
        progress: projectStatus === 'completed' ? 100 : (projectStatus === 'bidding' ? 10 : 35)
    };
    
    if (projectId) {
        // Update existing project
        const index = dashboardData.projects.findIndex(p => p.id === parseInt(projectId));
        if (index !== -1) {
            dashboardData.projects[index] = {
                ...dashboardData.projects[index],
                ...projectData
            };
            
            showToast('Project Updated', 'Project has been updated successfully', 'success');
        }
    } else {
        // Add new project
        const newId = dashboardData.projects.length > 0 ? 
            Math.max(...dashboardData.projects.map(p => p.id)) + 1 : 1;
        
        dashboardData.projects.push({
            id: newId,
            ...projectData
        });
        
        showToast('Project Added', 'New project has been added successfully', 'success');
    }
    
    // Update dashboard
    updateDashboardData();
    renderDashboard();
    
    // Hide modal
    hideModal('addProjectModal');
}

/**
 * Handle RFI form submission
 */
function handleRFIFormSubmit() {
    const rfiId = document.getElementById('rfiId')?.value;
    const rfiSubject = document.getElementById('rfiSubject')?.value;
    const rfiProject = document.getElementById('rfiProject')?.value;
    const rfiDescription = document.getElementById('rfiDescription')?.value;
    const rfiDueDate = document.getElementById('rfiDueDate')?.value;
    const rfiPriority = document.getElementById('rfiPriority')?.value;
    
    if (!rfiSubject) {
        showToast('Validation Error', 'RFI subject is required', 'error');
        return;
    }
    
    if (!rfiProject) {
        showToast('Validation Error', 'Please select a project', 'error');
        return;
    }
    
    const rfiData = {
        title: rfiSubject,
        project_id: parseInt(rfiProject),
        description: rfiDescription || '',
        due_date: rfiDueDate,
        priority: rfiPriority || 'medium',
        status: 'pending'
    };
    
    if (rfiId) {
        // Update existing RFI
        const index = dashboardData.rfis.findIndex(r => r.id === parseInt(rfiId));
        if (index !== -1) {
            dashboardData.rfis[index] = {
                ...dashboardData.rfis[index],
                ...rfiData
            };
            
            showToast('RFI Updated', 'RFI has been updated successfully', 'success');
        }
    } else {
        // Add new RFI
        const newId = dashboardData.rfis.length > 0 ? 
            Math.max(...dashboardData.rfis.map(r => r.id)) + 1 : 1;
        
        dashboardData.rfis.push({
            id: newId,
            ...rfiData
        });
        
        showToast('RFI Added', 'New RFI has been added successfully', 'success');
    }
    
    // Update dashboard
    updateDashboardData();
    renderDashboard();
    
    // Hide modal
    hideModal('quickRFIModal');
}

/**
 * Handle task form submission
 */
function handleTaskFormSubmit() {
    const taskId = document.getElementById('taskId')?.value;
    const taskTitle = document.getElementById('taskTitle')?.value;
    const taskProject = document.getElementById('taskProject')?.value;
    const taskDescription = document.getElementById('taskDescription')?.value;
    const taskDueDate = document.getElementById('taskDueDate')?.value;
    const taskPriority = document.getElementById('taskPriority')?.value;
    
    if (!taskTitle) {
        showToast('Validation Error', 'Task title is required', 'error');
        return;
    }
    
    if (!taskProject) {
        showToast('Validation Error', 'Please select a project', 'error');
        return;
    }
    
    const taskData = {
        title: taskTitle,
        project_id: parseInt(taskProject),
        description: taskDescription || '',
        due_date: taskDueDate,
        priority: taskPriority || 'medium',
        completed: false
    };
    
    if (taskId) {
        // Update existing task
        const index = dashboardData.tasks.findIndex(t => t.id === parseInt(taskId));
        if (index !== -1) {
            dashboardData.tasks[index] = {
                ...dashboardData.tasks[index],
                ...taskData
            };
            
            showToast('Task Updated', 'Task has been updated successfully', 'success');
        }
    } else {
        // Add new task
        const newId = dashboardData.tasks.length > 0 ? 
            Math.max(...dashboardData.tasks.map(t => t.id)) + 1 : 1;
        
        dashboardData.tasks.push({
            id: newId,
            ...taskData
        });
        
        showToast('Task Added', 'New task has been added successfully', 'success');
    }
    
    // Update dashboard
    updateDashboardData();
    renderDashboard();
    
    // Hide modal
    hideModal('addTaskModal');
}

// CRUD Operations

/**
 * Edit a project
 * @param {number} projectId - ID of the project to edit
 */
function editProject(projectId) {
    const project = dashboardData.projects.find(p => p.id === projectId);
    if (!project) {
        showToast('Error', 'Project not found', 'error');
        return;
    }
    
    // Fill in the form
    document.getElementById('projectId').value = project.id;
    document.getElementById('projectName').value = project.name;
    document.getElementById('projectValue').value = project.value;
    document.getElementById('projectStatus').value = project.status;
    document.getElementById('projectStartDate').value = formatDateForInput(new Date(project.start_date));
    document.getElementById('projectDueDate').value = formatDateForInput(new Date(project.due_date));
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('projectLocation').value = project.location;
}
// More functions would follow to complete the dashboard.js file