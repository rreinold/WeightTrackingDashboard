var unmeasuredCheckIns = null;
var dueDate = null
var allCheckIns = null
var weightLossPerWeek = 0

var cb = new ClearBlade();
var initOptions = {
    URI : "https://platform.clearblade.com",
    messagingURI : "platform.clearblade.com",
    messagingPort: 8904,
    useMQTT: true,
    cleanSession: true,
    systemKey: "8892fcf30aeea7ba9691e780868201",
    systemSecret: "8892FCF30A8CDDED9DFDDD92A75C",
};

// Request schemas for the Tag collection
function fetchUnmeasuredCheckIns(callback) {
    var deferred = Q.defer();
    var query = ClearBlade.prototype.Query({"collectionName":"Checkins"})
    query.equalTo("measured",false)
    query.ascending("checkindate")
    query.setPage(0, 0);
    query.fetch(function(err, data){
        if (err){
           alert(JSON.stringify(data));
        }else{
            // Store API response locally
            unmeasuredCheckIns = data;
            deferred.resolve()
            // If both have loaded, then load the data grid
            callback();
        }
    })
    return deferred.promise
};

function fetchWeightGoal(){
    var deferred = Q.defer();
    var query = ClearBlade.prototype.Query({"collectionName":"FinalGoals"})
    query.equalTo("targetname","Weight")
    query.setPage(0, 0);
    query.fetch(function(err, data){
        if (err){
           alert(JSON.stringify(data));
        }else{
            // Store API response locally
            targetWeight = data[0].data.targetvalue;
            dueDate = data[0].data.duedate;
            deferred.resolve()
        }
    })
    return deferred.promise
}

function fetchWeightLossPerWeek(){
    var deferred = Q.defer();
    var query = ClearBlade.prototype.Query({"collectionName":"FinalGoals"})
    query.equalTo("targetname","WeightLossPerWeek")
    query.setPage(0, 0);
    query.fetch(function(err, data){
        if (err){
           alert(JSON.stringify(data));
        }else{
            // Store API response locally
            weightLossPerWeek = data[0].data.targetvalue;
            deferred.resolve()
        }
    })
    return deferred.promise
}

function fetchAllCheckInData(callback){
    var deferred = Q.defer();
    var query = ClearBlade.prototype.Query({"collectionName":"Checkins"})
        query.setPage(0, 0);
        query.ascending("checkindate")
        query.fetch(function(err, data){
            if (err){
               alert(JSON.stringify(data));
            }else{
                // Store API response locally
                allCheckIns = data
                // callback()
                deferred.resolve()
            }
        })
        return deferred.promise

}

// Request schemas for the Tag collection
var isCoordinator = function(successCallback, failureCallback) {

    successCallback();

    // cb.Code().execute("isCoordinator", {}, function(err, data) {
    //     if(err) {
    //         failureCallback();
    //     } else {
    //         successCallback();
    //     }
    // });
};

//START API call functions

var startup = function(){

    var initCallback = function(err, data){
        if(err) {
            // this path should not happen and would only happen with a misconfigured system or server outage
            alert("failed to init");
        } else {

            var authCallback = function(){
                showView(DEFAULT_POST_LOGIN_VIEW);
                startupMainDashboard();
                startupCheckIn()
                // Start up any additional pages
            };

            var noAuthCallback = function(){
                // blockUI not yet implemented
                // blockUI(false, "You are not authorized to access this dashboard.");
                showView("login");
            }

            checkAuth(authCallback, noAuthCallback)
                
            }
    };
    initOptions.callback = initCallback;
    
    cb.init(initOptions);
}

// Sort the js grid by a field
var sortByField = function(gridName, field){
        $(gridName).jsGrid("sort", { field: field, order: "asc" });
}