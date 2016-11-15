var sequence = new Sequence({id: "main"}), text = document.getElementById("number");
//sequence.clear();
document.getElementById("find").onclick = function () {
    sequence.scrollTo({id: text.value});
},
document.getElementById("form").onsubmit = function () {
    return false;
};