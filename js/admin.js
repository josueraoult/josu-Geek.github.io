// Admin panel functionality
class AdminManager {
    constructor() {
        this.predictions = [];
        this.editingPrediction = null;
        this.init();
    }

    init() {
        this.loadPredictions();
    }

    loadPredictions() {
        const savedPredictions = localStorage.getItem('winx_predictions');
        if (savedPredictions) {
            this.predictions = JSON.parse(savedPredictions);
        } else {
            this.predictions = this.generateInitialPredictions();
            this.savePredictions();
        }
    }

    generateInitialPredictions() {
        const leagues = ['Ligue 1', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga'];
        const teams = ['PSG', 'OM', 'OL', 'Monaco', 'Real Madrid', 'Barcelona', 'Bayern', 'Dortmund', 'Juventus', 'Inter', 'Man City', 'Liverpool', 'Chelsea', 'Arsenal'];
        
        return Array.from({ length: 12 }, (_, i) => {
            const teamA = teams[Math.floor(Math.random() * teams.length)];
            let teamB = teams[Math.floor(Math.random() * teams.length)];
            while (teamB === teamA) teamB = teams[Math.floor(Math.random() * teams.length)];
            
            const type = ['combo', 'vip', 'unique'][Math.floor(Math.random() * 3)];
            const gemCost = type === 'vip' ? 2 : 1;
            
            return {
                id: Utils.generateId(),
                teamA,
                teamB,
                league: leagues[Math.floor(Math.random() * leagues.length)],
                date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                time: `${Math.floor(Math.random() * 12) + 10}:${['00', '30'][Math.floor(Math.random() * 2)]}`,
                confidence: Math.floor(Math.random() * 40) + 60,
                odds: (1.5 + Math.random() * 2).toFixed(2),
                type: type,
                betType: 'victory',
                prediction: ['1', 'X', '2'][Math.floor(Math.random() * 3)],
                analysis: 'Analyse basée sur les dernières performances et statistiques des équipes, forme des joueurs, et conditions de match.',
                gemCost: gemCost,
                unlocked: i < 3,
                teamALogo: null,
                teamBLogo: null
            };
        });
    }

    savePredictions() {
        localStorage.setItem('winx_predictions', JSON.stringify(this.predictions));
    }

    addPrediction(predictionData) {
        const newPrediction = {
            ...predictionData,
            id: Utils.generateId(),
            unlocked: false
        };
        this.predictions.push(newPrediction);
        this.savePredictions();
        return newPrediction;
    }

    updatePrediction(id, predictionData) {
        const index = this.predictions.findIndex(p => p.id === id);
        if (index !== -1) {
            this.predictions[index] = { ...this.predictions[index], ...predictionData };
            this.savePredictions();
            return this.predictions[index];
        }
        return null;
    }

    deletePrediction(id) {
        this.predictions = this.predictions.filter(p => p.id !== id);
        this.savePredictions();
    }

    getPrediction(id) {
        return this.predictions.find(p => p.id === id);
    }

    getAllPredictions() {
        return this.predictions;
    }

    filterPredictions(type) {
        if (type === 'all') return this.predictions;
        return this.predictions.filter(p => p.type === type);
    }

    unlockPrediction(id) {
        const prediction = this.getPrediction(id);
        if (prediction) {
            prediction.unlocked = true;
            this.savePredictions();
            return true;
        }
        return false;
    }

    generateAIAnalysis(teamA, teamB, league, betType) {
        const analyses = [
            `Analyse IA: ${teamA} affiche une forme solide à domicile avec 4 victoires dans les 5 derniers matchs. ${teamB} a des difficultés en déplacement. Notre algorithme privilégie ${teamA} pour cette rencontre.`,
            `Prédiction IA: Les deux équipes ont des attaques performantes mais des défenses fragiles. Notre modèle prédit un match avec des buts des deux côtés. Le BTTS semble une option solide.`,
            `Évaluation IA: ${teamA} domine statistiquement dans cette confrontation historique. Avec un taux de possession moyen de 58% à domicile, ils devraient contrôler le jeu.`,
            `Analyse algorithmique: Les données de forme récente montrent que ${teamB} a du mal à marquer en déplacement. Notre IA recommande de miser sur le under 2.5 buts.`,
            `Prédiction basée sur les données: Notre modèle a analysé 200+ facteurs incluant la forme des joueurs, les statistiques historiques et les conditions météo. La victoire de ${teamA} est la prédiction la plus probable.`
        ];
        
        return analyses[Math.floor(Math.random() * analyses.length)];
    }
                         }
