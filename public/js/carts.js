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
  //var link = "https://pmms-ccfo.web.app/";
  var link = "http://localhost:5000";
  var userdata;

  firebase.initializeApp(firebaseConfig);
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      userdata = user;
      //on load of home page if any task, do it here.
      //alert('welcome ' + user.uid)
      var db = firebase.database();
      db.ref('UserData/'+user.uid).on('value', function(snapshot){
        document.getElementById('uname').innerHTML = snapshot.val().username;
        document.getElementById('email').innerHTML = snapshot.val().email;
      });
      db.ref('TempOrder/').on('value', function(snapshot){
        var totalAmount = 0;
        document.getElementById('total').innerHTML = 0;
        document.getElementById('mainCard_div').innerHTML = "";
        //console.log(snapshot.key)
        snapshot.forEach(
          function(snap){
            //console.log(snap.key)
            snap.forEach(
              function(childSnapshot){
                //console.log(childSnapshot.key)
                if(childSnapshot.key == user.uid){
                  //console.log('inside')
                  childSnapshot.forEach(
                    function(childSnap){
                      //console.log("test"+ childSnap.key)
                      var protitle = childSnap.val().title;
                      var procantName = childSnap.val().canteenName;
                      var proprice = childSnap.val().price;
                      var prodesc = childSnap.val().description;
                      var procust  = childSnap.val().customization;
                      var proquant = childSnap.val().quantity;
                      var prosubTotal = childSnap.val().subTotal;
                      //console.log(protitle);
                      ordCard(protitle,procantName,proprice,prodesc,procust,proquant,prosubTotal,snap.key,childSnapshot.key,childSnap.key);
                      totalAmount = totalAmount + parseInt(prosubTotal);
                      document.getElementById('total').innerHTML = totalAmount;
                                              
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

  function ordCard(title,cantName,price,desc,cust,quant,subTotal,cantId,userId,ordId){
    var cardContainer = document.getElementById('mainCard_div');

    var cardElement = document.createElement('div');
    cardElement.classList.add('col-sm-6','col-12');

    var subCardElement = document.createElement('div');
    subCardElement.classList.add('row','cart-card');
    
    var titleElement = document.createElement('h5');
    titleElement.innerHTML = title.toString();

    var cantNameElement = document.createElement('h6');
    cantNameElement.innerHTML = cantName.toString();

    var dataElement = document.createElement('div');
    dataElement.className = "col-12";

    var priceParagraphElement = document.createElement('p');

    var priceText = document.createElement('strong');
    priceText.innerHTML = "Price: ";

    var rsh7Element = document.createElement('h7');
    rsh7Element.innerHTML = "₹";

    var priceValue = document.createElement('h7');
    priceValue.innerHTML = price.toString();

    var descParagraphElement = document.createElement('p');

    var descText = document.createElement('strong');
    descText.innerHTML = "Description: ";

    var descValue = document.createElement('h7');
    descValue.innerHTML = desc.toString();

    var custParagraphElement = document.createElement('p');

    var custText = document.createElement('strong');
    custText.innerHTML = "Customization: ";

    var custValue = document.createElement('textarea');
    custValue.innerHTML = cust.toString();
    custValue.id = ordId.toString();

    var submitContainer = document.createElement('div');
    submitContainer.classList.add('row','justify-content-center');

    var submitSubContainer = document.createElement('div');
    submitSubContainer.className = "col-12";

    var submitSubSubContainer = document.createElement('div');
    submitSubSubContainer.classList.add('row','m-0','justify-content-end');

    var submitButton = document.createElement('button');
    submitButton.classList.add('submit','bg-transparent');
    submitButton.innerHTML = "Submit-Customization";
    submitButton.setAttribute('onclick',('submitCustomization("'+cantId+'","'+userId+'","'+ordId+'")'));

    var btnContainer = document.createElement('div');
    btnContainer.classList.add('row','quantity-control-btn');

    var btnLeftElement = document.createElement('button');
    btnLeftElement.className = "left";
    btnLeftElement.innerHTML = "-";
    btnLeftElement.setAttribute('onclick',('decrement("'+cantId+'","'+userId+'","'+ordId+'")'));

    var quantityElement = document.createElement('p');
    quantityElement.innerHTML = quant.toString();

    var btnRightElement = document.createElement('button');
    btnRightElement.className = "right";
    btnRightElement.innerHTML = "+";
    btnRightElement.setAttribute('onclick',('increment("'+cantId+'","'+userId+'","'+ordId+'")'));
    
    var subTotalElement = document.createElement('h6');
    subTotalElement.innerHTML = "Sub-Total: ";

    var rsStrElement = document.createElement('strong');
    rsStrElement.innerHTML = "₹";
    
    var subTotalValue = document.createElement('strong');
    subTotalValue.innerHTML = subTotal.toString();

    cardContainer.appendChild(cardElement);
    cardElement.appendChild(subCardElement);
    subCardElement.append(
      titleElement,
      cantNameElement,
      dataElement
    );
    dataElement.append(
      priceParagraphElement,
      descParagraphElement,
      custParagraphElement,
      custValue,
      submitContainer,
      btnContainer
    );
    priceParagraphElement.append(
      priceText,
      rsh7Element,
      priceValue
    );
    descParagraphElement.append(
      descText,
      descValue
    );
    custParagraphElement.append(custText);
    submitContainer.appendChild(submitSubContainer);
    submitSubContainer.appendChild(submitSubSubContainer);
    submitSubSubContainer.appendChild(submitButton);






    btnContainer.append(
      btnLeftElement,
      quantityElement,
      btnRightElement,
      subTotalElement
    );
    subTotalElement.append(
      rsStrElement,
      subTotalValue
    );
  }

  //function for increment quantity inside the card
  function increment(cantId,userId,ordId){
    var quant;
    var price;
    var db = firebase.database().ref('TempOrder/' + cantId + "/" + userId + "/" + ordId);
    db.on('value', function(snapshot){
      quant = snapshot.val().quantity;
      price = snapshot.val().price;
    });
    quant++;
    db.update({
      quantity: quant,
      subTotal: (price*quant)
    });    
  }

  //function for decrement quantity inside the card
  function decrement(cantId,userId,ordId){
    var quant;
    var price;
    var db = firebase.database().ref('TempOrder/' + cantId + "/" + userId + "/" + ordId);
    db.on('value', function(snapshot){
      quant = snapshot.val().quantity;
      price = snapshot.val().price;
    });
    quant--;
    db.update({
      quantity: quant,
      subTotal: (price*quant)
    });
    if (quant == 0){
      db.remove();
    }
  }

  //CheckOut function...
  function checkOut(){
    var db = firebase.database();
    db.ref('TempOrder/').on('value', function(snapshot){
      //console.log(snapshot.key) == TempOrder
      snapshot.forEach(
        function(snap){
          //console.log(snap.key) == Canteen ID
          snap.forEach(
            function(childSnapshot){
              //console.log(childSnapshot.key) == Student ID
              if(childSnapshot.key == userdata.uid){
                //console.log('inside')
                childSnapshot.forEach(
                  function(childSnap){
                    //console.log("test"+ childSnap.key) == Order ID
                    db.ref('LiveOrder/' + snap.key + "/" + childSnapshot.key + "/" + childSnap.key).set({
                      username: childSnap.val().username,
                      productId: childSnap.val().productId,
                      title: childSnap.val().title,
                      canteenName: childSnap.val().canteenName,
                      price: childSnap.val().price,
                      quantity: childSnap.val().quantity,
                      subTotal: childSnap.val().subTotal,
                      description: childSnap.val().description,
                      customization: childSnap.val().customization,
                      status: childSnap.val().status,
                      imgUrl: childSnap.val().imgUrl
                    });
                    //after adding item to live order removing each card
                    db.ref('TempOrder/' + snap.key + "/" + childSnapshot.key + "/" + childSnap.key).remove();
                  }
                )
              }
            }
          )
        }
      )
                                                  
    });
    alert("Your Order has been placed...");
  }

  function submitCustomization(cantId,userId,orderId){
    var db = firebase.database().ref('TempOrder/' + cantId + "/" + userId + "/" + orderId);
    db.update({
      customization: (document.getElementById(orderId.toString()).value).toString()
    })
  }

  //Search function.......
  function search(){
    var searchValue = document.getElementById('searchValue').value.toLowerCase().trim();
    //alert(searchValue)
    var arr =[];
    var db = firebase.database();
    db.ref('Inventory/').on('value', function(snapshot){
      snapshot.forEach(
        function(childSnapshot){
          var catagory = childSnapshot.val().category.toString().toLowerCase().trim();
          var name = childSnapshot.val().name.toString().toLowerCase().trim();
          if(catagory == searchValue || name == searchValue){
            arr.push(childSnapshot);
          }
        }
      )
      if(arr[0] == null){
        console.log('null')
        document.getElementById('searchResult').innerHTML = "<h5 class=\"mt-2\">No result found!!!</h5>";
      }
      else{
        console.log('notnull');
        document.getElementById('searchResult').innerHTML = "";
        arr.forEach(
          function(childSnapshot){
            var canteenId = childSnapshot.val().canteenId;
            var category = childSnapshot.val().category;
            var desc = childSnapshot.val().desc;
            var imageUrl = childSnapshot.val().imageUrl;
            var name = childSnapshot.val().name;
            var price = childSnapshot.val().price;
            var productId = childSnapshot.key;
            
            db.ref('CanteenOwners/'+canteenId).on('value', function(snap){
              var cantName = snap.val().canteenName;
              searchCard(productId,imageUrl,name,cantName,price,userdata.uid);
            });
          }
        );
      }
      
      document.getElementById('searchOutput').style.visibility = "visible";
      document.getElementById('searchOutput').style.position = "relative";
    });
  }
  //closesearch section......
  function removeSearchResult(){
    document.getElementById('searchOutput').style.visibility = "hidden";
    document.getElementById('searchOutput').style.position = "absolute";
  }

  //SearchCard js
  function searchCard(proid,imgUrl,proName,cantName,proPrice,userId){
    //proId is for genrating order accordinf to product
    var mainDiv = document.getElementById('searchResult');

    var cardContainer = document.createElement('div');
    cardContainer.classList.add('col-sm-3','col-6');

    var cardElement = document.createElement('div');
    cardElement.classList.add('row','inventory-card');

    var foodImage =document.createElement('img');
    foodImage.classList.add('food-img','img-fluid');
    foodImage.alt = "food";
    foodImage.src = imgUrl.toString();

    var nameContainer = document.createElement('div');
    nameContainer.classList.add('col-12','p-0');
    
    var nameElement = document.createElement('h6');
    nameElement.className = "card-text-head";
    nameElement.innerHTML = proName.toString();

    var cantContainer = document.createElement('div');
    cantContainer.classList.add('col-12','p-0');

    var cantElement = document.createElement('p');
    cantElement.innerHTML = cantName.toString();

    var priceContainer = document.createElement('div');
    priceContainer.classList.add('col-12','p-0');

    var priceElement = document.createElement('p');
    priceElement.innerHTML = "Price: ₹";

    var priceVal = document.createElement('l');
    priceVal.innerHTML = proPrice.toString();

    var breakElement = document.createElement('br');

    var repeatContainer = document.createElement('div');
    repeatContainer.classList.add('col-12','p-0');

    var repeatElement = document.createElement('button');
    repeatElement.innerHTML = "<img class=\"img-fluid img-cart\" src=\"res/repeat.svg\"> Add To Cart";
    repeatElement.setAttribute('onclick',('fun("'+proid+'","'+userId+'")'));
    
    mainDiv.appendChild(cardContainer);
    cardContainer.appendChild(cardElement);
    cardElement.append(foodImage,nameContainer,cantContainer,priceContainer,repeatContainer);
    nameContainer.appendChild(nameElement);
    cantContainer.appendChild(cantElement);
    priceContainer.append(priceElement,breakElement);
    priceElement.appendChild(priceVal);
    repeatContainer.appendChild(repeatElement);
  }
  //add to cart function
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