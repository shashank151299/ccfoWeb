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
      location.replace(link+"/home.html")
    } else {
      // User is not signed in.
    }
  });

  function login(event) {
    event.preventDefault()
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // ...
      })
      .catch((error) => {
        console.log("error in signIn",error.message)
        alert(error.message)
      });
  }