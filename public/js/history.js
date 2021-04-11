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

  //var link = "https://shashank151299.github.io/ccfoWeb/public";
  var link = "https://pmms-ccfo.web.app/";
  //var link = "http://localhost:5000";

  firebase.initializeApp(firebaseConfig);
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      //on load of home page if any task, do it here.
      //alert('welcome ' + user.uid)

      var db = firebase.database();
      db.ref('UserData/'+user.uid).on('value', function(snapshot){
        document.getElementById('uname').innerHTML = snapshot.val().username;
        document.getElementById('email').innerHTML = snapshot.val().email;
      });
      db.ref('History/').on('value', function(snapshot){
        //console.log(snapshot.key)
        snapshot.forEach(
          function(snap){
            document.getElementById('main_div').innerHTML = "";
            //console.log(snap.key)
            snap.forEach(
              function(childSnapshot){
                //console.log(childSnapshot.key)
                if(childSnapshot.key == user.uid){
                  //console.log('inside')
                  var arr = [];
                  var i = 0;
                  childSnapshot.forEach(
                    function(arrChild){
                      arr.push(arrChild)
                      console.log(arr);
                      i++;                  
                    }
                  )
                  arr.reverse();
                  arr.forEach(
                    function(childSnap){
                      //console.log("test"+ childSnap.key)
                      var imgUrl = childSnap.val().imageUrl;
                      var title = childSnap.val().title;
                      var cantName = childSnap.val().canteenName;
                      var price = childSnap.val().price;
                      var quant = childSnap.val().quantity;
                      var total = childSnap.val().subtotal;
                      var desc = childSnap.val().description;
                      var cust = childSnap.val().customization;
                      var status = childSnap.val().status;
                      var proId = childSnap.val().productId;
                      //console.log("test"+ imgUrl)
                      liveCard(imgUrl,title,cantName,price,quant,total,desc,cust,status,proId,user.uid);
                    }
                  )
                }
              }
            )
          }
        )
      });

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

  //function to create livecard.
  function liveCard(imgUrl,title,cantName,price,quant,total,desc,cust,status,proid,userId){
    var mainDiv = document.getElementById('main_div');

    var cardContainer = document.createElement('div');
    cardContainer.classList.add('col-md-6','col-12','justify-content-center','pb-1');

    var cardSubContainer = document.createElement('div');
    cardSubContainer.classList.add('row','recent-card');

    var cardPart1 = document.createElement('div');
    cardPart1.classList.add('col-5','p-0','m-0');

    var imgElement = document.createElement('img');
    imgElement.classList.add('food-img','img-fluid');
    imgElement.alt = "foodimg";
    imgElement.src = imgUrl.toString();

    var titleElement = document.createElement('h6');
    titleElement.className = "card-text-head";
    titleElement.innerHTML = title.toString();

    var canteenElement = document.createElement('h6');
    canteenElement.className = "card-text-sub";
    canteenElement.innerHTML = cantName.toString();

    var priceElement = document.createElement('p');
    priceElement.className = "price_text";

    var strElement = document.createElement('strong');
    strElement.innerHTML = "Price: ";

    var litElement = document.createElement('light');
    litElement.innerHTML = "₹";

    var priceValue = document.createElement('light');
    priceValue.innerHTML = price.toString();
    
    var cardPart2 = document.createElement('div');
    cardPart2.classList.add('col-7','content','p-0','border-left');

    var quantParaElement = document.createElement('p');
    
    var quantStrElement = document.createElement('strong');
    quantStrElement.innerHTML = "Quantity: ";

    var quantValue = document.createElement('light');
    quantValue.innerHTML = quant.toString();

    var totalParaElement = document.createElement('p');
    
    var totalStrElement = document.createElement('strong');
    totalStrElement.innerHTML = "Total: ";

    var totalrsElement = document.createElement('light');
    totalrsElement.innerHTML = "₹";

    var totalValue = document.createElement('light');
    totalValue.innerHTML = total.toString();

    var descParaElement = document.createElement('p');
    
    var descStrElement = document.createElement('strong');
    descStrElement.innerHTML = "Description: ";

    var descValue = document.createElement('light');
    descValue.innerHTML = desc.toString();

    var custParaElement = document.createElement('p');
    
    var custStrElement = document.createElement('strong');
    custStrElement.innerHTML = "Customization: ";

    var custValue = document.createElement('light');
    custValue.innerHTML = cust.toString();

    var statusParaElement = document.createElement('p');
    statusParaElement.style.marginBottom = "25px";

    var statusStrElement = document.createElement('strong');
    statusStrElement.innerHTML = "Status: ";

    var statusValue = document.createElement('light');
    statusValue.innerHTML = status.toString();

    var repeatDiv = document.createElement('div');
    repeatDiv.classList.add('col','rep-ord','d-flex','align-items-end','flex-column');

    var repeatParaElement = document.createElement('button');
    repeatParaElement.innerHTML = "<img src=\"res/repeat.svg\"> Repeat Order"
    repeatParaElement.setAttribute('onclick',('fun("'+proid+'","'+userId+'")'));

    mainDiv.appendChild(cardContainer);
    cardContainer.appendChild(cardSubContainer);
    cardSubContainer.append(cardPart1,cardPart2);
    cardPart1.append(imgElement,titleElement,canteenElement,priceElement)
    priceElement.append(strElement,litElement,priceValue);
    cardPart2.append(
      quantParaElement,
      totalParaElement,
      descParaElement,
      custParaElement,
      statusParaElement,
      repeatDiv
    );
    quantParaElement.append(quantStrElement,quantValue);
    totalParaElement.append(totalStrElement,totalrsElement,totalValue);
    descParaElement.append(descStrElement,descValue);
    custParaElement.append(custStrElement,custValue);
    statusParaElement.append(statusStrElement,statusValue);
    repeatDiv.appendChild(repeatParaElement);
  }

    //this fun function is for adding items to cart.
    function fun(proId,uId){
      db = firebase.database();
      db.ref('Inventory/'+proId).on('value', function(snapshot){
        var canteenId = snapshot.val().canteenId;
        var proDesc = snapshot.val().desc;
        var proImageUrl = snapshot.val().imageUrl;
        var proName = snapshot.val().name;
        var proPrice = snapshot.val().price;
        var quant = '1';
        db.ref('CanteenOwners/'+canteenId).on('value', function(snap){
          var cantName = snap.val().canteenName;
          db.ref('UserData/'+uId).on('value',function(childSnap){
            var uname = childSnap.val().username;
            db.ref('TempOrder/'+canteenId+'/'+uId).push().set({
              username: uname,
              productId: proId,
              title: proName,
              canteenName: cantName,
              price: proPrice,
              quantity: quant,
              subTotal: (proPrice*quant),
              description: proDesc,
              customization: "none",
              status: "Not Accepted",
              imgUrl: proImageUrl
            });
          });
        });
      });
      alert("Item Added to Cart");
    }