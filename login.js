
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";


function sign_in() {
    document.getElementById('login_button').disabled = true;

    Swal.fire({
        title: 'Veifying Details',
        text: 'It will take couple of seconds!',
        showLoaderOn: true,
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });

    var email = document.getElementById('email_id').value;
    var password = document.getElementById('password').value;

    if (email.length < 4) {
        Swal.fire({
            position: 'top',
            title: 'Please Enter Your Email!',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
        });

        document.getElementById('login_button').disabled = false;
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
        document.getElementById('login_button').disabled = false;
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
        document.getElementById('login_button').disabled = false;
        return;
    }

    // Sign in with email and pass.
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            Swal.fire({
                title: 'Wrong Password',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
        else if (errorCode === 'auth/user-not-found') {
            Swal.fire({
                title: 'Email not Registered',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

        else if (errorCode === 'auth/invalid-email') {
            Swal.fire({
                title: 'Incorrect Email',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

        else {
            Swal.fire({
                title: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
        console.log(error);
        document.getElementById('login_button').disabled = false;
    });
}

function show_box() {
    Swal.fire({
        title: 'Enter Your Email \nㅤ',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Reset Password',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
            return sendPasswordResetEmail(auth, login).then(() => {
                // Password Reset Email Sent!
                return (login);
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/invalid-email') {
                    Swal.showValidationMessage(
                        `Invalid Email`
                    )
                } else if (errorCode === 'auth/user-not-found') {
                    Swal.showValidationMessage(
                        `Email not found`
                    )
                }
                else if (errorCode === 'auth/missing-email') {
                    Swal.showValidationMessage(
                        `Please Enter Email`
                    )
                }
                console.log(error);
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            if (result.value.length < 4) {
                Swal.showValidationMessage(
                    `Please Enter Your Email!`
                )

                show_box();

                return;
            }
            Swal.fire({
                title: 'Email sent',
                text: `An email with password reset link is sent to ${result.value}.`,
                icon: 'success',
                showConfirmButton: true
            })
        }
    });
}


function initApp() {


    onAuthStateChanged(auth, (user) => {

        if (user) {
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

        document.getElementById('login_button').disabled = false;
    });


    document.getElementById('login_button').addEventListener('click', sign_in, false);
    document.getElementById('l_2').addEventListener('click', show_box, false);
}




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

