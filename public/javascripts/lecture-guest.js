const likeQuestion = (question_id) => {
    $.ajax({
        url: "like/" + question_id,
        type: "POST",
        data: {
            question_id: parseInt(question_id),
        },
        success: function (result) {
            alert('Question liked!');
            $(`.question_likes_${result.id}`).innerText = result.num_of_likes;
        },
        error: function () {
            alert("Question is not liked!");
        },
    });
}

const rateLecture = (lecture_id) => {
    const rate = document.getElementById('mark').value;
    $.ajax({
        url: "rate/" + lecture_id,
        type: "POST",
        data: {
            lecture_id: parseInt(lecture_id),
            rate: rate,
        },
        success: function (result) {
            alert('Lecture rated!');
        },
        error: function () {
            alert('Lecture is not rated!');
        },
    });
};

document.getElementById("btn-add-new-question").onclick = function () {
    location.href = "/question";
};