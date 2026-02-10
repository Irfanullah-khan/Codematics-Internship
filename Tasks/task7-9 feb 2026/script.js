// Task 1 Age Calculator 
document.getElementById("dob").addEventListener("change", () => {
    let dob = new Date(document.getElementById("dob").value);
    let today = new Date();
    let diff = today - dob;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById("ageResult").innerText = "Age in days: " + days;
});

// Task 2 Hours to Seconds 
document.getElementById("hrs").addEventListener("input", () => {
    let hrs = document.getElementById("hrs").value;
    document.getElementById("hrsResult").innerText = hrs + " hours = " + hrs * 3600 + " seconds";
});


// Task 3 Next Number 
function findNextInArray() {
    let arr = [10, 20, 30, 40, 50];
    let num = Number(document.getElementById("arrayNum").value);
    let index = arr.indexOf(num);
    document.getElementById("nextResult").innerText =
        index == -1 ? "Not found" : arr[index + 1];
}

function findNextSingle() {
    let val = Number(document.getElementById("singleNum").value);
    document.getElementById("nextResult").innerText = val + 1;
}

// Task 4 Name Capitalizer
document.getElementById("nameInput").addEventListener("input", () => {
    let name = document.getElementById("nameInput").value;
    document.getElementById("nameResult").innerText =
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
});

// Task 5 BMI

function calculateBMI() {
    let w = document.getElementById("weight").value;
    let h = document.getElementById("height").value;
    let bmi = (w / (h * h)).toFixed(2);

    let category = "";

    if (bmi < 18.5) {
        category = "Underweight";
    }
    else if (bmi >= 18.5 && bmi < 25) {
        category = "Normal weight";
    }
    else if (bmi >= 25 && bmi < 30) {
        category = "Overweight";
    }
    else {
        category = "Obese";
    }

    document.getElementById("bmiResult").innerText = "Your BMI is: " + bmi + " (" + category + ")";
}

// Task 6 Random Array 
document.getElementById("generateArray").addEventListener("click", () => {
    let arr = [];
    for (let i = 0; i < 7; i++){
      arr.push(Math.floor(Math.random() * 100));
    }
    document.getElementById("arrayOutput").innerText = "Array : " + arr;
    document.getElementById("firstElement").innerText = "First element : " + arr[0];
    document.getElementById("lastElement").innerText = "Last element : " + arr[arr.length - 1];
});

// Task 7 Add Two Numbers 
function calcSum() {
    let n1 = document.getElementById("num1").value;
    let n2 = document.getElementById("num2").value;
    document.getElementById("sumResult").value =
        n2 == "" ? "NaN" : Number(n1) + Number(n2);
}
document.getElementById("num1").addEventListener("input", calcSum);
document.getElementById("num2").addEventListener("input", calcSum);
