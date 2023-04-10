let url = "/booking/timeslots/{{data._id}}/hfgf";



function updateTimeSlots(url) {
    console.log(url);
    let newTimeSlots;
    $.get(url, function (data, status) {
        newTimeSlots = data;
        alert("Data: " + data + "\nStatus: " + status);
    });

    // {
    //     
    //         const newTimeSlots = [
    //             { time: "09:00 am", booked: false },
    //             { time: "10:00 am", booked: true },
    //             { time: "11:00 am", booked: false },
    //             { time: "12:00 pm", booked: false },
    //         ];
    // 

    timeSlots.length = 0;
    Array.prototype.push.apply(timeSlots, newTimeSlots);

    // Clear existing time slots
    while (timeSlotContainer.firstChild) {
        timeSlotContainer.removeChild(timeSlotContainer.firstChild);
    }

    // Render new time slots
    timeSlots.forEach((slot, index) => {
        const timeSlot = document.createElement("div");
        timeSlot.classList.add("time-slot");

        if (slot.status = 'y') {
            timeSlot.classList.add("booked");
        } else {
            timeSlot.addEventListener("click", () => {
                const selectedSlot = document.querySelector(".selected");
                if (selectedSlot) {
                    selectedSlot.classList.remove("selected");
                }
                timeSlot.classList.add("selected");
            });
        }

        timeSlot.innerHTML = `<div>${slot.time}</div>`;

        if (index === 4) {
            timeSlot.style.clear = "both";
        }

        timeSlotContainer.appendChild(timeSlot);
    });
}




$("button").click(function () {
    $.get(url, function (data, status) {
        alert("Data: " + data + "\nStatus: " + status);
    });
});
function handleInputChange() {
    const input = document.getElementById("dateInput");
    alert("Input value: " + input.value);
    url = "/booking/timeslots/{{data._id}}/" + input.value;
    updateTimeSlots(url);
}

const timeSlots = [
    { time: "09:00 am", booked: false },
    { time: "10:00 am", booked: true },
    { time: "11:00 am", booked: false },
    { time: "12:00 pm", booked: false },
    { time: "01:00 pm", booked: false },
    { time: "02:00 pm", booked: true },
    { time: "03:00 pm", booked: false },
    { time: "04:00 pm", booked: false },
    { time: "05:00 pm", booked: false },
];

const timeSlotContainer = document.getElementById("time-slots");

timeSlots.forEach((slot, index) => {
    const timeSlot = document.createElement("div");
    timeSlot.classList.add("time-slot");

    if (slot.booked) {
        timeSlot.classList.add("booked");
    } else {
        timeSlot.addEventListener("click", () => {
            const selectedSlot = document.querySelector(".selected");
            if (selectedSlot) {
                selectedSlot.classList.remove("selected");
            }
            timeSlot.classList.add("selected");
        });
    }

    timeSlot.innerHTML = `<div>${slot.time}</div>`;

    if (index === 4) {
        timeSlot.style.clear = "both";
    }

    timeSlotContainer.appendChild(timeSlot);
});

function handleBooking() {
    const selectedSlot = document.querySelector(".selected");
    if (selectedSlot) {
        const time = selectedSlot.querySelector("div").textContent;
        alert(`You have booked the time slot: ${time}`);
        
    } else {
        alert("Please select a time slot.");
    }
}