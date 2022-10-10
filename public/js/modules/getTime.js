function getTime() {
    let date = new Date();
    return "["+ 
    date.toLocaleString('en-us', { month: 'short' })  + " " +
    date.getDate() + " " + 

    ((date.getHours() < 10)?"0":"") + 
    date.getHours() +":"+ 
    ((date.getMinutes() < 10)?"0":"") + date.getMinutes() +":"+ 
    ((date.getSeconds() < 10)?"0":"") + date.getSeconds()+"]";
}

module.exports = getTime;