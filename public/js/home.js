var firebaseConfig = {
    apiKey: "AIzaSyBxMaK_ncQqk4bdpgwv3uDBhfCuLXed4Mc",
    authDomain: "pmms-ccfo.firebaseapp.com",
    databaseURL: "https://pmms-ccfo-default-rtdb.firebaseio.com",
    projectId: "pmms-ccfo",
    storageBucket: "pmms-ccfo.appspot.com",
    messagingSenderId: "906514244130",
    appId: "1:906514244130:web:8b6c47d1f9d5c0dc07a07b",
    measurementId: "G-HK4HRJKCTT"
  };

  var link = "https://shashank151299.github.io/ccfoWeb/public";

  firebase.initializeApp(firebaseConfig);
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      //on load of home page if any task
      //alert('welcome ' + user.uid)
      document.getElementById('email').innerHTML = user.email
    } else {
      // User is not signed in.
      location.replace(link+"/login.html")
    }
  });

  //Signout Function below:
  function logOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        location.replace(link+"login.html")
      }).catch((error) => {
        // An error happened.
      });
  }