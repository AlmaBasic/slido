// Add new user
document.getElementById("btn-add-user").onclick = function () {
    location.href = "/users/registration";
};

// Update user data
const editUser = (person_id, role) => {
    let first_name = document.getElementById("first_name"+ person_id).value;
    let last_name = document.getElementById("last_name"+ person_id).value;
    let username = document.getElementById("username" + person_id).value;
    let email = document.getElementById("email" + person_id).value;
    let phone = document.getElementById("phone" + person_id).value;

    if(role === "admin") {
        $.ajax({
            url: "admin/user/edit/" + person_id,
            type: "PUT",
            data: {
                person_id: parseInt(person_id),
                role: role.trim(),
                first_name: first_name,
                last_name: last_name,
                username: username,
                email: email,
                phone: phone,
            },
            success: function (result) {
                alert(result);
            },
            error: function () {
                alert("User is not updated!");
            },
        });
    }
    else{
        alert("You don't have permission to edit!");
    }
};

// Delete user
const deleteUser = (person_id, role) => {
    $.ajax({
        url: "admin/user/delete/" + person_id,
        type: "PATCH",
        data: {
            person_id: parseInt(person_id),
            role: role.trim(),
        },
        success: function (result) {
            alert(result);
        },
        error: function () {
            alert("User is not deleted!");
        },
    });
};

// Block user
const blockUser = (person_id, role) => {
    let days = document.getElementById("b_days" + person_id).value;

    if (days.trim().length === 0) {
        alert("Enter the date.");
        return;
    }

    $.ajax({
        url: "admin/user/block/" + person_id,
        type: "PATCH",
        data: {
            person_id: parseInt(person_id),
            role: role.trim(),
            blocked_until: days,
        },
        success: function (result) {
            alert(result);
            $(`.user_row_${person_id}`).remove();
        },
        error: function () {
            alert("User is not blocked!");
        },
    });
};

// Lecture
const editLectureAdmin = (lecture_id) => {
    let name = document.getElementById("lecture_name"+ lecture_id).value;
    let start_time = document.getElementById("start_time"+ lecture_id).value;
    let end_time = document.getElementById("end_time"+ lecture_id).value;
    let repeat_rule = document.getElementById("repeat_rule"+ lecture_id).value;

    $.ajax({
        url: "users/lecture/edit/" + lecture_id,
        type: "PUT",
        data: {
            lecture_id: parseInt(lecture_id),
            name: name,
            start_time: start_time,
            end_time: end_time,
            repeat_rule: repeat_rule
        },
        success: function (result) {
            alert(result);
        },
        error: function () {
            alert("Lecture is not updated!");
        },
    });
};