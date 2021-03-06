PSO.js
======

Implementation of a Particle Swarm Optimizer in Javascript

This optimizer can produce similar results as Genetic Algorithms, and is suitable for cases where
the variables to optimize are real numbers, rather than discrete quantities.

In this implementation the initial population is generated randomly, with each dimension in the interval -0.5 to +0.5. During the evolution
this interval may be trespassed.

You must supply a fitness function (defaults to distance to origin), and a stop criteria function to verify if the evolution
has achieved satisfactory results.

Example of usage:

    var pso = new PSO({
        dimensions: 2, //position dimensions {x,y,...}
        fitness:  function(position){ //fitness function to evaluate each individual
            var sum = 0;
            for (var i = 0; i < pos.length; i++){
                sum += pos[i] * pos[i];
            }
            return Math.sqrt(sum);
        },
        criteria: function(position){ //criteria to stop
            return this.fitness(position)<0.01;
        }
    });

    //step into the evolution process until the result is satisfactory or the number of steps has been reached
    pso.evolve();

    //log the best result
    console.log(pso.result());

The argument to the constructor is an object with the following defaults:

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

Clone the repository and open test.html for a working example.

Reference:
[Particle Swarm Optimization, Kennedy & Eberhart](http://www.cs.tufts.edu/comp/150GA/homeworks/hw3/_reading6%201995%20particle%20swarming.pdf)