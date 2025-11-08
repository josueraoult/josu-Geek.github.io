// Main application
class WinXApp {
    constructor() {
        this.authManager = new AuthManager();
        this.adminManager = new AdminManager();
        this.state = {
            darkMode: true,
            currentPage: 'home',
            filter: 'all',
            teamLogos: {},
            userProfileImage: null,
            watchedAds: 0,
            lastAdWatch: null
        };
        
        this.elements = {};
        this.init();
    }

    init() {
        this.loadState();
        this.cacheElements();
        this.setupEventListeners();
        this.render();
    }

    loadState() {
        // Load dark mode preference
        const darkMode = localStorage.getItem('winx_darkMode');
        if (darkMode !== null) {
            this.state.darkMode = JSON.parse(darkMode);
        }

        // Load team logos
        const savedTeamLogos = localStorage.getItem('winx_team_logos');
        if (savedTeamLogos) {
            this.state.teamLogos = JSON.parse(savedTeamLogos);
        }

        // Load user profile image
        const savedProfileImage = localStorage.getItem('winx_profile_image');
        if (savedProfileImage) {
            this.state.userProfileImage = savedProfileImage;
        }

        // Load ad data
        const adData = localStorage.getItem('winx_ad_data');
        if (adData) {
            const { watchedAds, lastAdWatch } = JSON.parse(adData);
            this.state.watchedAds = watchedAds || 0;
            this.state.lastAdWatch = lastAdWatch ? new Date(lastAdWatch) : null;
        }
    }

    saveState() {
        localStorage.setItem('winx_darkMode', JSON.stringify(this.state.darkMode));
        localStorage.setItem('winx_team_logos', JSON.stringify(this.state.teamLogos));
        if (this.state.userProfileImage) {
            localStorage.setItem('winx_profile_image', this.state.userProfileImage);
        }
        localStorage.setItem('winx_ad_data', JSON.stringify({
            watchedAds: this.state.watchedAds,
            lastAdWatch: this.state.lastAdWatch
        }));
    }

    cacheElements() {
        // Cache all DOM elements
        this.elements = {
            body: document.body,
            themeToggle: document.querySelector('.theme-toggle'),
            navItems: document.querySelectorAll('.nav-item'),
            mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
            mobileMenu: document.querySelector('.mobile-menu'),
            closeMobileMenu: document.querySelector('.close-mobile-menu'),
            mobileNavItems: document.querySelectorAll('.mobile-nav-item'),
            mainContent: document.getElementById('main-content'),
            userBtn: document.querySelector('.user-btn'),
            userMenu: document.querySelector('.user-menu'),
            loginBtn: document.querySelector('.login-btn'),
            logoutBtn: document.querySelector('.logout-btn'),
            adminBtn: document.querySelector('.admin-btn'),
            filterBtns: document.querySelectorAll('.filter-btn'),
            authModal: document.getElementById('auth-modal'),
            closeAuthModal: document.getElementById('close-auth-modal'),
            authTabs: document.querySelectorAll('.auth-tab'),
            authForms: document.querySelectorAll('.auth-form'),
            authSwitchBtn: document.getElementById('auth-switch-btn'),
            authSwitchText: document.getElementById('auth-switch-text'),
            authModalTitle: document.getElementById('auth-modal-title'),
            adminPanel: document.getElementById('admin-panel'),
            closeAdminPanel: document.getElementById('close-admin-panel'),
            adminPredictionForm: document.getElementById('admin-prediction-form'),
            adminSubmitText: document.getElementById('admin-submit-text'),
            adminFormTitle: document.getElementById('admin-form-title'),
            cancelEdit: document.getElementById('cancel-edit'),
            confidenceSlider: document.getElementById('confidence'),
            confidenceValue: document.getElementById('confidence-value'),
            predictionsCount: document.getElementById('predictions-count'),
            adminPredictionsList: document.getElementById('admin-predictions-list'),
            profileImageContainer: document.getElementById('profile-image-container'),
            profileImagePlaceholder: document.getElementById('profile-image-placeholder'),
            profileImage: document.getElementById('profile-image'),
            profileImageInput: document.getElementById('profile-image-input'),
            watchAdBtn: document.getElementById('watch-ad-btn'),
            generateAnalysisBtn: document.getElementById('generate-analysis-btn'),
            teamALogoInput: document.getElementById('team-a-logo'),
            teamBLogoInput: document.getElementById('team-b-logo'),
            teamAPreview: document.getElementById('team-a-preview'),
            teamBPreview: document.getElementById('team-b-preview'),
            leagueOptions: document.querySelectorAll('.league-option'),
            predictionTypeOptions: document.querySelectorAll('.prediction-type-option'),
            betTypeOptions: document.querySelectorAll('[data-bet-type]'),
            gemCostInput: document.getElementById('gem-cost'),
            leagueHiddenInput: document.getElementById('league'),
            typeHiddenInput: document.getElementById('type'),
            betTypeHiddenInput: document.getElementById('bet-type')
        };
    }

    setupEventListeners() {
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Navigation
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.changePage(item.getAttribute('data-page'));
            });
        });

        // Mobile menu
        this.elements.mobileMenuBtn.addEventListener('click', () => {
            this.elements.mobileMenu.style.display = 'flex';
        });

        this.elements.closeMobileMenu.addEventListener('click', () => {
            this.elements.mobileMenu.style.display = 'none';
        });

        this.elements.mobileNavItems.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('admin-btn')) {
                    this.openAdminPanel();
                } else if (item.classList.contains('logout-btn')) {
                    this.handleLogout();
                } else {
                    this.changePage(item.getAttribute('data-page'));
                }
                this.elements.mobileMenu.style.display = 'none';
            });
        });

        // User menu
        this.elements.userBtn.addEventListener('click', () => {
            this.elements.userMenu.style.display = 
                this.elements.userMenu.style.display === 'none' ? 'block' : 'none';
        });

        document.querySelectorAll('.user-action').forEach(action => {
            action.addEventListener('click', () => {
                if (action.classList.contains('logout-btn')) {
                    this.handleLogout();
                } else if (action.classList.contains('admin-btn')) {
                    this.openAdminPanel();
                } else {
                    this.changePage(action.getAttribute('data-page'));
                }
                this.elements.userMenu.style.display = 'none';
            });
        });

        // Authentication
        this.elements.loginBtn.addEventListener('click', () => {
            this.openAuthModal('login');
        });

        this.elements.closeAuthModal.addEventListener('click', () => {
            this.elements.authModal.style.display = 'none';
        });

        this.elements.authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchAuthTab(tab.getAttribute('data-tab'));
            });
        });

        this.elements.authSwitchBtn.addEventListener('click', () => {
            const currentTab = document.querySelector('.auth-tab.active').getAttribute('data-tab');
            const newTab = currentTab === 'login' ? 'register' : 'login';
            this.switchAuthTab(newTab);
        });

        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));

        // Filters
        this.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.elements.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.filter = btn.getAttribute('data-filter');
                this.renderPredictions();
            });
        });

        // Admin panel
        this.elements.closeAdminPanel.addEventListener('click', () => {
            this.elements.adminPanel.style.display = 'none';
            this.resetAdminForm();
        });

        this.elements.adminPredictionForm.addEventListener('submit', (e) => this.handleSavePrediction(e));
        this.elements.confidenceSlider.addEventListener('input', () => {
            this.elements.confidenceValue.textContent = this.elements.confidenceSlider.value;
        });

        this.elements.cancelEdit.addEventListener('click', () => this.resetAdminForm());

        // New feature event listeners
        this.setupNewFeatureListeners();

        // Global event listeners
        window.addEventListener('click', (e) => {
            if (e.target === this.elements.authModal) {
                this.elements.authModal.style.display = 'none';
            }
            if (e.target === this.elements.adminPanel) {
                this.elements.adminPanel.style.display = 'none';
                this.resetAdminForm();
            }
        });
    }

    setupNewFeatureListeners() {
        // Profile image upload
        this.elements.profileImageContainer.addEventListener('click', () => {
            this.elements.profileImageInput.click();
        });

        this.elements.profileImageInput.addEventListener('change', (e) => this.handleProfileImageUpload(e));

        // Watch ad
        this.elements.watchAdBtn.addEventListener('click', () => this.handleWatchAd());

        // Generate AI analysis
        this.elements.generateAnalysisBtn.addEventListener('click', () => this.generateAIAnalysis());

        // Team logo uploads
        this.elements.teamALogoInput.addEventListener('change', (e) => this.handleTeamLogoUpload(e, 'teamA'));
        this.elements.teamBLogoInput.addEventListener('change', (e) => this.handleTeamLogoUpload(e, 'teamB'));

        // League selection
        this.elements.leagueOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.elements.leagueOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.elements.leagueHiddenInput.value = option.getAttribute('data-league');
            });
        });

        // Prediction type selection
        this.elements.predictionTypeOptions.forEach(option => {
            if (option.getAttribute('data-type')) {
                option.addEventListener('click', () => {
                    document.querySelectorAll('[data-type]').forEach(o => o.classList.remove('active'));
                    option.classList.add('active');
                    this.elements.typeHiddenInput.value = option.getAttribute('data-type');
                });
            }
        });

        // Bet type selection
        this.elements.betTypeOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.elements.betTypeOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.elements.betTypeHiddenInput.value = option.getAttribute('data-bet-type');
                this.updatePredictionOptions(option.getAttribute('data-bet-type'));
            });
        });
    }

    render() {
        this.applyTheme();
        this.updateUserUI();
        this.loadPage(this.state.currentPage);
        this.renderPredictions();
        this.renderAdminPredictions();
    }

    applyTheme() {
        if (this.state.darkMode) {
            this.elements.body.classList.remove('light-mode');
            this.elements.body.classList.add('dark-mode');
            this.updateThemeClasses('dark');
        } else {
            this.elements.body.classList.remove('dark-mode');
            this.elements.body.classList.add('light-mode');
            this.updateThemeClasses('light');
        }
    }

    updateThemeClasses(theme) {
        // Update all theme-specific classes
        const elementsToUpdate = [
            'header', 'nav-item', 'theme-toggle', 'user-btn', 'user-menu',
            'user-action', 'mobile-menu-header', 'mobile-nav-item',
            'hero', 'stat-card', 'filter-btn', 'prediction-card',
            'vip-card', 'account-card', 'stat-item', 'stats-card',
            'league-stats', 'modal', 'auth-tab', 'admin-panel',
            'secondary-btn', 'prediction-item', 'ai-analysis',
            'ad-container', 'prediction-type-option', 'league-option',
            'admin-image-preview'
        ];

        elementsToUpdate.forEach(selector => {
            document.querySelectorAll(`.${theme}-${selector}`).forEach(el => {
                el.classList.remove(`${theme === 'dark' ? 'light' : 'dark'}-${selector}`);
                el.classList.add(`${theme}-${selector}`);
            });
        });
    }

    toggleTheme() {
        this.state.darkMode = !this.state.darkMode;
        this.saveState();
        this.render();
        
        // Update theme toggle icon
        const icon = this.elements.themeToggle.querySelector('i');
        if (this.state.darkMode) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    changePage(page) {
        this.state.currentPage = page;
        
        // Update active nav items
        this.elements.navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-page') === page);
        });
        
        this.elements.mobileNavItems.forEach(item => {
            if (item.getAttribute('data-page')) {
                item.classList.toggle('active', item.getAttribute('data-page') === page);
            }
        });

        this.loadPage(page);
    }

    async loadPage(page) {
        try {
            const response = await fetch(`pages/${page}.html`);
            const content = await response.text();
            this.elements.mainContent.innerHTML = content;
            
            // Re-cache page-specific elements
            this.cachePageElements();
            
            // Initialize page-specific functionality
            this.initializePage(page);
        } catch (error) {
            console.error('Error loading page:', error);
            this.elements.mainContent.innerHTML = '<p>Erreur lors du chargement de la page</p>';
        }
    }

    cachePageElements() {
        // Cache elements specific to the current page
        this.elements.homePredictions = document.getElementById('home-predictions');
        this.elements.predictionsList = document.getElementById('predictions-list');
        this.elements.vipPredictions = document.getElementById('vip-predictions');
    }

    initializePage(page) {
        switch (page) {
            case 'home':
                this.renderHomePage();
                break;
            case 'predictions':
                this.renderPredictionsPage();
                break;
            case 'vip':
                this.renderVipPage();
                break;
            case 'account':
                this.renderAccountPage();
                break;
            case 'stats':
                this.renderStatsPage();
                break;
        }
    }

    renderHomePage() {
        this.renderPredictions();
    }

    renderPredictionsPage() {
        this.renderPredictions();
    }

    renderVipPage() {
        this.renderPredictions();
    }

    renderAccountPage() {
        // Initialize account page specific functionality
        if (this.state.userProfileImage) {
            this.elements.profileImage.src = this.state.userProfileImage;
            this.elements.profileImage.style.display = 'block';
            this.elements.profileImagePlaceholder.style.display = 'none';
        }
    }

    renderStatsPage() {
        // Initialize stats page
    }

    renderPredictions() {
        let filteredPredictions = this.adminManager.getAllPredictions();
        
        if (this.state.filter !== 'all') {
            filteredPredictions = this.adminManager.filterPredictions(this.state.filter);
        }

        let container;
        switch (this.state.currentPage) {
            case 'home':
                container = this.elements.homePredictions;
                filteredPredictions = filteredPredictions.slice(0, 6);
                break;
            case 'predictions':
                container = this.elements.predictionsList;
                break;
            case 'vip':
                container = this.elements.vipPredictions;
                filteredPredictions = this.adminManager.filterPredictions('vip');
                break;
            default:
                return;
        }

        if (container) {
            this.renderPredictionCards(container, filteredPredictions);
        }
    }

    renderPredictionCards(container, predictions) {
        if (!container) return;

        container.innerHTML = '';
        
        if (predictions.length === 0) {
            container.innerHTML = '<p class="no-predictions">Aucune prédiction disponible</p>';
            return;
        }
        
        predictions.forEach(prediction => {
            const card = this.createPredictionCard(prediction);
            container.appendChild(card);
        });
    }

    createPredictionCard(prediction) {
        const card = document.createElement('div');
        card.className = `prediction-card ${this.state.darkMode ? 'dark-prediction-card' : 'light-prediction-card'} fade-in`;
        
        const typeClass = `type-${prediction.type}`;
        const isLocked = !prediction.unlocked && this.authManager.isLoggedIn();
        
        if (isLocked) {
            card.classList.add('locked-prediction');
        }
        
        const teamALogo = prediction.teamALogo || this.state.teamLogos[prediction.teamA];
        const teamBLogo = prediction.teamBLogo || this.state.teamLogos[prediction.teamB];
        
        card.innerHTML = `
            <div class="prediction-header">
                <span class="prediction-type ${typeClass}">${prediction.type.toUpperCase()}</span>
                <span class="prediction-league">${prediction.league}</span>
            </div>
            
            <div class="teams">
                <div class="team">
                    ${teamALogo ? 
                        `<img src="${teamALogo}" class="team-logo-image" alt="${prediction.teamA}">` : 
                        `<div class="team-logo-placeholder">${prediction.teamA.substring(0, 2)}</div>`
                    }
                    <div class="team-name">${prediction.teamA}</div>
                </div>
                <div class="vs">VS</div>
                <div class="team">
                    ${teamBLogo ? 
                        `<img src="${teamBLogo}" class="team-logo-image" alt="${prediction.teamB}">` : 
                        `<div class="team-logo-placeholder">${prediction.teamB.substring(0, 2)}</div>`
                    }
                    <div class="team-name">${prediction.teamB}</div>
                </div>
            </div>
            
            <div class="prediction-meta">
                <i class="fas fa-clock"></i>
                <span>${prediction.date} • ${prediction.time}</span>
            </div>
            
            <div class="confidence-bar">
                <div class="confidence-header">
                    <span>Confiance IA</span>
                    <span class="confidence-value">${prediction.confidence}%</span>
                </div>
                <div class="confidence-track ${this.state.darkMode ? 'dark-confidence-track' : 'light-confidence-track'}">
                    <div class="confidence-fill" style="width: ${prediction.confidence}%"></div>
                </div>
            </div>
            
            <div class="prediction-footer">
                <span class="prediction-result">Prédiction: ${prediction.prediction}</span>
                <span class="prediction-odds">@ ${prediction.odds}</span>
            </div>
            
            <div class="prediction-analysis ${this.state.darkMode ? 'dark-prediction-analysis' : 'light-prediction-analysis'}">
                <i class="fas fa-chart-line analysis-icon"></i>
                <span>${prediction.analysis}</span>
            </div>
            
            ${isLocked ? `
                <div class="locked-overlay">
                    <i class="fas fa-lock" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <p>Prédiction verrouillée</p>
                    <div class="unlock-with-gems">
                        <button class="unlock-btn" data-id="${prediction.id}">
                            <i class="fas fa-gem"></i>
                            Déverrouiller (${prediction.gemCost} gemme(s))
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
        
        // Add unlock button event listener
        const unlockBtn = card.querySelector('.unlock-btn');
        if (unlockBtn) {
            unlockBtn.addEventListener('click', () => {
                this.unlockPrediction(parseInt(unlockBtn.getAttribute('data-id')));
            });
        }
        
        return card;
    }

    unlockPrediction(predictionId) {
        const prediction = this.adminManager.getPrediction(predictionId);
        if (!prediction) return;
        
        if (this.authManager.deductGems(prediction.gemCost)) {
            this.adminManager.unlockPrediction(predictionId);
            this.renderPredictions();
            this.updateUserUI();
            alert(`Prédiction déverrouillée ! ${prediction.gemCost} gemme(s) déduite(s).`);
        } else {
            alert(`Gemmes insuffisantes. Il vous faut ${prediction.gemCost} gemme(s) pour déverrouiller cette prédiction.`);
        }
    }

    updateUserUI() {
        const user = this.authManager.currentUser;
        
        if (user) {
            this.elements.loginBtn.style.display = 'none';
            document.querySelector('.user-name').textContent = user.name;
            document.querySelector('.user-email').textContent = user.email;
            
            // Update gem counter
            const userStats = document.querySelector('.user-stats');
            userStats.innerHTML = `<i class="fas fa-gem gem-icon"></i><span>${user.gems} Gemmes</span>`;
            userStats.classList.add('gem-counter');
            
            // Show/hide admin button
            if (user.isAdmin) {
                document.querySelector('.admin-btn').style.display = 'flex';
            } else {
                document.querySelector('.admin-btn').style.display = 'none';
            }
        } else {
            this.elements.loginBtn.style.display = 'block';
            document.querySelector('.user-name').textContent = 'Nom Utilisateur';
            document.querySelector('.user-email').textContent = 'email@exemple.com';
            document.querySelector('.user-stats span').textContent = '5 Gemmes';
            document.querySelector('.admin-btn').style.display = 'none';
        }
    }

    // Authentication methods
    openAuthModal(tab = 'login') {
        this.elements.authModal.style.display = 'flex';
        this.switchAuthTab(tab);
    }

    switchAuthTab(tab) {
        this.elements.authTabs.forEach(t => t.classList.remove('active'));
        this.elements.authForms.forEach(f => f.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}-form`).classList.add('active');
        
        this.elements.authModalTitle.textContent = tab === 'login' ? 'Connexion' : 'Inscription';
        
        if (tab === 'login') {
            this.elements.authSwitchText.textContent = 'Pas de compte ? ';
            this.elements.authSwitchBtn.textContent = 'S\'inscrire';
        } else {
            this.elements.authSwitchText.textContent = 'Déjà un compte ? ';
            this.elements.authSwitchBtn.textContent = 'Se connecter';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        try {
            await this.authManager.login(email, password);
            this.elements.authModal.style.display = 'none';
            this.updateUserUI();
            this.renderPredictions();
            alert('Connexion réussie !');
        } catch (error) {
            alert('Erreur de connexion: ' + error.message);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        
        try {
            await this.authManager.register(name, email, password);
            this.elements.authModal.style.display = 'none';
            this.updateUserUI();
            this.renderPredictions();
            alert('Inscription réussie !');
        } catch (error) {
            alert('Erreur d\'inscription: ' + error.message);
        }
    }

    handleLogout() {
        this.authManager.logout();
        this.updateUserUI();
        this.renderPredictions();
        alert('Déconnexion réussie');
    }

    // Admin panel methods
    openAdminPanel() {
        if (this.authManager.isAdmin()) {
            this.elements.adminPanel.style.display = 'flex';
            this.renderAdminPredictions();
        } else {
            alert('Accès réservé aux administrateurs');
        }
    }

    renderAdminPredictions() {
        const predictions = this.adminManager.getAllPredictions();
        this.elements.predictionsCount.textContent = predictions.length;
        this.elements.adminPredictionsList.innerHTML = '';
        
        if (predictions.length === 0) {
            this.elements.adminPredictionsList.innerHTML = '<p class="no-predictions">Aucune prédiction</p>';
            return;
        }
        
        predictions.forEach(prediction => {
            const item = this.createAdminPredictionItem(prediction);
            this.elements.adminPredictionsList.appendChild(item);
        });
    }

    createAdminPredictionItem(prediction) {
        const item = document.createElement('div');
        item.className = `prediction-item ${this.state.darkMode ? 'dark-prediction-item' : 'light-prediction-item'}`;
        
        const typeClass = `type-${prediction.type}`;
        
        item.innerHTML = `
            <div class="prediction-item-header">
                <div class="prediction-item-teams">${prediction.teamA} vs ${prediction.teamB}</div>
                <span class="prediction-type ${typeClass}">${prediction.type.toUpperCase()}</span>
            </div>
            <div class="prediction-item-meta">${prediction.league} • ${prediction.date} ${prediction.time}</div>
            <div class="prediction-item-footer">
                <span>Confiance: ${prediction.confidence}%</span>
                <span class="prediction-odds">${prediction.prediction} @ ${prediction.odds}</span>
                <span class="gem-counter"><i class="fas fa-gem"></i> ${prediction.gemCost}</span>
            </div>
            <div class="prediction-item-actions">
                <button class="action-btn edit-btn" data-id="${prediction.id}">
                    <i class="fas fa-edit"></i>
                    Modifier
                </button>
                <button class="action-btn delete-btn" data-id="${prediction.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners
        const editBtn = item.querySelector('.edit-btn');
        const deleteBtn = item.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => {
            this.handleEditPrediction(parseInt(editBtn.getAttribute('data-id')));
        });
        
        deleteBtn.addEventListener('click', () => {
            this.handleDeletePrediction(parseInt(deleteBtn.getAttribute('data-id')));
        });
        
        return item;
    }

    handleEditPrediction(id) {
        const prediction = this.adminManager.getPrediction(id);
        if (prediction) {
            this.adminManager.editingPrediction = prediction;
            
            // Fill form with prediction data
            document.getElementById('team-a').value = prediction.teamA;
            document.getElementById('team-b').value = prediction.teamB;
            document.getElementById('league').value = prediction.league;
            document.getElementById('date').value = prediction.date;
            document.getElementById('time').value = prediction.time;
            document.getElementById('confidence').value = prediction.confidence;
            document.getElementById('confidence-value').textContent = prediction.confidence;
            document.getElementById('odds').value = prediction.odds;
            document.getElementById('type').value = prediction.type;
            document.getElementById('bet-type').value = prediction.betType;
            document.getElementById('prediction').value = prediction.prediction;
            document.getElementById('analysis').value = prediction.analysis;
            document.getElementById('gem-cost').value = prediction.gemCost;
            
            // Update visual selectors
            this.elements.leagueOptions.forEach(option => {
                option.classList.toggle('active', option.getAttribute('data-league') === prediction.league);
            });
            
            document.querySelectorAll('[data-type]').forEach(option => {
                option.classList.toggle('active', option.getAttribute('data-type') === prediction.type);
            });
            
            this.elements.betTypeOptions.forEach(option => {
                option.classList.toggle('active', option.getAttribute('data-bet-type') === prediction.betType);
            });
            
            // Update prediction options
            this.updatePredictionOptions(prediction.betType);
            
            // Show team logos if available
            if (prediction.teamALogo) {
                this.elements.teamAPreview.src = prediction.teamALogo;
                this.elements.teamAPreview.style.display = 'block';
            }
            
            if (prediction.teamBLogo) {
                this.elements.teamBPreview.src = prediction.teamBLogo;
                this.elements.teamBPreview.style.display = 'block';
            }
            
            // Update form title and button text
            this.elements.adminFormTitle.textContent = 'Modifier la prédiction';
            this.elements.adminSubmitText.textContent = 'Mettre à jour';
            this.elements.cancelEdit.style.display = 'block';
        }
    }

    handleDeletePrediction(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette prédiction ?')) {
            this.adminManager.deletePrediction(id);
            this.renderAdminPredictions();
            this.renderPredictions();
        }
    }

    handleSavePrediction(e) {
        e.preventDefault();
        
        const formData = {
            teamA: document.getElementById('team-a').value,
            teamB: document.getElementById('team-b').value,
            league: document.getElementById('league').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            confidence: parseInt(document.getElementById('confidence').value),
            odds: document.getElementById('odds').value,
            type: document.getElementById('type').value,
            betType: document.getElementById('bet-type').value,
            prediction: document.getElementById('prediction').value,
            analysis: document.getElementById('analysis').value,
            gemCost: parseInt(document.getElementById('gem-cost').value),
            teamALogo: this.state.teamLogos.teamA || null,
            teamBLogo: this.state.teamLogos.teamB || null
        };
        
        if (this.adminManager.editingPrediction) {
            this.adminManager.updatePrediction(this.adminManager.editingPrediction.id, formData);
        } else {
            this.adminManager.addPrediction(formData);
        }
        
        this.resetAdminForm();
        this.renderPredictions();
        this.renderAdminPredictions();
    }

    resetAdminForm() {
        this.adminManager.editingPrediction = null;
        this.elements.adminPredictionForm.reset();
        this.elements.confidenceSlider.value = 75;
        this.elements.confidenceValue.textContent = '75';
        this.elements.adminFormTitle.textContent = 'Nouvelle prédiction';
        this.elements.adminSubmitText.textContent = 'Ajouter';
        this.elements.cancelEdit.style.display = 'none';
        
        // Reset visual selectors
        this.elements.leagueOptions.forEach((option, index) => {
            option.classList.toggle('active', index === 0);
        });
        
        document.querySelectorAll('[data-type]').forEach((option, index) => {
            option.classList.toggle('active', index === 0);
        });
        
        this.elements.betTypeOptions.forEach((option, index) => {
            option.classList.toggle('active', index === 0);
        });
        
        // Reset image previews
        this.elements.teamAPreview.style.display = 'none';
        this.elements.teamBPreview.style.display = 'none';
        
        // Reset team logos in state
        this.state.teamLogos = {};
        this.saveState();
    }

    // New feature methods
    handleProfileImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.state.userProfileImage = event.target.result;
                this.elements.profileImage.src = event.target.result;
                this.elements.profileImage.style.display = 'block';
                this.elements.profileImagePlaceholder.style.display = 'none';
                this.saveState();
            };
            reader.readAsDataURL(file);
        }
    }

    handleWatchAd() {
        const now = new Date();
        if (this.state.lastAdWatch && (now - this.state.lastAdWatch) < 60000) {
            alert('Veuillez patienter avant de regarder une autre publicité.');
            return;
        }
        
        this.elements.watchAdBtn.disabled = true;
        this.elements.watchAdBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publicité en cours...';
        
        setTimeout(() => {
            if (this.authManager.currentUser) {
                this.authManager.addGems(0.5);
                this.state.watchedAds += 1;
                this.state.lastAdWatch = new Date();
                this.saveState();
                
                this.elements.watchAdBtn.disabled = false;
                this.elements.watchAdBtn.innerHTML = '<i class="fas fa-play-circle"></i> Regarder une publicité';
                
                this.updateUserUI();
                alert('Félicitations ! Vous avez gagné 0.5 gemme.');
            }
        }, 5000);
    }

    generateAIAnalysis() {
        const teamA = document.getElementById('team-a').value;
        const teamB = document.getElementById('team-b').value;
        const league = document.getElementById('league').value;
        const betType = document.getElementById('bet-type').value;
        
        if (!teamA || !teamB) {
            alert('Veuillez d\'abord saisir les noms des équipes.');
            return;
        }
        
        this.elements.generateAnalysisBtn.disabled = true;
        this.elements.generateAnalysisBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération en cours...';
        
        setTimeout(() => {
            const analysis = this.adminManager.generateAIAnalysis(teamA, teamB, league, betType);
            document.getElementById('analysis').value = analysis;
            
            this.elements.generateAnalysisBtn.disabled = false;
            this.elements.generateAnalysisBtn.innerHTML = '<i class="fas fa-robot"></i> Générer l\'analyse avec IA';
        }, 2000);
    }

    handleTeamLogoUpload(e, team) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.state.teamLogos[team] = event.target.result;
                const preview = team === 'teamA' ? this.elements.teamAPreview : this.elements.teamBPreview;
                preview.src = event.target.result;
                preview.style.display = 'block';
                this.saveState();
            };
            reader.readAsDataURL(file);
        }
    }

    updatePredictionOptions(betType) {
        const predictionSelect = document.getElementById('prediction');
        predictionSelect.innerHTML = '';
        
        let options = [];
        
        switch(betType) {
            case 'victory':
                options = [
                    { value: '1', text: '1' },
                    { value: 'X', text: 'X' },
                    { value: '2', text: '2' },
                    { value: '1X', text: '1X' },
                    { value: 'X2', text: 'X2' },
                    { value: '12', text: '12' }
                ];
                break;
            case 'btts':
                options = [
                    { value: 'BTTS Oui', text: 'BTTS Oui' },
                    { value: 'BTTS Non', text: 'BTTS Non' }
                ];
                break;
            case 'over':
                options = [
                    { value: 'Over 2.5', text: 'Over 2.5' },
                    { value: 'Under 2.5', text: 'Under 2.5' }
                ];
                break;
            case 'under':
                options = [
                    { value: 'Under 2.5', text: 'Under 2.5' },
                    { value: 'Over 2.5', text: 'Over 2.5' }
                ];
                break;
            case 'draw':
                options = [
                    { value: 'X', text: 'X' }
                ];
                break;
            default:
                options = [
                    { value: '1', text: '1' },
                    { value: 'X', text: 'X' },
                    { value: '2', text: '2' }
                ];
        }
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            predictionSelect.appendChild(optionElement);
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.winxApp = new WinXApp();
});
