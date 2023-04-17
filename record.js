
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getDatabase, ref, push, get, child, update, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { getFirestore, collection, getDoc, doc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js"

var displayName = null;
var email = null;
var emailVerified = null;
var photoURL = null;
var isAnonymous = null;
var uid = null;
var providerData = null;

var update_ecg = true;
var device = null;
var device_time = null;
var intervalId = null;
var device_state = false;

var ecg_values = [];





function set_listener() {
    const device_ref = ref(db, 'Devices/' + device + '/setting/get_new_ecg');
    onValue(device_ref, (snapshot) => {
        const data = snapshot.val();
        if (!data && update_ecg) {
            update_ecg = false;
            get_ecg(device);
        }
    })

    const device_online = ref(db, 'Devices/' + device + '/states/timestamp');
    onValue(device_online, (snapshot) => {
        device_time = snapshot.val();
        intervalId = window.setInterval(function () {
            update_status();
        }, 2000);

    })


}

function update_status() {
    if (Date.now() - device_time > 65000) {
        document.getElementById("top_txt").textContent = "DEVICE OFFLINE";
        document.getElementById("top_txt").style.color = "#a83232"
        device_state = false;
    } else {
        document.getElementById("top_txt").textContent = "DEVICE ONLINE";
        document.getElementById("top_txt").style.color = "#2ca321"
        device_state = true;
    }
}

function check_user() {
    var ref_chk = ref(db);

    get(child(ref_chk, `users/${uid}/devices`)).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            get(child(ref_chk, `users/${uid}/current_device`)).then((snapshot2) => {
                if (snapshot2.exists()) {
                    device = snapshot2.val();
                    Swal.fire({
                        title: 'Getting ECG Record',
                        text: 'It will take couple of seconds!',
                        showLoaderOn: true,
                        icon: 'info',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showConfirmButton: false
                    });
                    set_listener();
                } else {
                    ref_chk = ref(db, `users/${uid}`);
                    update(ref_chk, {
                        current_device: data.D1
                    }).then(() => {
                        device = data.D1
                        Swal.fire({
                            title: 'Getting ECG Record',
                            text: 'It will take couple of seconds!',
                            showLoaderOn: true,
                            icon: 'info',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showConfirmButton: false
                        });
                        set_listener();
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            }).catch((error) => {
                console.error(error);
            });
        } else {
            console.log("No data available");
            Swal.fire({
                title: 'No device linked',
                text: 'Link a device with your account to view ECG',
                icon: 'info',
                showConfirmButton: true,
                showCancelButton: true
            }).then(function (result) {
                if (result.isConfirmed)
                    change_window("profile.html");
            });
        }
    }).catch((error) => {
        console.error(error);
    });
}


function updateData() {

    Swal.fire({
        title: 'ECG Record Updated',
        text: 'Latest ECG records are beign displayed now',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000
    })

}


async function get_ecg(device) {


    const q = query(collection(ft, device));

    const querySnapshot = await getDocs(q);

    let container = document.getElementById("main-container");

    if(querySnapshot.empty){
        Swal.fire({
            title: 'No Record Found',
            text: 'Take Live ECG report now to see records history.',
            icon: 'info',
            showConfirmButton: true
        }).then(function (result) {
                change_window("ecg.html");
        });
        return;
    }

    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        
        container.insertAdjacentHTML("afterbegin", `<button onclick="change_window('dashboard.html?record=${doc.id}')" class="record-box">
        <span>${doc.id}</span>
    </button>`);
    });
    updateData();


}


function change_window(uri) {
    window.location.href = uri;
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
            change_window("login.html");
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

            check_user();




        } else {
            // User is signed out.
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

const ft = getFirestore(app);

initApp();
