// IBMTok - TikTok-inspired CI/CD Platform
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateMetrics();
});

// Initialize application
function initializeApp() {
    updateLastCommit();
    loadDeployCount();
    updateTimeAgo();
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
    const tabButtons = document.querySelectorAll('.tab-btn-tiktok');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Copy buttons
    const copyButtons = document.querySelectorAll('.copy-btn-tiktok');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            copyCommand(this);
        });
    });
    
    // Sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Action buttons (like, comment, share)
    const actionButtons = document.querySelectorAll('.action-btn');
    // Video container interactions
    const videoContainers = document.querySelectorAll('.video-container');
    videoContainers.forEach(container => {
        container.addEventListener('click', function() {
            const playOverlay = this.querySelector('.play-overlay');
            if (playOverlay) {
                playOverlay.style.opacity = '0';
                setTimeout(() => {
                    playOverlay.style.opacity = '0.9';
                }, 300);
            }
            showToast('Video playing! 🎬', 'success');
        });
    });
    
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-heart')) {
                icon.style.color = icon.style.color === 'rgb(254, 44, 85)' ? '' : '#fe2c55';
                showToast('Liked! ❤️', 'success');
            }
        });
    });
}

// Update last commit time
function updateLastCommit() {
    const lastCommitElement = document.getElementById('lastCommit');
    if (lastCommitElement) {
        lastCommitElement.textContent = 'Just now';
    }
}

// Update time ago
function updateTimeAgo() {
    const timeAgoElement = document.getElementById('timeAgo');
    if (timeAgoElement) {
        timeAgoElement.textContent = '2h ago';
    }
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
    const stages = document.querySelectorAll('.flow-stage');
    
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
            name: 'Security Scan',
            logs: [
                '🔒 Running security scan...',
                '✓ Checking for vulnerabilities...',
                '✓ Scanning dependencies...',
                '✓ No security issues found',
                '✓ Compliance checks passed'
            ],
            duration: 1800
        },
        {
            stage: 5,
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
        stage.querySelector('.stage-badge').textContent = 'Running...';
        
        // Add logs
        for (const log of stageData.logs) {
            await addLog(pipelineLog, log, 200);
        }
        
        // Wait for stage duration
        await sleep(stageData.duration);
        
        // Mark stage as completed
        stage.classList.remove('active');
        stage.classList.add('completed');
        stage.querySelector('.stage-badge').textContent = 'Done ✓';
        
        await addLog(pipelineLog, `\n✅ ${stageData.name} completed\n`, 100);
    }
    
    // Final success message
    await addLog(pipelineLog, '\n🎉 Pipeline completed successfully!', 100);
    await addLog(pipelineLog, '⏱️  Total time: 8.3 seconds', 100);
    
    // Increment deploy count
    incrementDeployCount();
    
    // Show success toast
    showToast('🚀 Pipeline deployed successfully!', 'success');
    
    // Enable buttons
    runBtn.disabled = false;
    resetBtn.disabled = false;
}

// Reset pipeline
function resetPipeline() {
    const stages = document.querySelectorAll('.flow-stage');
    const pipelineLog = document.getElementById('pipelineLog');
    
    stages.forEach(stage => {
        stage.classList.remove('active', 'completed', 'failed');
        stage.querySelector('.stage-badge').textContent = 'Ready';
    });
    
    pipelineLog.classList.remove('active');
    pipelineLog.innerHTML = '';
    
    showToast('Pipeline reset ✨', 'success');
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
    const tabButtons = document.querySelectorAll('.tab-btn-tiktok');
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content-tiktok');
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
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('copied');
        
        // Show toast
        showToast('Copied to clipboard! 📋', 'success');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copied');
        }, 2000);
    } catch (err) {
        showToast('Failed to copy ❌', 'error');
    }
    
    // Remove textarea
    document.body.removeChild(textarea);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    // Set message and type
    toast.textContent = message;
    toast.className = 'toast-tiktok show';
    
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
        updateTimeAgo();
    }, 30000);
}

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.video-card');
    
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
    const stages = document.querySelectorAll('.flow-stage');
    
    stages.forEach((stage, index) => {
        stage.style.animationDelay = `${index * 0.1}s`;
    });
});

// Console easter egg
console.log('%c🚀 IBMTok - DevOps Platform', 'font-size: 24px; font-weight: bold; background: linear-gradient(45deg, #fe2c55, #25f4ee); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%c✨ TikTok-inspired CI/CD Pipeline', 'font-size: 16px; color: #25f4ee;');
console.log('%cKeyboard Shortcuts:', 'font-size: 14px; font-weight: bold; color: #fe2c55;');
console.log('Ctrl/Cmd + Enter: Run Pipeline');
console.log('Ctrl/Cmd + R: Reset Pipeline');
console.log('\n%cPowered by IBM Cloud 💙', 'font-size: 12px; color: #a0a0a0;');

// Made with Bob
