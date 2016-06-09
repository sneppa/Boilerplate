/* global fetch */

var token = "9c5ddd54107734f7d18335a5245c286b";
var tableStatus;
var tableTasks;
var formTasks;
var botnet = "http://localhost:8080/api/";
var intval;
var sortby = "id";
var sortorder = "ASC";

// OnLoad auf Document für Init
document.addEventListener('DOMContentLoaded', init, false);

// Warten bis DOM geladen ist, sonst funzt der querySelector nicht
function init()
{
    tableStatus = document.querySelector("#status-overview tbody");
    tableTasks = document.querySelector("#tasks-overview tbody");
    intval = setInterval(function () {fetchContent('Status');}, 3000); // Alle 3 Sekunden Tabelle aktualisieren
    fetchContent('Status');
    fetchContent('Tasks');

    // Alle Tabellen Header Spalten mit Sortierfunktion binden
    rowSorts = document.querySelectorAll("#status-overview thead th");
    for (i = 0; i < rowSorts.length; i++)
    {
        rowSorts[i].addEventListener("click", function () {
            if (sortby != this.className)
                sortorder = "ASC";
            else if (sortorder == "ASC")
                sortorder = "DESC";
            else
                sortorder = "ASC";
            sortby = this.className;
            
            fetchContent('Status');
        });
    }

    // Sidebar initialisieren
    initSidebar();

    // Formular binden
    formTasks = document.querySelector("#form");
    formTasks.addEventListener("submit",  function (e) { sendTaskForm(e); });
}

/* ------------------------------------- Menu & Content ------------------------------------- */

// Sidebar initalisieren & Buttons binden
function initSidebar()
{
    menuitems = document.querySelectorAll("menu a");
    for (i = 0; i < menuitems.length; i++)
    {
        menuitems[i].addEventListener("click", function (e) {

            links = document.querySelectorAll("menu a");
            for (i = 0; i < links.length; i++)
            {
                links[i].setAttribute("class", "");
            }

            this.setAttribute("class", "active");

            showSection(this.getAttribute("href"));

            // Firefox Fix ID-Anker
            e.preventDefault();
        });
    }
}

// Zeige Content mit der übergebenen ID
function showSection(id)
{
    sections = document.querySelectorAll("main > section");
    for (i = 0; i < sections.length; i++)
    {
        sections[i].setAttribute("class", "");
    }

    section = document.querySelector(id);
    section.setAttribute("class", "active");
}

/* ------------------------------------- Fetch & Insert ------------------------------------- */

// Hole Content
function fetchContent(type)
{
    fetch(botnet+type)
            .then(
                    function (response) {
                        if (response.status !== 200) {
                            console.log('Error: ' + response.status);
                            return;
                        }

                        // Examine the text in the response  
                        response.json().then(function (data) {
                            if (type == "Status")
                                insertStatusContent(data);
                            else if (type == "Tasks")
                                insertTasksContent(data);
                            else
                                console.log("Error bei fetchContent: Unbekannter API Aufruf");
                        });
                    }
            )
            .catch(function (err) {
                console.log('Error :-S', err);
            });
}

// Inhalte in Status Tabelle einfügen
function insertStatusContent(data)
{
    out = "";

    // Daten nach aktueller Spalte sortieren
    data.sort(function (a, b) {
        if (a[sortby] == b[sortby])
            return 0;
        if ((sortorder == "ASC" && a[sortby] < b[sortby]) || (sortorder == "DESC" && a[sortby] > b[sortby]))
            return -1;
        if ((sortorder == "ASC" && a[sortby] > b[sortby]) || (sortorder == "DESC" && a[sortby] < b[sortby]))
            return 1;
    });

    // Daten in Tabelle einfügen
    for (i = 0; i < data.length; i++)
    {
        out += "<tr>";
        row = data[i];
        out += "<td>" + row.id + "</td>";
        out += "<td>" + row.ip + "</td>";
        out += "<td>" + row.task + "</td>";
        out += "<td>" + row.workload + "</td>";
        out += '<td>';
        if (row.workload === 0)
            out += '<input type="button" name="Start" value="Start" class="start" onclick="changeStatus(' + row.id + ',true)"/>';
        else
            out += '<input type="button" name="Stop" value="Stop" class="stop" onclick="changeStatus(' + row.id + ',false)" />';
        out += '</td>';
        out += "</tr>";
    }
    tableStatus.innerHTML = out;
}

// Inhalte in Tasks Tabelle einfügen
function insertTasksContent(data)
{
    out = "";

    // Daten in Tabelle einfügen
    for (i = 0; i < data.length; i++)
    {
        row = data[i];
        out += "<tr>";
        out += "<td>" + row.id + "</td>";
        out += "<td>" + row.type + "</td>";
        out += "<td>" + row.data.input + "</td>";
        out += "<td>" + row.data.output + "</td>";
        out += "</tr>";
    }
    tableTasks.innerHTML = out;
}

/* ------------------------------------- Posts ------------------------------------- */

// Toggle für Status Changes
function changeStatus(id, status) 
{
    var data = {"id": id, "status": status};
    sendPost("Status", JSON.stringify(data), function() { fetchContent('Status') });
}

// Absenden des Taks Formular
function sendTaskForm(e)
{
    var data = {"type": document.getElementById("type").value, "data":  {"input": document.getElementById("datainput").value}};
    sendPost("Tasks", JSON.stringify(data), function() { fetchContent('Tasks') });
    e.preventDefault();
}

// Einfaches XHR 2 Post mit Token
function sendPost(api, json, callback)
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', botnet+api, true);
    xhr.responseType = "json";
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('token', token);
    
    xhr.onload = function (e) {
        if (this.status == 200) {
            var data = xhr.response;
            if (data !== null && data.message != "OK")
                alert("ERROR");
            else
                callback();
        }
    };

    xhr.send(json);
}

function testPostWithId1()
{
    var data = {"id": 2, "ip": "213.23.1.23"};
    sendPost("Status/2", JSON.stringify(data), function() { fetchContent('Status') } );
}
function testPostWithId2()
{
    var data = {"id": 2, "task": "55"};
    sendPost("Status/2", JSON.stringify(data), function() { fetchContent('Status') } );
}
function testPostWithId3()
{
    var data = {"id": 2, "workload": "0"};
    sendPost("Status/2", JSON.stringify(data), function() { fetchContent('Status') } );
}
function testPostWithId4()
{
    var data = {"id": 2, "ip": "213.1.1.1", "task": "5", "workload": "1"};
    sendPost("Status/2", JSON.stringify(data), function() { fetchContent('Status') } );
}
function testPostWithId5()
{
    var data = {"id": 1, "type": "crack-md5"};
    sendPost("Tasks/1", JSON.stringify(data), function() { fetchContent('Tasks') } );
}
function testPostWithId6()
{
    var data = {"id": 1, "data": {input: "ommel"}};
    sendPost("Tasks/1", JSON.stringify(data), function() { fetchContent('Tasks') } );
}
function testPostWithId7()
{
    var data = {"id": 1, "data": {output: "ömmel"}};
    sendPost("Tasks/1", JSON.stringify(data), function() { fetchContent('Tasks') } );
}