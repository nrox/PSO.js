

function PSO(options) {
    var defaults = {
        size: 20,
        dimensions: 2,
        degree: 4,
        steps: 10000,
        fitness: function (pos) {
            var sum = 0;
            for (var i = 0; i < pos.length; i++) {
                sum += pos[i] * pos[i];
            }
            return Math.sqrt(sum);
        },
        criteria: function (pos) {
            return this.fitness(pos) <= 1.0e-2;
        },
        C1: 2.05,
        C2: 2.05,
        X: 0.729,
        noise: 1.0e-12
    };
    options || (options = {});
    for (var o in defaults){
        if (options.hasOwnProperty(o)){
        } else {
            options[o] = defaults[o];
        }
        this[o] = options[o];
    }
    this.options = options;
    this.actualFitness = [];
    this.partBestFit = [];
    this.velocities = [];
    this.positions = [];
    this.partBestPos = [];
    this.edges = [];
    this.bestParticleInNeighs = [];
    this.bestParticle = 0;
    this.curStep = 0;
    this.initialize();
}

PSO.prototype.rnd = function () {
    return Math.random() - 0.5;
};

PSO.prototype.initialize = function () {
    var n, link;
    for (var i = 0; i < this.size; i++) {
        this.partBestFit.push(Number.MAX_VALUE);
        this.actualFitness.push(Number.MAX_VALUE);
    }
    //create random particles
    for (n = 0; n < this.size; n++) {
        this.positions.push([]);
        this.partBestPos.push([]);
        this.velocities.push([]);
        for (var d = 0; d < this.dimensions; d++) {
            this.positions[n].push(this.rnd());
            this.partBestPos[n].push(this.positions[n][d]);
            this.velocities[n].push(0);
        }
    }
    //create random edges for distinct individuals
    for (n = 0; n < this.size; n++) {
        this.edges.push([]);
        for (var e = 0; e < this.degree; e++) {
            link = n;
            while ( n==link || (this.edges[n].indexOf(link)>-1)){
                link = Math.floor(this.size * Math.random());
            }
            this.edges[n].push(link);
        }
    }
};

PSO.prototype.reset = function(options){
    PSO.call(this, options || this.options);
};

PSO.prototype.step = function () {
    this.actualFitness = this.positions.map(this.fitness, this);
    this.replaceParticlesBests();
    this.updateVelocities();
    this.updatePositions();
};

PSO.prototype.evolve = function () {
    this.curStep = 0;
    while (!this.isSuccessful() && (this.curStep++<this.steps)){
        this.step();
    }
    return this.result();
};

PSO.prototype.isSuccessful = function () {
    return this.criteria.call(this, this.result());
};

PSO.prototype.result = function () {
    return this.partBestPos[this.bestParticle];
};

PSO.prototype.updatePositions = function () {
    for (var n = 0; n < this.size; n++) {
        for (var d = 0; d < this.dimensions; d++) {
            this.positions[n][d] += this.velocities[n][d];
            this.positions[n][d] += this.rnd() * this.noise;
        }
    }
};

PSO.prototype.updateVelocities = function () {
    for (var n = 0; n < this.size; n++) {
        for (var d = 0; d < this.dimensions; d++) {
            this.velocities[n][d] = this.X * (this.velocities[n][d]
                + this.C1 * Math.random() * (this.partBestPos[n][d] - this.positions[n][d])
                + this.C2 *  Math.random() * (this.partBestPos[this.bestParticleInNeighs[n]][d] - this.positions[n][d])
                );
        }
    }
};

PSO.prototype.replaceParticlesBests = function () {
    var n;
    //best fitness for each particle
    for (n = 0; n < this.size; n++) {
        if (this.actualFitness[n] < this.partBestFit[n]) {
            this.partBestFit[n] = this.actualFitness[n];
            for (var d = 0; d < this.dimensions; d++) {
                this.partBestPos[n][d] = this.positions[n][d];
            }
        }
    }
    //best particle in the neighborhood of i: g[i]
    var bestLocalFitness;
    for (n = 0; n < this.size; n++) {
        this.bestParticleInNeighs[n] = n; //consider the best particle, the self
        bestLocalFitness = this.partBestFit[n];
        for (var e in this.edges[n]) { //for all neighs
            e = this.edges[n][e];
            if (this.partBestFit[e] < bestLocalFitness) { //if its fit is better than current
                bestLocalFitness = this.partBestFit[e];
                this.bestParticleInNeighs[n] = e;
            }
        }
        //global best
        if (this.partBestFit[n] < this.partBestFit[this.bestParticle]) {
            this.bestParticle = n;
        }
    }
};
