// Authentication management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUser();
    }

    loadUser() {
        const savedUser = localStorage.getItem('winx_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    saveUser(user) {
        this.currentUser = user;
        localStorage.setItem('winx_user', JSON.stringify(user));
    }

    login(email, password) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const user = {
                        id: Utils.generateId(),
                        name: email.split('@')[0],
                        email: email,
                        gems: 5,
                        isAdmin: email === 'admin@winx.com',
                        joinDate: new Date().toISOString()
                    };
                    this.saveUser(user);
                    resolve(user);
                } else {
                    reject(new Error('Email et mot de passe requis'));
                }
            }, 1000);
        });
    }

    register(name, email, password) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (name && email && password) {
                    const user = {
                        id: Utils.generateId(),
                        name: name,
                        email: email,
                        gems: 5,
                        isAdmin: false,
                        joinDate: new Date().toISOString()
                    };
                    this.saveUser(user);
                    resolve(user);
                } else {
                    reject(new Error('Tous les champs sont requis'));
                }
            }, 1000);
        });
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('winx_user');
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin;
    }

    addGems(amount) {
        if (this.currentUser) {
            this.currentUser.gems += amount;
            this.saveUser(this.currentUser);
            return this.currentUser.gems;
        }
        return 0;
    }

    deductGems(amount) {
        if (this.currentUser && this.currentUser.gems >= amount) {
            this.currentUser.gems -= amount;
            this.saveUser(this.currentUser);
            return this.currentUser.gems;
        }
        return false;
    }
}
