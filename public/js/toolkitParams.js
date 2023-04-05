function getToolkitParams(selectedAlgo) {
    switch (selectedAlgo) {
        
        // Classification
        case "Logistic regression":
            return {
                "maxIter":"int",
                "regParam":"float",
                "elasticNetParam":"float",
                "tol":"string",
                "fitIntercept":"boolean",
                "threshold":"float",
                "standardization":"boolean",
                "aggregationDepth":"int",
                "family":{
                    "type":"string",
                    "options":["auto","binomial","multinomial"]
                },
                "maxBlockSizeInMB":"float"
            }
        case "Decision tree classifier":
            return {
                "maxDepth": "int",
                "maxBins": "int",
                "minInstancesPerNode": "int",
                "minInfoGain": "float",
                "maxMemoryInMB": "int",
                "cacheNodeIds": "boolean",
                "checkpointInterval": "int",
                "impurity": {
                    "type": "string",
                    "options": ["gini", "entropy"]
                },
                "minWeightFractionPerNode": "float"
            }
        case "Random forest classifier":
            return {        
                "maxDepth":"int",
                "maxBins":"int",
                "minInstancesPerNode":"int",
                "minInfoGain":"float",
                "maxMemoryInMB":"int",
                "cacheNodeIds":"boolean",
                "checkpointInterval":"int",
                "impurity":{
                    "type":"string",
                    "options":["gini","entropy"]
                },
                "numTrees":"int",
                "subsamplingRate":"float",
                "minWeightFractionPerNode":"float"
            }
        case "Gradient boosted tree classifier":
            return {
                "maxDepth": "int",
                "maxBins": "int",
                "minInstancesPerNode": "int",
                "minInfoGain": "float",
                "maxMemoryInMB": "int",
                "cacheNodeIds": "boolean",
                "checkpointInterval": "int",
                "maxIter": "int",
                "stepSize": "float",
                "subsamplingRate": "float",
                "validationTol": "float",
                "minWeightFractionPerNode": "float"          
            }
        case "Multilayer perceptron":
            return {
                "maxIter": "int",
                "tol": "string",
                "blockSize": "int",
                "stepSize": "float",
                "solver": {
                    "type": "string",
                    "options": ["gd", "l-bfgs"]
                }
            }
        case "Linear Support Vector Machine":
            return {
                "maxIter": "int",
                "regParam": "float",
                "tol": "string",
                "fitIntercept": "boolean",
                "standardization": "boolean",
                "threshold": "float",
                "aggregationDepth": "int",
                "maxBlockSizeInMB": "float"
            }

        // Regression
        case "Linear regression":
            return {
                "maxIter": "int",
                "regParam": "float",
                "elasticNetParam": "float",
                "tol": "string",
                "fitIntercept": "boolean",
                "standardization": "boolean",
                "solver": {
                    "type": "string",
                    "options": ["auto", "normal", "l-bfgs"]
                },
                "aggregationDepth": "int",
                "loss": {
                    "type": "string",
                    "options": ["squaredError", "huber"]
                },
                "epsilon": "float",
                "maxBlockSizeInMB": "float"
            }
        case "Decision tree regression":
            return {
                "maxDepth": "int",
                "maxBins": "int",
                "minInstancesPerNode": "int",
                "minInfoGain": "float",
                "maxMemoryInMB": "int",
                "cacheNodeIds": "boolean",
                "checkpointInterval": "int",
                "minWeightFractionPerNode": "float"
            }
        case "Random forest regression":
            return {
                "maxDepth": "int",
                "maxBins": "int",
                "minInstancesPerNode": "int",
                "minInfoGain": "float",
                "maxMemoryInMB": "int",
                "cacheNodeIds": "boolean",
                "checkpointInterval": "int",
                "subsamplingRate": "float",
                "numTrees": "int",
                "minWeightFractionPerNode": "float"
            }
        case "Gradient boosted tree regression":
            return {
                "maxDepth": "int",
                "maxBins": "int",
                "minInstancesPerNode": "int",
                "minInfoGain": "float",
                "maxMemoryInMB": "int",
                "cacheNodeIds": "boolean",
                "subsamplingRate": "float",
                "checkpointInterval": "int",
                "lossType": {
                    "type": "string",
                    "options": ["squared", "absolute"]
                },
                "maxIter": "int",
                "stepSize": "float",
                "validationTol": "float"
            }

        // Clustering
        case "Kmeans":
            return {
                "k": "int",
                "initMode": {
                    "type": "string",
                    "options": ["random", "k-means||"]
                },
                "initSteps": "int",
                "tol": "string",
                "maxIter": "int",
                "distanceMeasure": {
                    "type": "string",
                    "options": ["euclidean", "cosine"]
                }
            }
        case "Latent Dirichlet Allocation":
            return {
                "maxIter": "int",
                "checkpointInterval": "int",
                "k": "int",
                "optimizer": {
                    "type": "string",
                    "options": ["online", "em"]
                },
                "learningOffset": "float",
                "learningDecay": "float",
                "subsamplingRate": "float",
                "optimizeDocConcentration": "boolean",
                "keepLastCheckpoint": "boolean"
            } 
        case "Gaussian Mixture Model":
            return {
                "k": "int",
                "tol": "string",
                "maxIter": "int",
                "aggregationDepth": "int"
            }
        default:
            return undefined
    }
}