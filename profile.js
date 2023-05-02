
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getAuth, signOut, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getDatabase, ref, push, get, child, update, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";


var displayName = null;
var email = null;
var emailVerified = null;
var photoURL = null;
var isAnonymous = null;
var uid = null;
var providerData = null;
var dob = null;
var f_name = null;
var dob_server = null;

var user_g = null;

var nothing = false;

var device = null;

function check_user() {
    var ref_chk = ref(db);

    get(child(ref_chk, `users/${uid}/dob`)).then((snapshot) => {
        if (snapshot.exists()) {

            dob_server = snapshot.val();

            document.getElementById("dob").value = dob_server;


        } else {
            console.log("No data available");
            Swal.fire({
                title: 'Add date of birth now',
                text: 'Your date of birth is missing',
                icon: 'info',
                showConfirmButton: true,
            });
        }
    }).catch((error) => {
        console.error(error);
    });

    get(child(ref_chk, `users/${uid}/devices`)).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            get(child(ref_chk, `users/${uid}/current_device`)).then((snapshot2) => {
                if (snapshot2.exists()) {
                    device = snapshot2.val();
                    document.getElementById("device_mac").value = device;

                } else {
                    ref_chk = ref(db, `users/${uid}`);
                    update(ref_chk, {
                        current_device: data.D1
                    }).then(() => {
                        device = data.D1
                        document.getElementById("device_mac").value = device;
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            }).catch((error) => {
                console.error(error);
            });
        } else {

            Swal.fire({
                title: 'No device linked',
                text: 'Link a device with your account',
                icon: 'info',
                showConfirmButton: true
            }).then(function (result) {
                document.getElementById("device_mac").disabled = false;
            });
        }
    }).catch((error) => {
        console.error(error);
    });
}


function save() {
    f_name = document.getElementById("f_name").value;
    dob = document.getElementById("dob").value;

    if (f_name == "") {
        Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Enter Your Full Name',
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

    nothing = true;
    if (f_name != displayName) {
        updateProfile(user_g, {
            displayName: f_name,
        }).then(() => {
            // Profile updated!
            // ...

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
        nothing = false;
    }

    if (dob != dob_server) {
        const ref_chk = ref(db);
        update(child(ref_chk, `users/${uid}`), {
            dob: dob
        }).then(() => {

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
        nothing = false;
    }

    if (!nothing) {

        Swal.fire({
            title: 'Profile Updated Successfully',
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
    } else {
        Swal.fire({
            title: 'Nothing to Update',
            text: 'There are no changes made to profile',
            icon: 'info',
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

function link_device() {

    if (document.getElementById("device_mac").disabled == true) {
        document.getElementById("device_mac").disabled = false;
        document.getElementById("device_mac").maxlength = '17';
        return;
    }

    var new_mac = document.getElementById("device_mac").value;

    if (new_mac.length < 17) {
        Swal.fire({
            title: 'Incorrect Mac Address',
            text: 'Please enter a valid MAC address. (Example: AA:B2:C4:FG:DD:22)',
            icon: 'error',
            showConfirmButton: true,
        });
        return;
    }

    if (new_mac != device) {

        var ref_chk = ref(db);
        var set = true;

        get(child(ref_chk, `Devices/${new_mac}/initialized`)).then((snapshot) => {
            if (snapshot.exists()) {

                var init = snapshot.val();

                if (true) {

                    ref_chk = ref(db, `users/${uid}/devices`);
                    update(ref_chk, {
                        D1: new_mac
                    }).then(() => {
                        ref_chk = ref(db, `users/${uid}`);
                        update(ref_chk, {
                            current_device: new_mac
                        }).then(() => {
                            ref_chk = ref(db, `Devices/${new_mac}`);

                            update(ref_chk, {
                                initialized: set
                            }).then(() => {
                                device = new_mac
                                document.getElementById("device_mac").value = device;
                                document.getElementById("device_mac").disabled = true;
                                Swal.fire({
                                    title: 'Device Linked Successfully',
                                    text: 'New device connected to your account',
                                    icon: 'success',
                                    showConfirmButton: false,
                                    timer: 2000
                                })

                            }).catch((error) => {
                                console.error(error);
                            });

                        }).catch((error) => {
                            console.error(error);
                        });
                    }).catch((error) => {
                        console.error(error);
                    });


                } else {
                    Swal.fire({
                        title: 'Device Already Linked',
                        text: 'Device you are trying to connect is already linked to another account. If this seems to be a mistake then contact support.',
                        icon: 'error',
                        showConfirmButton: true,
                    });
                }


            } else {
                console.log("No data available");
                Swal.fire({
                    title: 'Device not found',
                    text: 'Please make sure you entered correct MAC address and device is connected to internet.',
                    icon: 'error',
                    showConfirmButton: true,
                });
            }
        }).catch((error) => {
            console.error(error);
        });

    } else {
        Swal.fire({
            title: 'Device Already Linked to your Account',
            text: 'There are no changes made to profile',
            icon: 'info',
            showConfirmButton: false,
            timer: 2000
        })
    }


}


function change_window() {
    window.location.replace("login.html");
}

function sign_out() {

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
            user_g = user;
            document.getElementById('signout_btn').textContent = "Sign Out"

            document.getElementById('signout_btn').addEventListener('click', sign_out, false);

            document.getElementById('link_btn').addEventListener('click', link_device, false);
            document.getElementById('save_btn').addEventListener('click', save, false);

            displayName = user.displayName;
            email = user.email;
            emailVerified = user.emailVerified;
            photoURL = user.photoURL;
            isAnonymous = user.isAnonymous;
            uid = user.uid;
            providerData = user.providerData;
            try {
                document.getElementById('f_name').value = displayName;
                check_user();
            } catch (error) {
                console.log(error);
            }



        } else {
            document.getElementById('signout_btn').textContent = "Log In";
            Swal.fire({
                title: 'Login to continue',
                text: 'You will be redirected to login page',
                icon: 'info',
                showConfirmButton: true
            }).then(function (result) {
                change_window("login.html");
            });

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

const db = getDatabase(app)

initApp();
