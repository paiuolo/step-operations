'use strict';


/*
 Step Operation module.
 
 params:
    Object stepOperation
    Object eventDispatcher
 
 */

const StepOperationMixin = (superClass) => class extends superClass {
    // Private

        constructor(){
            super();
        }
        
        static get properties() {
            return {
                _cleanOperationObject: Object,
                _numberOfSteps: Number,
                _activeSteps: Array,
                
                operationString: String,
                operationObject: {
                    type: Object,
                    notify: true
                },
                activeStep: {
                    type: Number,
                    value: 0,
                    notify: true
                }

            };
        }
        
        static get observers(){
            return [
                '_resultsChanged(operationObject.steps.*)',
                '_activeStepChanged(activeStep)',
                   ];
        }
        
        _resultsChanged(change){
            if(change.path !== 'operationObject.steps' && change.path.indexOf('.enabled') == -1){
                console.log('!!operationObject results changed', change);
                // result has chaged
                let stepResult = change.value;
                if(stepResult){
                    let stepPath = change.path.replace('.result', '');
                    let stepKey = this.get(stepPath + '.key');
                    
                    this.setActiveStepResult(stepResult);
                }
            }
        }

        _activeStepChanged(step){
            console.log('active step changed', step);
            this.setActiveStep(id);
        }
        
        ready(){
            super.ready();

            // Check component initialization parameters
            if(this.operationString==undefined){
                if(this.operationObject == undefined){
                    throw 'Either operation-as-string or operation parameters must be set';
                }
                else {
                    console.log('setting by operation');
                    let _op = JSON.stringify(operationObject);
                    this._cleanOperationObject = JSON.parse(_op);
                }
            }
            else{
                console.log('setting by string');
                this.operationObject = JSON.parse(this.operationString);
                this._cleanOperationObject = JSON.parse(this.operationString);
            }
            
            this._activeSteps = [0, ];
            this._numberOfSteps = this.operationObject.steps.length;
        }
    
        _getUUID(){
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
        
        _stepIdByKey(key){
            let stepId = -1;
            let steps = this.operationObject.steps;
            
            for(let i=0; i<this._numberOfSteps; i++){
                if(steps[i].key == key){
                    return i;
                }
            }
            return stepId;
        }
        
        _stepKeyById(id){
            this.operationObject.steps[id].key;
        }

        _setLaterStepsEnableState(firstId, enabled){
            let changes = 0;
            let actualLaterStepsKeys = this.operationObject.steps[firstId].enables;
            actualLaterStepsKeys.map((item)=>{
                let stepId = this._stepIdByKey(item);
                if(stepId > -1){
                    this.operationObject.steps[stepId].enabled = enabled;
                    let nexToEnable = this.operationObject.steps[stepId].enables;
                    changes += 1;
                    if(!enabled){
                        this.operationObject.steps[stepId].result = this._cleanOperationObject.steps[stepId].result;
                        changes += this._setLaterStepsEnableState(stepId, false);
                    }
                }
            });
            return(changes > 0);
        }

        // Public
        
        setActiveStep(id){
            let changes = 0;
            if(id>-1 && id<this._numberOfSteps){
                this._activeSteps.push(id);
                this.activeStep = id;
                changes += 1;
            }
            return(changes > 0);
        }
        
        getActiveStep(){
            let activeStep = this._activeSteps.slice(-1)[0];
            console.log('GET ACTIVE STEP', activeStep);
            return activeStep;
        }
        
        getPreviousActiveStep(){
            let previousActiveStep = this._activeSteps.slice(-2)[0];
            console.log('GET PREV ACTIVE STEP', previousActiveStep);
            return previousActiveStep;
        }
        
        clearStep(){
            let activeStep = this.getActiveStep();
            console.log('clearStep from', activeStep);
            return this._setLaterStepsEnableState(activeStep, false);
        }
        
        
        completeStep() {
            let activeStep = this.getActiveStep();
            console.log('completeStep from', activeStep);
            let changes = 0;
            this._setLaterStepsEnableState(activeStep, true);
            let nextStepKey = this.operationObject.steps[activeStep].enables[0];
            if(nextStepKey){
                let nextStepId = this._stepIdByKey(nextStepKey);
                
                this.setActiveStep(nextStepId);
                
                changes += 1;
            }
            return(changes > 0);
        }
        
        setActiveStepResult(stepResult){
            this.clearStep();
            let activeStep = this.getActiveStep();
            this.operationObject.steps[activeStep].result = stepResult;
            return this.completeStep();
        }
        
        getActiveStepResult(){
            let activeStep = this.getActiveStep();
            return this.operationObject.steps[activeStep].result;
        }
        
        stepBack(){
            if(this._activeSteps.length > 1){
                let previousActiveStep = this.getPreviousActiveStep();
                console.log('step back set prev avtive step', previousActiveStep);
                this.setActiveStep(previousActiveStep);
                this.clearStep();
            }
        }
        
        clear(){
            let done = this.setActiveStep(0);
            if(done){
                return this._clearStep();
            }
            return false;
        }
    
}

export default StepOperationMixin

/*
let stepOperation = {
    "key": "tools.modelling.health_risk.birth_weight_and_no2",
    "name": "Birth weight and no2",
    "description": "...",
    "steps": [
        {
            "key": "select_shapefile",
            "name": "Select shapefile",
            "description": null,
            "enabled": true,
            "enables": ["select_driver"],
            "result": null
        },
         {
            "key": "select_driver",
            "name": "Select driver",
            "description": "Field regarding average outdoor concentration of no2",
            "enabled": false,
            "enables": ["choose_output_field"],
            "result": null
        },
         {
            "key": "choose_output_field",
            "name": "Choose output field",
            "description": "Change in average birth weight field",
            "enabled": false,
            "enables": ["review"],
            "result": null
        },
         {
            "key": "review",
            "name": "Review",
            "description": null,
            "enabled": false,
            "enables": ["results"],
            "result": null
        },
         {
            "key": "results",
            "name": "Results",
            "description": null,
            "enabled": false,
            "enables": [],
            "result": null
        }
    ]
};
*/
