
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

var displayName = null;
var email = null;
var emailVerified = null;
var photoURL = null;
var isAnonymous = null;
var uid = null;
var providerData = null;


function change_window(){
    window.location.replace("login.html");
}

function sign_out(){

    signOut(auth).then(() => {
        // Sign-out successful.
        Swal.fire({
            title: 'Logged Out',
            text: 'Redirecting...',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000
        }).then(function (result) {
            change_window();
        });

      }).catch((error) => {
        Swal.fire({
            position: 'top',
            title: error.message,
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
        });
      });
}



function initApp() {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in.
            document.getElementById('signout_btn').textContent = "Sign Out"

            document.getElementById('signout_btn').addEventListener('click', sign_out, false);
        
            displayName = user.displayName;
            email = user.email;
            emailVerified = user.emailVerified;
            photoURL = user.photoURL;
            isAnonymous = user.isAnonymous;
            uid = user.uid;
            providerData = user.providerData;
            try {
                document.getElementById('welcome_txt').textContent = "Welcome, "+displayName;
            } catch (error) {
                console.log(error);
            }
            


        } else {
            // User is signed out.
            document.getElementById('signout_btn').textContent = "Log In";
            document.getElementById('signout_btn').addEventListener('click', change_window, false);
            try {
                document.getElementById('welcome_txt').textContent = "Welcome, New User";
            } catch (error) {
                console.log(error);
            }
            
        }
    
    });

}

// window.onload = function () {
//   initApp();
// };

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAU4Ymz8-t3xBiVPKFUrjf18qTJoKgbuz0",
    authDomain: "smart-ecg-monitor-a210c.firebaseapp.com",
    databaseURL: "https://smart-ecg-monitor-a210c-default-rtdb.firebaseio.com",
    projectId: "smart-ecg-monitor-a210c",
    storageBucket: "smart-ecg-monitor-a210c.appspot.com",
    messagingSenderId: "912253533909",
    appId: "1:912253533909:web:6bd8f6acefac421276ec5c",
    measurementId: "G-Q0SWSDTLN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

initApp();
