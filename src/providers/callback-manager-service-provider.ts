
export class CallbackMangerServiceProvider {
    callbackItems: string[] = [];

    constructor() {
        this.callbackItems = [];
    }

    public add(callbackIdentifier: string){
        console.log("CB Added: " + callbackIdentifier);
        this.callbackItems.push(callbackIdentifier);
    }

    public removeCheckDismiss(callbackIdentifier: string, loader: any){
        console.log("CB removed: " + callbackIdentifier);
        
        let index = this.callbackItems.indexOf(callbackIdentifier);
        this.callbackItems.splice(index, 1);
        if(this.callbackItems.length === 0){
            loader.dismiss();
            return true;
        }
        return false;
    }

    public removeCheck(callbackIdentifier: string) {
        console.log("CB removed: " + callbackIdentifier);
        
        let index = this.callbackItems.indexOf(callbackIdentifier);
        this.callbackItems.splice(index, 1);
        if (this.callbackItems.length === 0) {
            return true;
        }
        return false;
    }
}