$(document).ready(() => {
  $.ajaxSetup({ cache: false, timeout: 360000 })
  const url = '/script_builder/poll_for_download/'
  let i = 0
  const taskId = $('#task-id').attr('value')
  (function worker() {
    $.getJSON(`${url}?task_id=${taskId}`, function(data) {
      console.log(data)
      if (data.filename) {
        const fileUrl = `${url}?filename=${data.filename}`
        $("#download").html(
          `<a href='${fileUrl}'>Click here if your download doesn't start automatically.</a>`
        )
        window.location.href = fileUrl
      } else {
        setTimeout(worker, 5000)
      }
    })
  })()
  setInterval(() => {
    i = ++i % 4
    $("#loading").html("loading"+Array(i+1).join("."))
  }, 1000)
})
