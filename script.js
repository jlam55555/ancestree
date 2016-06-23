$(function() {
  var people = [];
  var currentId = 0;
  var Person = function(fname, lname, age, gender, father, mother, spouse, siblings, children, alive) {
    this.id = currentId++;
    this.fname = fname;
    this.lname = lname;
    this.age = age;
    this.gender = gender;
    this.father = father || null;
    this.mother = mother || null;
    this.spouse = spouse || null;
    this.siblings = siblings || [];
    this.children = children || [];
    this.alive = alive != undefined ? alive : true;
  };
  var lookupPerson = function(id) {
    return people.filter(function(a) { return a.id == id; })[0] || false;
  };
  var createSelect = function() {
    people.sort(function(a, b) {
      return a.lname.localeCompare(b.lname) || a.fname.localeCompare(b.fname);
    });
    for(person in people)
      $("#people").append("<option value='" + people[person].id + "'>" + people[person].lname + ", " + people[person].fname + "</option>");
  };

  $("#age").keyup(function() {
    if($(this).val() >= 125)
      $(this).val(100);
    else if($(this).val() <= -1)
      $(this).val(0);
  });
  $("#submit").click(function() {
    var newPerson = new Person(
      $("#fname").val(),
      $("#lname").val(),
      parseInt($("#age").val()),
      $("#gender").val()
    );
    var personId = newPerson.id;
    people.push(newPerson);
    $("#people").empty();
    createSelect();
    $("#people").val(personId).change();
  });
  $("#people").change(function() {
    $("#peopleData").empty();
    var person = lookupPerson($(this).val());
    for(property in person) {
      var value;
      if(typeof person[property] == "object" && (person[property] === null || person[property].length == 0))
        value = "none <button class='addPersonButton' data-id='" + person.id + "' data-property='" + property + "'>Add?</button>";
      else if(typeof person[property] == "boolean")
        value = person[property] ? "true" : "false";
      else if(typeof person[property] == "string" || property == "id" || property == "age")
        value = person[property]
      else if(typeof person[property] == "number") {
        var innerPerson = lookupPerson(person[property]);
        value = "<button class='personButton' data-id='" + innerPerson.id + "'>" + innerPerson.lname + ", " + innerPerson.fname + "</button>";
      } else {
        value = "";
        for(inPerson in person[property]) {
          var innerPerson = lookupPerson(inPerson);
          value += "<button class='personButton' data-id='" + innerPerson.id + "'>" + innerPerson.lname + ", " + innerPerson.fname + "</button>";
        }
      }
      $("#peopleData").append(property + ": " + value + "<br />");
    }
  });
  $(document).on("click", ".addPersonButton", function() {
    var person = lookupPerson($(this).data("id"));
    var field = $(this).data("property");
    var peopleList = $("#people").clone().removeAttr("id").prepend("<option>Choose a person:</option>");
    peopleList.children().each(function() {
      if($(this).val() == person.id)
        $(this).remove();
    });
    $("body").append(peopleList);
    peopleList.change(function() {
      if(person[field] != null)
        person[field].push(parseInt($(this).val()));
      else
        person[field] = parseInt($(this).val());
      $(this).remove();
      $("#people").change();
    });
  });
  $(document).on("click", ".personButton", function() {
    $("#people").val($(this).data("id")).change();
  });
  $("#importJson").keyup(function(event) {
    if(event.which == 13) {
      people = $.parseJSON($(this).val());
      people.sort(function(a, b) { return a.id - b.id });
      currentId = people[people.length-1].id+1;
      createSelect();
      $("#people").change();
      $(this).val("");
    }
  });
  $("#exportJson").click(function() {
    console.log(JSON.stringify(people));
  });
});
