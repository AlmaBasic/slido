// Lecture
document.getElementById("btn-add-lecture").onclick = function () {
    location.href = "/users/lecture";
};

const deleteLecture = (lecture_id) => {
    $.ajax({
        url: "users/lecture/delete/" + lecture_id,
        type: "PATCH",
        data: {
            lecture_id: parseInt(lecture_id),
        },
        success: function (result) {
            alert(result);

            $(`.lecture_row_${lecture_id}`).remove();
        },
        error: function () {
            alert("Lecture is not deleted!");
        },
    });
};

const moreLecture = (lecture_id) => {
    $.ajax({
        url: "users/lecture/" + lecture_id,
        type: "GET",
        data: {},
        success: function (result) {
            location.href = "/users/lecture/" + lecture_id;
        },
        error: function () {
            alert("Lecture is not available!");
        },
    });
}

const shareCode = (lecture_id) => {
    $.ajax({
        url: "users/code/" + lecture_id,
        type: "GET",
        data: {},
        success: function (result) {
            console.info(result);
            location.href = "users/code/" + lecture_id;
        },
        error: function () {
            alert("Code is not available!");
        },
    });
}

// Illegal word
document.getElementById("btn-add-word").onclick = function () {
    location.href = "/users/word";
};

const editWord = (word_id) => {
    let word = document.getElementById("word"+ word_id).value;
    console.log(word)
    $.ajax({
        url: "users/word/edit/"+ word_id,
        type: "PUT",
        data: {
            word_id: parseInt(word_id),
            word: word,
        },
        success: function (result) {
            alert(result);
        },
        error: function () {
            alert("Illegal word is not updated!");
        },
    });
};

const deleteWord = (word_id) => {
    alert(word_id)
    $.ajax({
        url: "users/word/delete/" + word_id,
        type: "PATCH",
        data: {
            word_id: parseInt(word_id),
        },
        success: function (result) {
            alert(result);

            $(`.word_row_${word_id}`).remove();
        },
        error: function () {
            alert("Illegal word is not deleted!");
        },
    });
};
