// Question
document.getElementById("btn-add-question").onclick = function () {
    location.href = "/question";
};

const editQuestion = (question_id) => {
    let text = document.getElementById("question_text"+ question_id).value;

    $.ajax({
        url: "question/edit/"+ question_id,
        type: "PUT",
        data: {
            question_id: parseInt(question_id),
            text: text,
        },
        success: function (result) {
            alert(result);
        },
        error: function () {
            alert("Question is not updated!");
        },
    });
};

const deleteQuestion = (question_id) => {
    $.ajax({
        url: "question/delete/" + question_id,
        type: "PATCH",
        data: {
            question_id: parseInt(question_id),
        },
        success: function (result) {
            alert(result);

            $(`.question_row_${question_id}`).remove();
        },
        error: function () {
            alert("Question is not deleted!");
        },
    });
};

const answerQuestion = (question_id) => {
    $.ajax({
        url: "question/answer/" + question_id,
        type: "PATCH",
        data: {
            question_id: parseInt(question_id),
        },
        success: function (result) {
            $(`.question_row_${result.id}`).remove();

            $(".answeredQuestions > tbody").append(`
                <tr class="ans_question_row_${ result.id }">
                    <th> ${ result.id } </th>
                    <td> ${ result.text } </td>
                </tr>
            `);
            //document.querySelector(`.add_new_question`).value = "";
        },
        error: function () {
            alert("Question is not answered!");
        },
    });
};

const hideQuestion = (question_id) => {
    $.ajax({
        url: "question/hide/" + question_id,
        type: "PATCH",
        data: {
            question_id: parseInt(question_id),
        },
        success: function (result) {
            $(`.question_row_${result.id}`).remove();

            $(".hiddenQuestions > tbody").append(`
                <tr class="hidden_question_row_${ result.id }">
                    <th> ${ result.id } </th>
                    <td> ${ result.text }</td>
                </tr>
            `);
            //document.querySelector(`.add_new_question`).value = "";
        },
        error: function () {
            alert("Question is not hidden!");
        },
    });
};

// Lecture
const editLecture = (lecture_id) => {
    let name = document.getElementById("lecture_name"+ lecture_id).value;
    let start_time = document.getElementById("start_time"+ lecture_id).value;
    let end_time = document.getElementById("end_time"+ lecture_id).value;
    let repeat_rule = document.getElementById("repeat_rule"+ lecture_id).value;

    $.ajax({
        url: "edit/" + lecture_id,
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