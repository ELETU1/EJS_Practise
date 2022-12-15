//function to get data
exports.getDate = function (){
  const today = new Date()

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }

  return today.toLocaleString("en-US", options)
}

//function to get day
exports.getDay = function getDay(){
  const today = new Date()

  const options = {
    weekday: "long"
  }

  return today.toLocaleString("en-US", options)
}
