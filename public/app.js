
// Set up for note buttons 

$(document).ready(function() {
    $("#noteForm").hide();
    $(".saveThisNote").hide();
    $(".deleteThisNote").hide();
    $(".editting").hide();
});

var id = "";
var titleofNote = "";

// Run the scrape route to get the articles

$(document).on("click", "#scrape", function() {
    location.href = "/scrape";
});

// Save the article in the users saved articles

$(document).on("click", ".save", function() {
    id = $(this).attr("data-id");
    $("#" + id).hide();

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            savedNews: true
        }
    });
});

// Remove the article from the saved page

$(document).on("click", "#deleteFromSaved", function() {
    id = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            savedNews: false           
        }
    });
    location.href = "/saved";
});

// Add a note to the article

$(document).on("click", "#addNote", function() {
    $("#noteForm").fadeIn("slow");
    titleofNote = $(this).attr("title-id").trim();
    id = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + id
    })
    .done(function(data) {

        if (data.note) {
            $("#noteTextArea").html(data.note.body);
        }
        $("#noteSection").show();
        $(".editting").show();
        $("#saveNote").show();
        $("#deleteNote").show();
        $(".saveOrDelete").hide();
        $("#title").html(titleofNote);
    });
});

// Save the note to the database

$(document).on("click", "#saveNote", function() {
    $("#noteForm").fadeOut("slow");
    var body = $("#noteTextArea").val().trim();
    $("#noteSection").hide();
    $("#saveNote").hide();
    $("#deleteNote").hide();
    $(".saveOrDelete").show();
    $(".editting").hide();

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            body: body
        }
    })
    .done(function(data) {

     // Empty the form

        document.getElementById("noteForm").reset();
    });
});

// Delete the note from the database

$(document).on("click", "#deleteNote", function() {
    $("#noteForm").fadeOut("slow");

    // Empty the form

    document.getElementById("noteForm").reset();
    $("#noteSection").hide();
    $(".editNote").hide();
    $(".editting").hide();
    $(".saveOrDelete").show();

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            body: ""
        }
    })
    .done(function(data) { 
        $("#saveNote").hide();
        $("#deleteNote").hide();  
    });
});
