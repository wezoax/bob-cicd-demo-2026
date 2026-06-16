// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateMetrics();
});

// Initialize application
function initializeApp() {
    updateLastCommit();
    loadDeployCount();
}

// Setup all event listeners
function setupEventListeners() {
    // Pipeline controls
    const runPipelineBtn = document.getElementById('runPipelineBtn');
    const resetPipelineBtn = document.getElementById('resetPipelineBtn');
    
    if (runPipelineBtn) {
        runPipelineBtn.addEventListener('click', runPipeline);
    }
    
    if (resetPipelineBtn) {
        resetPipelineBtn.addEventListener('click', resetPipeline);
    }
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Copy buttons
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            copyCommand(this);
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Update last commit time
function updateLastCommit() {
    const lastCommitElement = document.getElementById('lastCommit');
    if (lastCommitElement) {
        const now = new Date();
        const timeAgo = getTimeAgo(now);
        lastCommitElement.textContent = timeAgo;
    }
}

// Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    return Math.floor(seconds / 86400) + ' days ago';
}

// Load deploy count from localStorage
function loadDeployCount() {
    const count = localStorage.getItem('deployCount') || 0;
    const deployCountElement = document.getElementById('deployCount');
    if (deployCountElement) {
        deployCountElement.textContent = count;
    }
}

// Increment deploy count
function incrementDeployCount() {
    let count = parseInt(localStorage.getItem('deployCount') || 0);
    count++;
    localStorage.setItem('deployCount', count);
    
    const deployCountElement = document.getElementById('deployCount');
    if (deployCountElement) {
        animateNumber(deployCountElement, count - 1, count, 500);
    }
}

// Animate number change
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Run pipeline simulation
async function runPipeline() {
    const runBtn = document.getElementById('runPipelineBtn');
    const resetBtn = document.getElementById('resetPipelineBtn');
    const pipelineLog = document.getElementById('pipelineLog');
    const stages = document.querySelectorAll('.pipeline-stage');
    
    // Disable buttons
    runBtn.disabled = true;
    resetBtn.disabled = true;
    
    // Show log
    pipelineLog.classList.add('active');
    pipelineLog.innerHTML = '';
    
    // Pipeline stages
    const pipelineStages = [
        {
            stage: 1,
            name: 'Code Commit',
            logs: [
                '🔄 Checking out repository...',
                '✓ Repository cloned successfully',
                '✓ Branch: main',
                '✓ Commit: abc123f'
            ],
            duration: 1000
        },
        {
            stage: 2,
            name: 'Run Tests',
            logs: [
                '🧪 Installing dependencies...',
                '✓ Dependencies installed',
                '🧪 Running test suite...',
                '✓ Unit tests: 45 passed',
                '✓ Integration tests: 12 passed',
                '✓ Code coverage: 95%'
            ],
            duration: 2000
        },
        {
            stage: 3,
            name: 'Build',
            logs: [
                '🔨 Starting build process...',
                '✓ Compiling source files...',
                '✓ Optimizing assets...',
                '✓ Build completed successfully',
                '✓ Build size: 2.3 MB'
            ],
            duration: 1500
        },
        {
            stage: 4,
            name: 'Deploy',
            logs: [
                '🚀 Preparing deployment...',
                '✓ Uploading to GitHub Pages...',
                '✓ Configuring DNS...',
                '✓ Deployment successful!',
                '🌐 Site is live at: https://your-site.github.io'
            ],
            duration: 2000
        }
    ];
    
    // Run each stage
    for (const stageData of pipelineStages) {
        const stage = stages[stageData.stage - 1];
        
        // Mark stage as active
        stage.classList.add('active');
        stage.querySelector('.stage-status').textContent = 'Running...';
        
        // Add logs
        for (const log of stageData.logs) {
            await addLog(pipelineLog, log, 200);
        }
        
        // Wait for stage duration
        await sleep(stageData.duration);
        
        // Mark stage as completed
        stage.classList.remove('active');
        stage.classList.add('completed');
        stage.querySelector('.stage-status').textContent = 'Completed';
        
        await addLog(pipelineLog, `\n✅ ${stageData.name} completed\n`, 100);
    }
    
    // Final success message
    await addLog(pipelineLog, '\n🎉 Pipeline completed successfully!', 100);
    await addLog(pipelineLog, '⏱️  Total time: 6.5 seconds', 100);
    
    // Increment deploy count
    incrementDeployCount();
    
    // Show success toast
    showToast('Pipeline completed successfully!', 'success');
    
    // Enable buttons
    runBtn.disabled = false;
    resetBtn.disabled = false;
}

// Reset pipeline
function resetPipeline() {
    const stages = document.querySelectorAll('.pipeline-stage');
    const pipelineLog = document.getElementById('pipelineLog');
    
    stages.forEach(stage => {
        stage.classList.remove('active', 'completed', 'failed');
        stage.querySelector('.stage-status').textContent = 'Ready';
    });
    
    pipelineLog.classList.remove('active');
    pipelineLog.innerHTML = '';
    
    showToast('Pipeline reset', 'success');
}

// Add log entry
function addLog(logElement, message, delay = 0) {
    return new Promise(resolve => {
        setTimeout(() => {
            const logLine = document.createElement('div');
            logLine.textContent = message;
            logElement.appendChild(logLine);
            logElement.scrollTop = logElement.scrollHeight;
            resolve();
        }, delay);
    });
}

// Sleep utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Switch tabs
function switchTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        if (content.id === tabName) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Copy command to clipboard
function copyCommand(button) {
    const command = button.dataset.command;
    
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = command;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    // Select and copy
    textarea.select();
    
    try {
        document.execCommand('copy');
        
        // Update button
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('copied');
        
        // Show toast
        showToast('Command copied to clipboard!', 'success');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copied');
        }, 2000);
    } catch (err) {
        showToast('Failed to copy command', 'error');
    }
    
    // Remove textarea
    document.body.removeChild(textarea);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    // Set message and type
    toast.textContent = message;
    toast.className = 'toast show';
    
    if (type === 'success') {
        toast.classList.add('success');
    }
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Update metrics periodically
function updateMetrics() {
    // Update total commits
    const totalCommits = document.getElementById('totalCommits');
    if (totalCommits) {
        const baseCommits = 247;
        const randomIncrease = Math.floor(Math.random() * 5);
        totalCommits.textContent = baseCommits + randomIncrease;
    }
    
    // Update every 30 seconds
    setInterval(() => {
        updateLastCommit();
    }, 30000);
}

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.status-card, .metric-card, .link-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to run pipeline
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const runBtn = document.getElementById('runPipelineBtn');
        if (runBtn && !runBtn.disabled) {
            runPipeline();
        }
    }
    
    // Ctrl/Cmd + R to reset pipeline
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        resetPipeline();
    }
});

// Add visual feedback for pipeline stages
document.addEventListener('DOMContentLoaded', function() {
    const stages = document.querySelectorAll('.pipeline-stage');
    
    stages.forEach((stage, index) => {
        stage.style.animationDelay = `${index * 0.1}s`;
    });
});

// Console easter egg
console.log('%c🚀 CI/CD Pipeline Demo', 'font-size: 20px; font-weight: bold; color: #0f62fe;');
console.log('%cKeyboard Shortcuts:', 'font-size: 14px; font-weight: bold; color: #24a148;');
console.log('Ctrl/Cmd + Enter: Run Pipeline');
console.log('Ctrl/Cmd + R: Reset Pipeline');
console.log('\n%cBuilt with IBM Design System', 'font-size: 12px; color: #8d8d8d;');

// Made with Bob
