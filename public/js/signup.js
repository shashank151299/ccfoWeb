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
  firebase.initializeApp(firebaseConfig);

  //var link = "https://shashank151299.github.io/ccfoWeb/public";
  var link = "https://pmms-ccfo.web.app/";
  //var link = "http://localhost:5000";
  var xuser;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      //not usefull here as ir redirects before proccesing.
      //location.replace(link+"/home.html")
    } else {
      // User is not signed in.
    }
  });

  function signIn(event){
    event.preventDefault()
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
    var confirmPassword = document.getElementById('confirm_password').value
    var userName = document.getElementById('user_name').value
    var mobile = document.getElementById('mobile_no').value
    
    if(confirmPassword==password){
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            //alert('before call' + user.uid)
            var db = firebase.database().ref('UserData/'+((user.uid).toString()));
            //alert('test')
            db.set({
              username: userName.toString(),
              email: email.toString(),
              mobile: mobile.toString()
            }).then(() => {
              //redirecting
              location.replace(link+"/login.html")
            });
            // ...
            return 
        })
        .catch((error) => {
            console.log("error in signUp",error.message)
            alert(error.message)
        });
    }
    else{
        alert('Password and Comfirm Password are Different!!!')
    }    
  }