function getToolkitParams(selectedAlgo) {
    switch (selectedAlgo) {
        
        // Classification
        case "Logistic regression":
            return {
                "maxIter":"int",
                "regParam":"double",
                "elasticNetParam":"double",
                "tol":"string",
                "fitIntercept":"boolean",
                "threshold":"double",
                "standardization":"boolean",
                "aggregationDepth":"int",
                "family":"string",
                "maxBlockSizeInMB":"double"
            }
        case "Decision tree classifier":
            return {
                "maxDepth": "int",
                "maxBins": "int",
                "minInstancesPerNode": "int",
                "minInfoGain": "float",
                "maxMemoryInMB": "int ",
                "cacheNodeIds": "bool",
                "checkpointInterval": "int",
                "impurity": "str ",
                "minWeightFractionPerNode": "float "
            }
        case "Random forest classifier":
            return {        
                "maxDepth":"int",
                "maxBins":"int",
                "minInstancesPerNode":"int",
                "minInfoGain":"float",
                "maxMemoryInMB":"int",
                "cacheNodeIds":"bool",
                "checkpointInterval":"int",
                "impurity":"str",
                "numTrees":"int",
                "subsamplingRate":"float",
                "minWeightFractionPerNode":"float"
            }
        case "Gradient-boosted tree classifier":
            return {
                "maxDepth": "int",
                "maxBins": "int",
                "minInstancesPerNode": "int",
                "minInfoGain": "float",
                "maxMemoryInMB": "int",
                "cacheNodeIds": "bool",
                "checkpointInterval": "int",
                "maxIter": "int",
                "stepSize": "float",
                "subsamplingRate": "float",
                "validationTol": "float",
                "minWeightFractionPerNode": "float"          
            }
        case "Multilayer perceptron classifier":
            return {
                "maxIter": "int",
                "tol": "float",
                "blockSize": "int",
                "stepSize": "float",
                "solver": "str"
            }
        case "Linear Support Vector Machine":
            return {
                "maxIter": "int",
                "regParam": "float",
                "tol": "float",
                "fitIntercept": "bool",
                "standardization": "bool",
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
                "tol": "float",
                "fitIntercept": "bool",
                "standardization": "bool",
                "solver": "str",
                "aggregationDepth": "int",
                "loss": "str",
                "epsilon": "float",
                "maxBlockSizeInMB": "float"
            }
        case "Generalized linear regression":
            return {
                "maxIter": "int",
                "regParam": "float",
                "elasticNetParam": "float",
                "tol": "float",
                "fitIntercept": "bool",
                "standardization": "bool",
                "solver": "str",
                "aggregationDepth": "int",
                "loss": "str",
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
                "cacheNodeIds": "bool",
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
                "cacheNodeIds": "bool",
                "checkpointInterval": "int",
                "subsamplingRate": "float",
                "numTrees": "int",
                "minWeightFractionPerNode": "float"
            }
        case "Gradient-boosted tree regression":
            return {
                "maxDepth": "int",
                "maxBins": "int",
                "minInstancesPerNode": "int",
                "minInfoGain": "float",
                "maxMemoryInMB": "int",
                "cacheNodeIds": "bool",
                "subsamplingRate": "float",
                "checkpointInterval": "int",
                "lossType": "str",
                "maxIter": "int",
                "stepSize": "float",
                "validationTol": "float"
            }

        // Clustering
        case "K-means":
            return {
                "k": "int",
                "initMode": "str",
                "initSteps": "int",
                "tol": "float",
                "maxIter": "int",
                "distanceMeasure": "str"
            }
        case "Latent Dirichlet Allocation":
            return {
                "maxIter": "int",
                "checkpointInterval": "int",
                "k": "int",
                "optimizer": "str",
                "learningOffset": "float",
                "learningDecay": "float",
                "subsamplingRate": "float",
                "optimizeDocConcentration": "bool",
                "keepLastCheckpoint": "bool"
            } 
        case "Gaussian Mixture":
            return {
                "k": "int",
                "tol": "float",
                "maxIter": "int",
                "aggregationDepth": "int"
            }
        default:
            return undefined
    }
}