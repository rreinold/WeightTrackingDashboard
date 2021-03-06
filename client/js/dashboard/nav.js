var views = {
      login: {
        setup: function() {



          var authCallback = function(){
            showView("maindashboard");
          };

          var noAuthCallback = function(){
            // RR: BlockUI not implemented yet
            // blockUI(true, "Failed to log in.")
            // showView("login");
          }

          checkAuth(authCallback, noAuthCallback)

        } 
      },
      logout: {
        setup: function() {

          logoutEvent();
          setActiveButton("maindashboard");
          setLoggedInAs(false);
        } 
      },
      maindashboard: {
      	setup: function() {

          // Check if has access
            setActiveButton("maindashboard");
            setLoggedInAs(true);

          var authCallback = function(){
            var hasAccessCallback = function(){
                startupMainDashboard();
            }
            var noAccessCallback = function(){
              // RR: BlockUI not implemented yet
              // blockUI(true, "You do not have access to this dashboard");
              // showView("login");
            }

            isCoordinator(hasAccessCallback, noAccessCallback);
          }
          var noAuthCallback = function(){
            // RR: BlockUI not implemented yet
            // blockUI("You do not have access.");
            showView("login");
          }

          checkAuth(authCallback, noAuthCallback);

      	}
      },
      checkin: {
        setup: function() {

          setActiveButton("checkinButton");
          setLoggedInAs(true);
          var authCallback = function(){
            startupCheckIn();
          };

          var noAuthCallback = function(){
            showView("login");
          }

          checkAuth(authCallback, noAuthCallback)

        }
      },
  };