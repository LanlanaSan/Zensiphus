

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getDatabase, ref, push, get, child, update, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { getFirestore, collection, getDoc, doc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js"

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

var pending_task = false;
var first_run = false;

var ecg_values = [];


const plugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
        const { ctx } = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = options.color || '#000000';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
};

const ctx = document.getElementById('myChart');

var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        datasets: [{
            label: 'ECG Pulses',
            // data: [537, 523, 557, 544, 576, 554, 587, 572, 601, 578, 609, 582, 602, 567, 575, 539, 556, 531, 550, 525, 554, 528, 553, 527, 553, 529, 556, 527, 552, 527, 551, 524, 553, 523, 558, 530, 552, 526, 555, 529, 554, 536, 570, 556, 573, 589, 591, 557, 553, 525, 552, 530, 550, 527, 475, 472, 752, 1091, 840, 462, 592, 510, 523, 497, 526, 505, 529, 506, 539, 520, 546, 531, 559, 539, 567, 552, 579, 557, 581, 570, 592, 581, 599, 565, 577, 548, 555, 539, 558, 540, 554, 538, 564, 543, 567, 543, 564, 541, 566, 541, 560, 544, 562, 537, 561, 544, 563, 548, 563, 549, 579, 555, 602, 597, 588, 556, 553, 538, 551, 539, 552, 518, 445, 570, 969, 1084, 576, 546, 559, 510, 524, 511, 525, 517, 532, 526, 550, 532, 551, 541, 558, 554, 571, 561, 584, 569, 593, 578, 600, 584, 592, 563, 569, 549, 557, 537, 553, 541, 551, 537, 555, 535, 555, 540, 554, 537, 551, 533, 549, 536, 546, 534, 549, 533, 556, 533, 556, 553, 559, 591, 577, 555, 543, 529, 537, 534, 542, 530, 489, 444, 667, 1075, 909, 460, 586, 515, 515, 507, 514, 512, 517, 519, 529, 528, 539, 542, 559, 558, 577, 573, 585, 588, 586, 595, 590, 593, 578, 571, 555, 544, 539, 534, 533, 535, 533, 539, 535, 536, 536, 542, 536, 540, 533, 533, 533, 537, 535, 534, 531, 539, 538, 555, 540, 571, 578, 571, 543, 530, 522, 535, 518, 532, 514, 436, 524, 872, 1085, 590, 518, 548, 498, 510, 498, 515, 502, 530, 515, 539, 525, 545, 532, 557, 549, 570, 554, 584, 567, 591, 578, 601, 578, 582, 554, 556, 534, 549, 532, 545, 534, 547, 532, 553, 535, 551, 537, 554, 536, 558, 533, 558, 531, 554, 529, 557, 527, 554, 531, 559, 532, 576, 545, 584, 591, 583, 546, 548, 523, 549, 530, 548, 512, 444, 543, 919, 1087, 598, 520, 564, 496, 521, 491, 525, 499, 530, 512, 538, 520, 547, 526, 561, 543, 564, 555, 575, 568, 584, 576, 596, 582, 587, 554, 566, 537, 549, 531, 550, 536, 558, 532, 559, 536, 561, 542, 559, 541, 557, 534, 552, 537, 555, 535, 553, 537, 555, 537, 554, 535, 554, 541, 552, 544, 556, 546, 573, 552, 598, 583, 575, 544, 545, 539, 545, 535, 551, 496, 458, 657, 1092, 974, 461, 585, 530, 508, 511, 506, 521, 516, 525, 528, 533, 540, 545, 546, 555, 550, 566, 564, 574, 578, 577, 592, 588, 587, 575, 568, 557, 547, 546, 546, 545, 548, 546, 547, 550, 553, 554, 553, 548, 554, 545, 551, 546, 548, 544, 549, 547, 545, 538, 559, 540, 556, 544, 559, 549, 565, 549, 556, 552, 561, 553, 564, 554, 566, 558, 577, 573, 580, 604, 605, 574, 566, 550, 568, 550, 569, 549, 492, 492, 793, 1093, 922, 461, 614, 520, 531, 517, 531, 519, 537, 526, 545, 530, 550, 540, 558, 543, 567, 558, 575, 563, 589, 574, 601, 583, 601, 567, 585, 544, 559, 536, 554, 535, 554, 534, 556, 533, 555, 539, 555, 534, 556, 533, 555, 529, 555, 525, 553, 530, 556, 527, 553, 532, 555, 529, 556, 529, 553, 533, 555, 534, 572, 548, 580, 592, 591, 551, 544, 529, 546, 527, 547, 522, 463, 509, 843, 1091, 731, 478, 576, 494, 513, 495, 518, 497, 526, 507, 531, 516, 542, 520, 549, 537, 559, 545, 572, 557, 577, 565, 585, 572, 580, 552, 555, 540, 539, 526, 536, 525, 535, 521, 544, 530, 545, 531, 549, 534, 547, 531, 546, 530, 541, 540, 542, 537, 542, 531, 544, 533, 545, 536, 546, 533, 547, 538, 546, 538, 552, 554, 565, 557, 607, 575, 567, 540, 535, 542, 539, 544, 535, 448, 520, 844, 1092, 751, 487, 578, 518, 511, 514, 515, 515, 519, 524, 527, 538, 534, 544, 542, 549, 563, 561, 571, 571, 584, 577, 594, 581, 587, 566, 563, 542, 548, 534, 547, 535, 545, 536, 549, 540, 548, 537, 550, 539, 552, 539, 555, 537, 546, 532, 548, 532, 546, 532, 544, 535, 550, 528, 547, 534, 547, 530, 553, 527, 548, 535, 564, 550, 563, 585, 591, 550, 551, 522, 541, 528, 553, 531, 495, 467, 737, 1093, 957, 447, 593, 507, 517, 490, 516, 490, 522, 497, 524, 509, 530, 516, 542, 530, 551, 534, 569, 549, 580, 558, 589, 573, 586, 552, 563, 529, 545, 523, 541, 519, 542, 516, 548, 526, 549, 525, 553, 531, 555, 528, 547, 525, 546, 522, 544, 524, 547, 523, 546, 525, 548, 523, 545, 531, 551, 535, 547, 528, 553, 530, 556, 533, 556, 554, 569, 555, 611, 579, 574, 537, 546, 535, 548, 539, 555, 463, 503, 755, 1093, 910, 470, 583, 534, 508, 524, 512, 528, 520, 536, 529, 548, 537, 554, 550, 569, 556, 570, 567, 587, 576, 588, 586, 603, 590, 585, 566, 561, 546, 546, 540, 544, 536, 547, 544, 553, 548, 552, 550, 547, 548, 550, 547, 544, 549, 546, 544, 549, 546, 541, 540, 542, 537, 540, 540, 541, 539, 541, 541, 536, 539, 538, 538, 542, 549, 556, 555, 577, 591, 560, 546, 528, 528, 526, 540, 529, 505, 436, 642, 1056, 1016, 441, 571, 512, 515, 493, 513, 501, 522, 510, 528, 511, 537, 522, 542, 537, 555, 547, 568, 562, 582, 572, 588, 575, 590, 563, 566, 532, 545, 522, 539, 521, 536, 526, 544, 527, 550, 532, 552, 529, 555, 535, 550, 533, 554, 531, 547, 536, 552, 531, 555, 531, 556, 535, 554, 539, 568, 551, 573, 589, 596, 556, 554, 519, 550, 519, 551, 526, 495, 463, 736, 1091, 897, 433, 593, 500, 525, 504, 526, 509, 535, 513, 547, 521, 552, 528, 562, 544, 573, 562, 590, 568, 599, 576, 603, 584, 593, 562, 567, 534, 554, 527, 547, 527, 544, 527, 548, 533, 551, 535, 558, 537, 550, 537, 552, 530, 549, 530, 553, 535, 546, 537, 546, 535, 549, 534, 547],
            borderWidth: 1,
            snapGaps: 1,
            borderColor: "#6621fc"

        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    display: false,
                    stepSize: 1,
                    maxTicksLimit: 10,
                },
                grid: {
                    lineWidth: 0.3,
                    color: "#000000"
                }
            },
            x: {
                // beginAtZero: true,
                ticks: {
                    display: false,
                    stepSize: 10,
                    maxTicksLimit: 50,
                },
                grid: {
                    lineWidth: 0.3,
                    color: "#000000"
                }
            },

        },
        aspectRatio: 1 | 4,
        pointRadius: 0,
        animation: {
            onComplete: function () {
                // alert("Hello");
                var a = document.createElement('a');
                a.href = chart.toBase64Image('image/jpeg', 1);
                a.download = 'my_file_name.jpg';

                // Trigger the download
                // a.click();
            },
        },
        plugins: {
            customCanvasBackgroundColor: {
                color: 'whitesmoke',
            }
        }

    },
    plugins: [plugin],
});


function set_listener() {
    const device_online = ref(db, 'Devices/' + device + '/states/timestamp');
    onValue(device_online, (snapshot) => {
        device_time = snapshot.val();
        update_status();
        intervalId = window.setInterval(function () {
            update_status();
        }, 2000);

    })


    const device_ref = ref(db, 'Devices/' + device + '/setting/get_new_ecg');
    onValue(device_ref, (snapshot) => {
        const data = snapshot.val();
        if (!data && update_ecg && first_run && device_state) {
            update_ecg = false;
            get_ecg(device);
        } else {
            pending_task = true;
        }
    })


}

function update_status() {
    if (Date.now() - device_time > 120000) {
        document.getElementById("top_txt").textContent = "DEVICE OFFLINE";
        document.getElementById("top_txt").style.color = "#a83232"
        device_state = false;
    } else {
        document.getElementById("top_txt").textContent = "LIVE ECG";
        document.getElementById("top_txt").style.color = "#2ca321"
        device_state = true;
    }

    if (device_state && pending_task) {
        update_ecg = false;
        get_ecg(device);
        pending_task = false;
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
                        title: 'Getting ECG Report',
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
                            title: 'Getting ECG Report',
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

function check_ecg() {

    if (!device_state) {
        Swal.fire({
            title: 'DEVICE OFFLINE',
            text: 'Make sure ECG device is running and connected to internet. If problem presists try restarting device.',
            icon: 'error',
            showConfirmButton: true
        });
        return;
    }

    const ref_chk = ref(db, `users/${uid}`);

    get(child(ref_chk, `devices`)).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();

            get(child(ref_chk, `current_device`)).then((snapshot2) => {
                if (snapshot2.exists()) {
                    device = snapshot2.val();

                    const device_ref = ref(db, 'Devices/' + device + '/setting');
                    update(device_ref, {
                        get_new_ecg: true
                    }).then(() => {
                        update_ecg = true;
                        Swal.fire({
                            title: 'Getting New ECG',
                            text: 'It will take upto 1 minute!',
                            showLoaderOn: true,
                            icon: 'info',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showConfirmButton: false
                        });

                    }).catch((error) => {
                        console.error(error);
                    });


                } else {
                    update(ref_chk, {
                        current_device: data.D1
                    }).then(() => {

                        device = data.D1
                        const device_ref = ref(db, 'Devices/' + device + '/setting');
                        update(device_ref, {
                            get_new_ecg: true
                        }).then(() => {
                            update_ecg = true;
                            Swal.fire({
                                title: 'Getting New ECG',
                                text: 'It will take upto 1 minute!',
                                showLoaderOn: true,
                                icon: 'info',
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                showConfirmButton: false
                            });

                        }).catch((error) => {
                            console.error(error);
                        });

                    }).catch((error) => {
                        console.error(error);
                    });
                }
            }).catch((error) => {
                console.error(error);
            });


        } else {
            console.log("No data available");
            alert(uid)
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

function updateData(chart) {

    chart.data.datasets.forEach((dataset) => {
        dataset.data = ecg_values;
    });
    chart.update();

    Swal.fire({
        title: 'ECG Updated',
        text: 'Latest ECG report is beign displayed now',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000
    })
}


async function get_ecg(device) {

    const date = new Date();

    let currentDay = String(date.getDate()).padStart(2, '0');

    let currentMonth = String(date.getMonth() + 1);

    let currentYear = date.getFullYear();

    // we will display the date as DD-MM-YYYY 

    let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

    const docRef = doc(ft, device, currentDate);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        ecg_values = [];
        ecg_values = ecg_values.concat(docSnap.data().pulses_1);
        ecg_values = ecg_values.concat(docSnap.data().pulses_2);
        ecg_values = ecg_values.concat(docSnap.data().pulses_3);
        ecg_values = ecg_values.concat(docSnap.data().pulses_4);
        console.log("ECG VALUES: ", ecg_values);
        updateData(chart);
    } else {
        // docSnap.data() will be undefined in this case
        check_ecg();
        console.log("No such document!");
    }

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
            document.getElementById('btn_chkecg').addEventListener('click', check_ecg, false);

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
