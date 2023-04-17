import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, updateProfile } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getDatabase, ref, push, get, child, update, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";


var displayName = null;
var email = null;

var f_name = null;
var l_name = null;
var dob = null;
var password = null;
var conf_password = null;


function check_details() {

    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    f_name = document.getElementById("f_name").value;
    l_name = document.getElementById("l_name").value;
    dob = document.getElementById("dob").value;
    email = document.getElementById("email_id").value;
    password = document.getElementById("password").value;
    conf_password = document.getElementById("conf_password").value;

    if (f_name == "") {
        Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Enter Your Name',
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }
    if (l_name == "") {
        Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Enter Your Last Name',
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }
    if (dob == "") {
        Swal.fire({
            position: 'top',
            icon: 'info',
            title: 'What is your Date of Birth?',
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }
    if (email == "") {
        Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Enter Your Email',
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }

    if (!validateEmail(email)) {
        Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Incorrect Email',
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }


    if (password == "") {
        Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Enter Your Password',
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }

    if (password.length < 8) {
        Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Password must contain atleast 8 digits',
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }
    if (conf_password == "") {
        Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Confirm Your Password',
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }

    if (password != conf_password) {
        Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Password do not match!',
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }

    check();





}


function check() {

    Swal.fire({
        title: 'Veifying Details',
        text: 'It will take couple of seconds!',
        showLoaderOn: true,
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });

    document.getElementById('signup_button').disabled = true;

    if (email.length < 4) {
        Swal.fire({
            position: 'top',
            title: 'Please Enter Your Email!',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
        });

        document.getElementById('signup_button').disabled = false;
        return;
    }

    signInWithEmailAndPassword(auth, email, "catch").catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;

        if (errorCode === 'auth/invalid-email') {
            Swal.fire({
                title: 'Incorrect Email',
                icon: 'error',
                confirmButtonText: 'OK'
            });

            document.getElementById('signup_button').disabled = false;

            return;
        }

        if (!(errorCode === 'auth/user-not-found')) {
            Swal.fire({
                title: 'Account already exists',
                position: 'top',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
            });

            document.getElementById('signup_button').disabled = false;
            return;
        }

        if (password.length == 0) {
            Swal.fire({
                position: 'top',
                title: 'Please Enter Password!',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
            });
            document.getElementById('signup_button').disabled = false;
            return;
        }

        if (password.length < 8) {
            Swal.fire({
                position: 'top',
                title: 'Password must be 8 digits!',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
            });
            document.getElementById('signup_button').disabled = false;
            return;
        }

        if (password != conf_password) {
            Swal.fire({
                position: 'top',
                title: 'Password do not match!',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
            });

            document.getElementById('signup_button').disabled = false;
            return;

        }


        create_account();

    });


}

function create_account() {
    var password = document.getElementById('password').value;

    // Create user with email and pass.
    createUserWithEmailAndPassword(auth, email, password).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            Swal.fire({
                position: 'top',
                title: 'Password too weak!',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
}


function initApp() {


    onAuthStateChanged(auth, (user) => {

        if (user) {

            if (f_name != null && l_name != null) {

                displayName = f_name + " " + l_name;

                updateProfile(user, {
                    displayName: displayName,
                }).then(() => {
                    // Profile updated!
                    // ...
                    const ref_chk = ref(db);
                    update(child(ref_chk, `users/${user.uid}`), {
                        dob: dob
                    }).then(() => {
                        Swal.fire({
                            title: 'Account Regsitered Successfully',
                            text: 'Redirecting...',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2000
                        }).then(function (result) {
                            try {
                                const redirect = params.get('redirect');
    
                                if (redirect != null) {
                                    window.location.replace(redirect);
                                } else {
                                    window.location.replace("index.html");
                                }
                            }
                            catch (e) {
                                console.log(e);
                                window.location.replace("index.html");
                            }
                        });
                    }).catch((error) => {
                        Swal.fire({
                            position: 'top',
                            title: error.message,
                            icon: 'error',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        return;
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
            } else {
                Swal.fire({
                    title: 'Successfully Logged In',
                    text: 'Redirecting...',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000
                }).then(function (result) {
                    try {
                        const redirect = params.get('redirect');

                        if (redirect != null) {
                            window.location.replace(redirect);
                        } else {
                            window.location.replace("index.html");
                        }
                    }
                    catch (e) {
                        console.log(e);
                        window.location.replace("index.html");
                    }
                });
            }

        }

        document.getElementById('signup_button').disabled = false;
    });


    document.getElementById('signup_button').addEventListener('click', check_details, false);
}




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
const db = getDatabase(app)

initApp();