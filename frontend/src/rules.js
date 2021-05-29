const required = (val) => {
  return !!val || 'Required'
}

const email = (val) => {
  return (
    !val ||
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
    'Invalid Email'
  )
}

const url = (val) => {
  return (
    !val ||
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
      val,
    ) ||
    'Invalid URL'
  )
}

export default {
  required,
  email,
  url,
}
