// Initialize Firebase
var config = {
    apiKey: "AIzaSyCYGXI1MDYxSS42h_Z_A3BmzIaYGvLCHdM",
    authDomain: "train-scheduler-53125.firebaseapp.com",
    databaseURL: "https://train-scheduler-53125.firebaseio.com",
    projectId: "train-scheduler-53125",
    storageBucket: "train-scheduler-53125.appspot.com",
    messagingSenderId: "180270304693"
};
firebase.initializeApp(config);

// DB instance
var database = firebase.database();

//Button for adding Trains
$( "#target" ).submit(function() {
  	// User input
  	var trainName = $("#train-input").val().trim();
  	var destinationName = $("#destination-input").val().trim();
  	var timeStart = moment($("#time-input").val().trim(), "HH:mm").format("X");
  	var frequencyRate = $("#frequency-input").val().trim();

  	// Train object
  	var train = {
    	name: trainName,
    	destination: destinationName,
    	start: timeStart,
    	frequency: frequencyRate
  	};

	// Uploads train data to db
	database.ref().push(train);

	// Resets text fields
	$("#train-input").val("");
	$("#destination-input").val("");
	$("#time-input").val("");
	$("#frequency-input").val("");

  	return false;
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	// Data setup
	var trainName = childSnapshot.val().name;
	var destinationName = childSnapshot.val().destination;
	var timeStart = childSnapshot.val().start;
	var frequencyRate = childSnapshot.val().frequency;

    /***
	 * Time managment
     **/

    var firstTimeConverted = moment(timeStart, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % frequencyRate;
    var tMinutesTillTrain = frequencyRate - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var formattedTime = moment(nextTrain).format("HH:mm");

	// Adding elements to the table
	$("#train-table > tbody").append("<tr><td>" + trainName +
		"</td><td>" + destinationName +
		"</td><td>" + frequencyRate +
		"</td><td>" + formattedTime +
		"</td><td>" + tMinutesTillTrain + "</td>");
});